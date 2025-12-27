import {
  AutoPilotDeFi,
  ConfigUpdated,
  RebalanceExecuted,
  Paused,
  Unpaused,
  PermissionGranted,
  PermissionRevoked,
  PermissionPaused,
  PermissionResumed,
} from "generated";

// Handle ConfigUpdated Event
ConfigUpdated.handler(async ({ event, context }) => {
  const { user, spendingCap, slippageLimit } = event.params;

  await context.UserConfig.set({
    id: user,
    user: user,
    spendingCap: spendingCap,
    slippageLimit: slippageLimit,
    isPaused: false,
    hasActivePermission: false,
    permissionExpiry: 0n,
    lastUpdated: event.block.timestamp,
  });
});

// Handle PermissionGranted Event
PermissionGranted.handler(async ({ event, context }) => {
  const { user, amount, expiry, timestamp } = event.params;

  // Update UserConfig
  const existingConfig = await context.UserConfig.get(user);
  await context.UserConfig.set({
    id: user,
    user: user,
    spendingCap: amount,
    slippageLimit: existingConfig?.slippageLimit || 500n,
    isPaused: false,
    hasActivePermission: true,
    permissionExpiry: expiry,
    lastUpdated: event.block.timestamp,
  });

  // Create PermissionEvent
  await context.PermissionEvent.set({
    id: `${user}-${event.transaction.hash}-${event.logIndex}`,
    user: user,
    eventType: "GRANTED",
    amount: amount,
    expiry: expiry,
    timestamp: Number(timestamp),
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});

// Handle PermissionRevoked Event
PermissionRevoked.handler(async ({ event, context }) => {
  const { user, timestamp } = event.params;

  // Update UserConfig
  const existingConfig = await context.UserConfig.get(user);
  if (existingConfig) {
    await context.UserConfig.set({
      ...existingConfig,
      hasActivePermission: false,
      permissionExpiry: 0n,
      lastUpdated: event.block.timestamp,
    });
  }

  // Create PermissionEvent
  await context.PermissionEvent.set({
    id: `${user}-${event.transaction.hash}-${event.logIndex}`,
    user: user,
    eventType: "REVOKED",
    amount: null,
    expiry: null,
    timestamp: Number(timestamp),
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});

// Handle PermissionPaused Event
PermissionPaused.handler(async ({ event, context }) => {
  const { user, timestamp } = event.params;

  // Update UserConfig
  const existingConfig = await context.UserConfig.get(user);
  if (existingConfig) {
    await context.UserConfig.set({
      ...existingConfig,
      isPaused: true,
      lastUpdated: event.block.timestamp,
    });
  }

  // Create PermissionEvent
  await context.PermissionEvent.set({
    id: `${user}-${event.transaction.hash}-${event.logIndex}`,
    user: user,
    eventType: "PAUSED",
    amount: null,
    expiry: null,
    timestamp: Number(timestamp),
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});

// Handle PermissionResumed Event
PermissionResumed.handler(async ({ event, context }) => {
  const { user, timestamp } = event.params;

  // Update UserConfig
  const existingConfig = await context.UserConfig.get(user);
  if (existingConfig) {
    await context.UserConfig.set({
      ...existingConfig,
      isPaused: false,
      lastUpdated: event.block.timestamp,
    });
  }

  // Create PermissionEvent
  await context.PermissionEvent.set({
    id: `${user}-${event.transaction.hash}-${event.logIndex}`,
    user: user,
    eventType: "RESUMED",
    amount: null,
    expiry: null,
    timestamp: Number(timestamp),
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});

// Handle Paused Event
Paused.handler(async ({ event, context }) => {
  const { user } = event.params;

  const existingConfig = await context.UserConfig.get(user);
  if (existingConfig) {
    await context.UserConfig.set({
      ...existingConfig,
      isPaused: true,
      lastUpdated: event.block.timestamp,
    });
  }
});

// Handle Unpaused Event
Unpaused.handler(async ({ event, context }) => {
  const { user } = event.params;

  const existingConfig = await context.UserConfig.get(user);
  if (existingConfig) {
    await context.UserConfig.set({
      ...existingConfig,
      isPaused: false,
      lastUpdated: event.block.timestamp,
    });
  }
});

// Handle RebalanceExecuted Event
RebalanceExecuted.handler(async ({ event, context }) => {
  const { user, tokenIn, tokenOut, amountIn, amountOut, gasUsed } = event.params;

  // Create RebalanceAction
  await context.RebalanceAction.set({
    id: `${user}-${event.transaction.hash}-${event.logIndex}`,
    user: user,
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amountIn: amountIn,
    amountOut: amountOut,
    gasUsed: gasUsed,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update GasAnalytics
  const gasAnalyticsId = `gas-${user}`;
  const existingGasAnalytics = await context.GasAnalytics.get(gasAnalyticsId);

  if (existingGasAnalytics) {
    const newTotalRebalances = existingGasAnalytics.totalRebalances + 1;
    const newTotalGasUsed = existingGasAnalytics.totalGasUsed + gasUsed;
    const newAverageGas = newTotalGasUsed / BigInt(newTotalRebalances);
    
    // Estimate savings (assuming 30% gas savings vs manual)
    const estimatedSavings = (gasUsed * 30n) / 100n;
    const newEstimatedSavingsUSD = existingGasAnalytics.estimatedSavingsUSD + estimatedSavings;

    await context.GasAnalytics.set({
      ...existingGasAnalytics,
      totalRebalances: newTotalRebalances,
      totalGasUsed: newTotalGasUsed,
      averageGasPerRebalance: newAverageGas,
      estimatedSavingsUSD: newEstimatedSavingsUSD,
      lastUpdated: event.block.timestamp,
    });
  } else {
    await context.GasAnalytics.set({
      id: gasAnalyticsId,
      user: user,
      totalRebalances: 1,
      totalGasUsed: gasUsed,
      averageGasPerRebalance: gasUsed,
      estimatedSavingsUSD: (gasUsed * 30n) / 100n,
      lastUpdated: event.block.timestamp,
    });
  }

  // Update DailyStats
  const dateStr = new Date(event.block.timestamp * 1000).toISOString().split('T')[0];
  const dailyStatsId = `daily-${dateStr}`;
  const existingDailyStats = await context.DailyStats.get(dailyStatsId);

  if (existingDailyStats) {
    await context.DailyStats.set({
      ...existingDailyStats,
      totalRebalances: existingDailyStats.totalRebalances + 1,
      totalGasUsed: existingDailyStats.totalGasUsed + gasUsed,
      totalVolumeUSD: existingDailyStats.totalVolumeUSD + amountIn,
    });
  } else {
    await context.DailyStats.set({
      id: dailyStatsId,
      date: dateStr,
      totalRebalances: 1,
      totalGasUsed: gasUsed,
      uniqueUsers: 1,
      totalVolumeUSD: amountIn,
    });
  }
});
