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
    
     transaction = await crowdfunding
       .connect(seller)
       .createCampaign(
         seller.address,
         "Test Campaign",
         "Description",
         1000,
         Math.floor(Date.now() / 1000) + 259200
       );

     await transaction.wait();

    });

    it("it should create a campaign", async function () {
      
      
      
      const campaign = await crowdfunding.campaigns(0);
     expect(campaign.owner).to.equal(seller.address);
     expect(campaign.title).to.equal("Test Campaign");

    // expect(await crowdfunding.target).to.equal(
    //   `0x5FbDB2315678afecb367f032d93F642f64180aa3`
    // );
  });



    it('Should donate to a campaign', async function () {
   

    // const initialBalance = await owner.getBalance();
    await crowdfunding.connect(addr2).donateToCampaign(8, { value: 500 });

    const campaign = await crowdfunding.campaigns(8);
    console.log("🚀 ~ ampaign:", campaign)

    expect(campaign.donators[8]).to.equal(addr2.address);
    expect(campaign.donations[8]).to.equal(500);
//     expect(await owner.getBalance()).to.equal(initialBalance.add(500));
  });

    it('Should get totalcampaign', async function () {


    const campaign = await crowdfunding.getCampaigns();
console.log("🚀 ~ campaign:", campaign)

//     expect(campaign.donators[0]).to.equal(addr1.address);
//     expect(campaign.donations[0]).to.equal(500);
  });


});
