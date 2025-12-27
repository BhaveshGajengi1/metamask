// frontend/src/lib/permissions.ts
import { BrowserProvider, ethers } from 'ethers';

// First, let's check if Smart Accounts Kit is available
export const isAdvancedPermissionsSupported = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
            // Try to load Smart Accounts Kit dynamically
            const { createPermissionClient } = await import('@metamask/smart-accounts-kit');
            return true;
        } catch (error) {
            console.warn('Smart Accounts Kit not available:', error);
            return false;
        }
    }
    return false;
};

// Advanced Permissions using Smart Accounts Kit
export const setupAdvancedPermissions = async () => {
    try {
        const { createPermissionClient } = await import('@metamask/smart-accounts-kit');
        return await createPermissionClient();
    } catch (error) {
        console.error('Failed to setup Advanced Permissions:', error);
        throw error;
    }
};

export const requestRebalancePermission = async (
    userAddress: string,
    monthlyCap: string, // in token units (e.g., "1000000000" for 1000 USDC with 6 decimals)
    tokenAddress: string,
    contractAddress: string,
    chainId: number
): Promise<any> => {
    try {
        const client = await setupAdvancedPermissions();

        const permission = {
            type: 'ERC20' as const,
            token: tokenAddress,
            amount: monthlyCap,
            interval: 2592000, // 30 days in seconds
            spender: contractAddress,
            actions: ['swap', 'transfer'] as const,
            maxSlippage: '500', // 5% in basis points (500 = 5%)
            chainId: chainId,
        };

        console.log('Requesting permission:', permission);

        const result = await client.requestPermissions([permission]);
        console.log('Permission granted:', result);

        // Store permission info
        if (result && result[0]) {
            const permissionInfo = {
                id: result[0].id,
                status: 'active' as const,
                grantedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                details: permission,
            };

            localStorage.setItem(`permission_${userAddress}`, JSON.stringify(permissionInfo));
            localStorage.setItem('activePermissionId', result[0].id);
        }

        return result;
    } catch (error) {
        console.error('Permission request failed:', error);
        throw error;
    }
};

export const revokePermission = async (permissionId: string): Promise<void> => {
    try {
        const client = await setupAdvancedPermissions();
        await client.revokePermission(permissionId);

        // Clear from storage
        localStorage.removeItem('activePermissionId');
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('permission_')) {
                localStorage.removeItem(key);
            }
        });

        console.log('Permission revoked:', permissionId);
    } catch (error) {
        console.error('Failed to revoke permission:', error);
        throw error;
    }
};

export const pausePermission = async (permissionId: string): Promise<void> => {
    try {
        const client = await setupAdvancedPermissions();
        await client.updatePermission(permissionId, { paused: true });

        // Update storage
        const userAddress = Object.keys(localStorage).find(key =>
            key.startsWith('permission_')
        )?.replace('permission_', '');

        if (userAddress) {
            const permissionInfo = JSON.parse(localStorage.getItem(`permission_${userAddress}`) || '{}');
            permissionInfo.status = 'paused';
            localStorage.setItem(`permission_${userAddress}`, JSON.stringify(permissionInfo));
        }

        console.log('Permission paused:', permissionId);
    } catch (error) {
        console.error('Failed to pause permission:', error);
        throw error;
    }
};

export const resumePermission = async (permissionId: string): Promise<void> => {
    try {
        const client = await setupAdvancedPermissions();
        await client.updatePermission(permissionId, { paused: false });

        // Update storage
        const userAddress = Object.keys(localStorage).find(key =>
            key.startsWith('permission_')
        )?.replace('permission_', '');

        if (userAddress) {
            const permissionInfo = JSON.parse(localStorage.getItem(`permission_${userAddress}`) || '{}');
            permissionInfo.status = 'active';
            localStorage.setItem(`permission_${userAddress}`, JSON.stringify(permissionInfo));
        }

        console.log('Permission resumed:', permissionId);
    } catch (error) {
        console.error('Failed to resume permission:', error);
        throw error;
    }
};

export const getActivePermission = (userAddress: string) => {
    const permissionData = localStorage.getItem(`permission_${userAddress}`);
    return permissionData ? JSON.parse(permissionData) : null;
};

export const getAllPermissions = () => {
    const permissions = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('permission_')) {
            const permission = JSON.parse(localStorage.getItem(key) || '{}');
            permissions.push(permission);
        }
    }
    return permissions;
};

// Fallback: Standard ERC-20 approval (for compatibility)
export const requestStandardApproval = async (
    tokenAddress: string,
    spender: string,
    amount: string,
    signer: ethers.Signer
): Promise<any> => {
    const erc20Abi = [
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
    ];

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

    // Check current allowance
    const owner = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(owner, spender);

    if (currentAllowance >= ethers.parseUnits(amount, 6)) {
        console.log('Sufficient allowance already exists');
        return { alreadyApproved: true };
    }

    // Request approval
    const tx = await tokenContract.approve(spender, ethers.parseUnits(amount, 6));
    await tx.wait();

    console.log('Standard approval completed:', tx.hash);
    return { hash: tx.hash, type: 'standard' };
};