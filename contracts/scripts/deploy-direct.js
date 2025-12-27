const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    try {
        console.log("=== Direct Ethers Deployment ===");

        // Setup provider and wallet
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com");
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        console.log("Deploying from:", wallet.address);

        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log("Balance:", ethers.formatEther(balance), "ETH");

        // Load compiled contract
        const artifactPath = path.join(__dirname, "../artifacts/contracts/AutoPilot.sol/AutoPilotDeFi.json");
        console.log("Loading artifact from:", artifactPath);

        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        console.log("Artifact loaded successfully");

        // Create contract factory
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
        console.log("Contract factory created");

        // Deploy
        console.log("Deploying contract...");
        const contract = await factory.deploy();
        console.log("Deployment transaction sent:", contract.deploymentTransaction().hash);

        // Wait for deployment
        console.log("Waiting for confirmation...");
        await contract.waitForDeployment();

        const address = await contract.getAddress();
        console.log("=== Deployment Successful ===");
        console.log("Contract Address:", address);
        console.log("CONTRACT_ADDRESS=" + address);

        return address;
    } catch (error) {
        console.error("=== Deployment Failed ===");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
