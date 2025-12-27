const hre = require("hardhat");

async function main() {
    try {
        console.log("=== Starting Deployment ===");
        console.log("Network:", hre.network.name);

        // Get signer
        const [signer] = await hre.ethers.getSigners();
        console.log("Deploying from:", signer.address);

        // Check balance
        const balance = await hre.ethers.provider.getBalance(signer.address);
        console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

        // Get contract factory
        console.log("Getting contract factory...");
        const AutoPilot = await hre.ethers.getContractFactory("AutoPilotDeFi");
        console.log("Contract factory created successfully");

        // Deploy
        console.log("Deploying contract...");
        const autoPilot = await AutoPilot.deploy();
        console.log("Deployment transaction sent");

        // Wait for deployment
        console.log("Waiting for deployment confirmation...");
        await autoPilot.waitForDeployment();
        console.log("Deployment confirmed");

        // Get address
        const address = await autoPilot.getAddress();
        console.log("=== Deployment Successful ===");
        console.log("Contract Address:", address);
        console.log("CONTRACT_ADDRESS=" + address);

        return address;
    } catch (error) {
        console.error("=== Deployment Failed ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
