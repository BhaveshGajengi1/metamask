const hre = require("hardhat");

async function main() {
    console.log("Deploying AutoPilotDeFi to Sepolia...");

    const AutoPilot = await hre.ethers.getContractFactory("AutoPilotDeFi");
    console.log("Contract factory created");

    const autoPilot = await AutoPilot.deploy();
    console.log("Deployment transaction sent");

    await autoPilot.waitForDeployment();
    console.log("Deployment confirmed");

    const address = await autoPilot.getAddress();
    console.log("AutoPilotDeFi deployed to:", address);
    console.log("CONTRACT_ADDRESS=" + address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
