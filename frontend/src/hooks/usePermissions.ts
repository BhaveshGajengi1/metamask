// src/hooks/usePermissions.ts
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, TOKENS } from '../lib/constants';

// Update your existing permissions.ts with these interfaces
export interface Permission {
  id?: string;
  status: 'active' | 'paused' | 'revoked';
  grantedAt: string;
  expiresAt: string;
  details: {
    type: 'ERC20';
    token: string;
    amount: string;
    interval: number;
    spender: string;
    actions: readonly string[];
    maxSlippage: string;
    chainId: number;
  };
}

export const usePermissions = (
  userAddress: string,
  signer: any | null,
  chainId: number
) => {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (userAddress) {
      const perm = getActivePermission(userAddress);
      setPermission(perm);
      checkAdvancedSupport();
    }
  }, [userAddress]);

  const checkAdvancedSupport = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Check for Smart Accounts Kit
        await import('@metamask/smart-accounts-kit');
        setIsAdvanced(true);
      } catch (error) {
        console.warn('Smart Accounts Kit not available:', error);
        setIsAdvanced(false);
      }
    }
  };

  const getActivePermission = (address: string): Permission | null => {
    const data = localStorage.getItem(`permission_${address}`);
    return data ? JSON.parse(data) : null;
  };

  const grantPermission = useCallback(async (monthlyCap: string) => {
    if (!userAddress) {
      setError('No user address');
      return null;
    }

    setLoading(true);
    setError('');

    try {
      let newPermission: Permission;

      if (isAdvanced && signer) {
        // Advanced Permissions
        const { createPermissionClient } = await import('@metamask/smart-accounts-kit');
        const client = await createPermissionClient();

        const permissionRequest = {
          type: 'ERC20' as const,
          token: TOKENS.USDC,
          amount: ethers.parseUnits(monthlyCap, 6).toString(),
          interval: 2592000,
          spender: CONTRACT_ADDRESS,
          actions: ['swap', 'transfer'] as const,
          maxSlippage: '500',
          chainId: chainId,
        };

        const result = await client.requestPermissions([permissionRequest]);
        
        if (!result || !result[0]) {
          throw new Error('No permission granted');
        }

        newPermission = {
          id: result[0].id,
          status: 'active',
          grantedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          details: permissionRequest,
        };
      } else if (signer) {
        // Standard ERC-20 approval
        const erc20Abi = ['function approve(address spender, uint256 amount) returns (bool)'];
        const tokenContract = new ethers.Contract(TOKENS.USDC, erc20Abi, signer);
        
        const tx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.parseUnits(monthlyCap, 6));
        await tx.wait();

        newPermission = {
          status: 'active',
          grantedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          details: {
            type: 'ERC20',
            token: TOKENS.USDC,
            amount: ethers.parseUnits(monthlyCap, 6).toString(),
            interval: 2592000,
            spender: CONTRACT_ADDRESS,
            actions: ['swap', 'transfer'],
            maxSlippage: '500',
            chainId,
          },
        };
      } else {
        throw new Error('No signer available');
      }

      // Store permission
      localStorage.setItem(`permission_${userAddress}`, JSON.stringify(newPermission));
      setPermission(newPermission);
      
      return newPermission;
    } catch (err: any) {
      setError(err.message || 'Failed to grant permission');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userAddress, signer, chainId, isAdvanced]);

  const pausePermission = useCallback(() => {
    if (!permission || !userAddress) return;
    
    const updated = { ...permission, status: 'paused' as const };
    localStorage.setItem(`permission_${userAddress}`, JSON.stringify(updated));
    setPermission(updated);
  }, [permission, userAddress]);

  const resumePermission = useCallback(() => {
    if (!permission || !userAddress) return;
    
    const updated = { ...permission, status: 'active' as const };
    localStorage.setItem(`permission_${userAddress}`, JSON.stringify(updated));
    setPermission(updated);
  }, [permission, userAddress]);

  const revokePermission = useCallback(() => {
    if (!userAddress) return;
    
    localStorage.removeItem(`permission_${userAddress}`);
    setPermission(null);
  }, [userAddress]);

  return {
    permission,
    isAdvanced,
    loading,
    error,
    grantPermission,
    pausePermission,
    resumePermission,
    revokePermission,
    setError,
  };
};