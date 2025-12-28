import { Contract, parseUnits, type Signer } from 'ethers';

const CONTRACT_ABI = [
    "function grantPermission(uint256 _spendingCap, uint256 _durationDays) external",
    "function revokePermission() external",
    "function getPermission(address user) external view returns (uint256, uint256, uint256, bool, uint256)",
    "function setConfig(uint256 _slippageLimitBps) external",
    "function togglePause(bool _pause) external",
    "event PermissionGranted(address indexed user, uint256 spendingCap, uint256 expiry, uint256 timestamp)",
    "event PermissionRevoked(address indexed user, uint256 timestamp)",
    "event PermissionUsed(address indexed user, uint256 amount, uint256 remaining)"
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

console.log('Contract Address:', CONTRACT_ADDRESS);

export interface SmartAccountPermission {
    spendingCap: bigint;
    spent: bigint;
    expiry: bigint;
    active: boolean;
    grantedAt: bigint;
}

export class SmartAccountManager {
    private contract: Contract | null = null;

    // Initialize with signer from WalletContext
    initialize(signer: Signer) {
        if (!signer) {
            throw new Error("Signer is required");
        }
        this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        console.log('SmartAccountManager initialized with contract:', CONTRACT_ADDRESS);
    }

    async grantPermission(spendingCapUSD: number, durationDays: number): Promise<string> {
        if (!this.contract) throw new Error("Not initialized. Please connect wallet first.");

        const spendingCap = parseUnits(spendingCapUSD.toString(), 6); // USDC has 6 decimals

        console.log('Granting permission:', { spendingCapUSD, durationDays, spendingCap: spendingCap.toString() });

        const tx = await this.contract.grantPermission(spendingCap, durationDays);
        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.hash);

        return receipt.hash;
    }

    async revokePermission(): Promise<string> {
        if (!this.contract) throw new Error("Not initialized. Please connect wallet first.");

        const tx = await this.contract.revokePermission();
        const receipt = await tx.wait();

        return receipt.hash;
    }

    async getPermission(address: string): Promise<SmartAccountPermission> {
        if (!this.contract) throw new Error("Not initialized. Please connect wallet first.");

        const result = await this.contract.getPermission(address);

        return {
            spendingCap: result[0],
            spent: result[1],
            expiry: result[2],
            active: result[3],
            grantedAt: result[4]
        };
    }

    async setSlippage(slippageBps: number): Promise<string> {
        if (!this.contract) throw new Error("Not initialized. Please connect wallet first.");

        const tx = await this.contract.setConfig(slippageBps);
        const receipt = await tx.wait();

        return receipt.hash;
    }

    async togglePause(pause: boolean): Promise<string> {
        if (!this.contract) throw new Error("Not initialized. Please connect wallet first.");

        const tx = await this.contract.togglePause(pause);
        const receipt = await tx.wait();

        return receipt.hash;
    }

    isExpired(permission: SmartAccountPermission): boolean {
        return Number(permission.expiry) * 1000 < Date.now();
    }

    getRemainingCap(permission: SmartAccountPermission): bigint {
        return permission.spendingCap - permission.spent;
    }

    getExpiryDate(permission: SmartAccountPermission): Date {
        return new Date(Number(permission.expiry) * 1000);
    }
}

export const smartAccountManager = new SmartAccountManager();

