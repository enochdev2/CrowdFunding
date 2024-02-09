const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { ethers  } = require("ethers");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("CrowdFunding", function () {
  let crowdfunding;
  let owner;
  let seller;
  let addr2;
  let addrs;

  // async function deployOneYearLockFixture
  beforeEach(async () => {
    // Setup accounts
     [owner, seller, addr2, addrs] = await ethers.getSigners();

    // Deploy Real Estate
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
     crowdfunding = await CrowdFunding.deploy();
  });

  it("it should create a campaign", async function () {
    //  let [owner, seller, inspector, lender] = await ethers.getSigners()
    // const targetAmount = ethers.utils.parseUnits("1000", "ether");
    //  Creating Campaign
    transaction = await crowdfunding
      .connect(seller)
      .createCampaign(
        seller.address,
        'Test Campaign',
        "Description",
        1000,
        Math.floor(Date.now() / 1000) + 259200
      );

    await transaction.wait();

     const campaign = await crowdfunding.campaigns(0);

     expect(campaign.owner).to.equal(seller.address);
     expect(campaign.title).to.equal("Test Campaign");

    // expect(await crowdfunding.target).to.equal(
    //   `0x5FbDB2315678afecb367f032d93F642f64180aa3`
    // );
  });


});
