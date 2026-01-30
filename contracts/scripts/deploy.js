const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying FX Rate Lock Platform Contracts to Base L2...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString(), "\n");

    // Configuration
    const AAVE_POOL_ADDRESS = process.env.AAVE_POOL_ADDRESS || "0x0000000000000000000000000000000000000000";
    const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base mainnet USDC
    const AUSDC_ADDRESS = process.env.AUSDC_ADDRESS || "0x0000000000000000000000000000000000000000";
    const CHAINLINK_KES_USD_FEED = process.env.CHAINLINK_KES_USD_FEED || "0x0000000000000000000000000000000000000000";

    // Deploy OracleConsumer
    console.log("📡 Deploying OracleConsumer...");
    const OracleConsumer = await hre.ethers.getContractFactory("OracleConsumer");
    const oracleConsumer = await OracleConsumer.deploy(CHAINLINK_KES_USD_FEED);
    await oracleConsumer.waitForDeployment();
    const oracleAddress = await oracleConsumer.getAddress();
    console.log("✅ OracleConsumer deployed to:", oracleAddress, "\n");

    // Deploy CircuitBreaker
    console.log("🔴 Deploying CircuitBreaker...");
    const CircuitBreaker = await hre.ethers.getContractFactory("CircuitBreaker");
    const circuitBreaker = await CircuitBreaker.deploy();
    await circuitBreaker.waitForDeployment();
    const circuitBreakerAddress = await circuitBreaker.getAddress();
    console.log("✅ CircuitBreaker deployed to:", circuitBreakerAddress, "\n");

    // Deploy RateLockManager
    console.log("🔒 Deploying RateLockManager...");
    const RateLockManager = await hre.ethers.getContractFactory("RateLockManager");
    const rateLockManager = await RateLockManager.deploy();
    await rateLockManager.waitForDeployment();
    const rateLockAddress = await rateLockManager.getAddress();
    console.log("✅ RateLockManager deployed to:", rateLockAddress, "\n");

    // Deploy AavePoolManager
    console.log("💰 Deploying AavePoolManager...");
    const AavePoolManager = await hre.ethers.getContractFactory("AavePoolManager");
    const aavePoolManager = await AavePoolManager.deploy(
        AAVE_POOL_ADDRESS,
        USDC_ADDRESS,
        AUSDC_ADDRESS
    );
    await aavePoolManager.waitForDeployment();
    const aavePoolAddress = await aavePoolManager.getAddress();
    console.log("✅ AavePoolManager deployed to:", aavePoolAddress, "\n");

    // Deploy HedgeManager
    console.log("📊 Deploying HedgeManager...");
    const HedgeManager = await hre.ethers.getContractFactory("HedgeManager");
    const hedgeManager = await HedgeManager.deploy();
    await hedgeManager.waitForDeployment();
    const hedgeAddress = await hedgeManager.getAddress();
    console.log("✅ HedgeManager deployed to:", hedgeAddress, "\n");

    // Summary
    console.log("=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("Network:", hre.network.name);
    console.log("Deployer:", deployer.address);
    console.log("\nContract Addresses:");
    console.log("-------------------");
    console.log("OracleConsumer:    ", oracleAddress);
    console.log("CircuitBreaker:    ", circuitBreakerAddress);
    console.log("RateLockManager:   ", rateLockAddress);
    console.log("AavePoolManager:   ", aavePoolAddress);
    console.log("HedgeManager:      ", hedgeAddress);
    console.log("=".repeat(60));

    // Save deployment addresses
    const fs = require("fs");
    const deploymentInfo = {
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            OracleConsumer: oracleAddress,
            CircuitBreaker: circuitBreakerAddress,
            RateLockManager: rateLockAddress,
            AavePoolManager: aavePoolAddress,
            HedgeManager: hedgeAddress
        },
        config: {
            aavePool: AAVE_POOL_ADDRESS,
            usdc: USDC_ADDRESS,
            aUsdc: AUSDC_ADDRESS,
            chainlinkFeed: CHAINLINK_KES_USD_FEED
        }
    };

    const deploymentPath = `./deployments/${hre.network.name}-${Date.now()}.json`;
    fs.mkdirSync("./deployments", { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("\n💾 Deployment info saved to:", deploymentPath);

    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n🔍 To verify contracts on Basescan, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${oracleAddress} ${CHAINLINK_KES_USD_FEED}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${circuitBreakerAddress}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${rateLockAddress}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${aavePoolAddress} ${AAVE_POOL_ADDRESS} ${USDC_ADDRESS} ${AUSDC_ADDRESS}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${hedgeAddress}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
