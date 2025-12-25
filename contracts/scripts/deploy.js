const hre = require("hardhat");

async function main() {
    const AutoPilot = await hre.ethers.getContractFactory("AutoPilotDeFi");
    const autoPilot = await AutoPilot.deploy();

    await autoPilot.waitForDeployment();

    console.log("AutoPilotDeFi deployed to:", await autoPilot.getAddress());

    // Log for frontend usage
    const fs = require("fs");
    const address = await autoPilot.getAddress();

    if (!fs.existsSync("../frontend/src/contracts")) {
        fs.mkdirSync("../frontend/src/contracts", { recursive: true });
    }

    fs.writeFileSync(
        "../frontend/src/contracts/address.json",
        JSON.stringify({ AutoPilot: address }, null, 2)
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
