import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { smartAccountManager, SmartAccountPermission } from '../lib/smartAccount';
import { formatUnits } from 'ethers';

export function useSmartAccount() {
    const { userAddress, signer } = useWallet();
    const [permission, setPermission] = useState<SmartAccountPermission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPermission = useCallback(async () => {
        if (!userAddress || !signer) {
            setPermission(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const perm = await smartAccountManager.getPermission(userAddress);
            setPermission(perm);
        } catch (err) {
            console.error('Failed to load permission:', err);
            setError(err instanceof Error ? err.message : 'Failed to load permission');
        } finally {
            setLoading(false);
        }
    }, [userAddress, signer]);

    useEffect(() => {
        loadPermission();
    }, [loadPermission]);

    const grantPermission = async (spendingCapUSD: number, durationDays: number) => {
        try {
            setLoading(true);
            setError(null);
            await smartAccountManager.grantPermission(spendingCapUSD, durationDays);
            await loadPermission();
            return true;
        } catch (err) {
            console.error('Failed to grant permission:', err);
            setError(err instanceof Error ? err.message : 'Failed to grant permission');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const revokePermission = async () => {
        try {
            setLoading(true);
            setError(null);
            await smartAccountManager.revokePermission();
            await loadPermission();
            return true;
        } catch (err) {
            console.error('Failed to revoke permission:', err);
            setError(err instanceof Error ? err.message : 'Failed to revoke permission');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const togglePause = async (pause: boolean) => {
        try {
            setLoading(true);
            setError(null);
            await smartAccountManager.togglePause(pause);
            return true;
        } catch (err) {
            console.error('Failed to toggle pause:', err);
            setError(err instanceof Error ? err.message : 'Failed to toggle pause');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const formatPermission = () => {
        if (!permission) return null;

        return {
            spendingCap: formatUnits(permission.spendingCap, 6),
            spent: formatUnits(permission.spent, 6),
            remaining: formatUnits(smartAccountManager.getRemainingCap(permission), 6),
            expiryDate: smartAccountManager.getExpiryDate(permission),
            isExpired: smartAccountManager.isExpired(permission),
            active: permission.active
        };
    };

    return {
        permission,
        formattedPermission: formatPermission(),
        loading,
        error,
        grantPermission,
        revokePermission,
        togglePause,
        refresh: loadPermission
    };
}
