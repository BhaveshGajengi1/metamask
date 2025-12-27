import { AutoPilotDeFi } from "generated";

AutoPilotDeFi.PermissionGranted.handler(async ({ event, context }) => {
    const { user, spendingCap, expiry, timestamp } = event.params;

    const permission = {
        id: `${user}-${timestamp}`,
        user: user,
        spendingCap: spendingCap,
        spent: 0n,
        expiry: expiry,
        active: true,
        grantedAt: timestamp,
        revokedAt: null,
        timestamp: timestamp
    };

    context.Permission.set(permission);

    const permEvent = {
        id: `${event.transaction.hash}-${event.logIndex}`,
        user: user,
        eventType: "GRANTED",
        amount: null,
        remaining: null,
        timestamp: timestamp,
        blockNumber: BigInt(event.block.number),
        transactionHash: event.transaction.hash
    };

    context.PermissionEvent.set(permEvent);
});

AutoPilotDeFi.PermissionRevoked.handler(async ({ event, context }) => {
    const { user, timestamp } = event.params;

    const permissions = await context.Permission.getWhere.user.eq(user);

    for (const perm of permissions) {
        if (perm.active) {
            context.Permission.set({
                ...perm,
                active: false,
                revokedAt: timestamp
            });
        }
    }

    const permEvent = {
        id: `${event.transaction.hash}-${event.logIndex}`,
        user: user,
        eventType: "REVOKED",
        amount: null,
        remaining: null,
        timestamp: timestamp,
        blockNumber: BigInt(event.block.number),
        transactionHash: event.transaction.hash
    };

    context.PermissionEvent.set(permEvent);
});

AutoPilotDeFi.PermissionUsed.handler(async ({ event, context }) => {
    const { user, amount, remaining } = event.params;

    const permissions = await context.Permission.getWhere.user.eq(user);

    for (const perm of permissions) {
        if (perm.active) {
            context.Permission.set({
                ...perm,
                spent: perm.spendingCap - remaining
            });
        }
    }

    const permEvent = {
        id: `${event.transaction.hash}-${event.logIndex}`,
        user: user,
        eventType: "USED",
        amount: amount,
        remaining: remaining,
        timestamp: BigInt(event.block.timestamp),
        blockNumber: BigInt(event.block.number),
        transactionHash: event.transaction.hash
    };

    context.PermissionEvent.set(permEvent);
});

AutoPilotDeFi.Rebalanced.handler(async ({ event, context }) => {
    const { user, tokenIn, tokenOut, amountIn, amountOut, gasUsed, timestamp } = event.params;

    const rebalance = {
        id: `${event.transaction.hash}-${event.logIndex}`,
        user: user,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn: amountIn,
        amountOut: amountOut,
        gasUsed: gasUsed,
        timestamp: timestamp,
        blockNumber: BigInt(event.block.number),
        transactionHash: event.transaction.hash
    };

    context.Rebalance.set(rebalance);

    const statsId = user.toLowerCase();
    let stats = await context.UserStats.get(statsId);

    if (!stats) {
        stats = {
            id: statsId,
            user: user,
            totalRebalances: 0,
            totalGasUsed: 0n,
            totalSpent: 0n,
            lastRebalance: null
        };
    }

    context.UserStats.set({
        ...stats,
        totalRebalances: stats.totalRebalances + 1,
        totalGasUsed: stats.totalGasUsed + gasUsed,
        totalSpent: stats.totalSpent + amountIn,
        lastRebalance: timestamp
    });

    const dateStr = new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
    let daily = await context.DailyMetrics.get(dateStr);

    if (!daily) {
        daily = {
            id: dateStr,
            date: dateStr,
            totalRebalances: 0,
            totalGasUsed: 0n,
            uniqueUsers: 0,
            totalVolume: 0n
        };
    }

    context.DailyMetrics.set({
        ...daily,
        totalRebalances: daily.totalRebalances + 1,
        totalGasUsed: daily.totalGasUsed + gasUsed,
        totalVolume: daily.totalVolume + amountIn
    });
});
