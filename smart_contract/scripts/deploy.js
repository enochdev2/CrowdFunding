
const hre = require("hardhat");

async function main() {
 const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
 const crowdfunding = await CrowdFunding.deploy();
  await crowdfunding.waitForDeployment();

  console.log(
     `Crowdfunding address to ${crowdfunding.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
