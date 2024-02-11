const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { ethers  } = require("ethers");

describe("CrowdFunding", function () {
  let crowdfunding;
  let owner;
  let seller;
  let addr2;
  let addrs;

  beforeEach(async () => {
    // Setup accounts
    [owner, seller, addr2, addrs] = await ethers.getSigners();

    // Deploy CrowdFunding
    const CrowdFundings = await ethers.getContractFactory("CrowdFunding");
    crowdfunding = await CrowdFundings.deploy();

    transaction = await crowdfunding.connect(seller).createCampaign(
      seller.address,
      "Test Campaign",
      "Description",
      "https://online.stanford.edu/sites/default/files/inline-images/1600X900-How-does-blockchain-work.jpg",
      1000,
      Math.floor(Date.now() / 1000) + 259200
    );

    await transaction.wait();
  });

  it("it should create a campaign", async function () {
    const campaign = await crowdfunding.campaigns(0);
    expect(campaign.owner).to.equal(seller.address);
    expect(campaign.image).to.equal(
      "https://online.stanford.edu/sites/default/files/inline-images/1600X900-How-does-blockchain-work.jpg"
    );

   
  });

  it("should donate to campaign and record donation correctly", async function () {
    const campaignId = 0; // Assuming the campaign ID to test is 0
    const donationAmount = 500;
    const transaction = await crowdfunding
      .connect(addrs)
      .donateToCampaign(campaignId, { value: donationAmount });
    await transaction.wait();

    // Get all donators for the campaign

    const [donators, donations] = await crowdfunding.getDonators(campaignId);
    expect(donators.length).to.equal(1);
    expect(donators[campaignId]).to.equal(addrs.address);
    expect(donations.length).to.equal(1);
    expect(donations[campaignId]).to.equal(donationAmount);
    const campaign = await crowdfunding.campaigns(campaignId);

    console.log("🚀 ~ donate tocampaign:", donators);
    console.log("🚀 ~ donations:", donations);
  });

  it("Should get totalcampaign", async function () {
    const campaign = await crowdfunding.getCampaigns();
  });
});
