// test/CrowdFunding.test.js
const { expect } = require('chai');

describe('CrowdFunding', function () {
  let CrowdFunding;
  let crowdFunding;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    CrowdFunding = await ethers.getContractFactory('CrowdFunding');
    crowdFunding = await CrowdFunding.deploy();
    // await crowdFunding.deployed();
  });

  it('Should create a campaign', async function () {
    await crowdFunding.createCampaign(owner.address, 'Test Campaign', 'Description', 1000, Math.floor(Date.now() / 1000) + 3600);

    const campaign = await crowdFunding.campaigns(0);

    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal('Test Campaign');
    // Add more assertions as needed
  });

//   it('Should donate to a campaign', async function () {
//     await crowdFunding.createCampaign(owner.address, 'Test Campaign', 'Description', 1000, Math.floor(Date.now() / 1000) + 3600);

//     const initialBalance = await owner.getBalance();
//     await crowdFunding.connect(addr1).donateToCampaign(0, { value: 500 });

//     const campaign = await crowdFunding.campaigns(0);

//     expect(campaign.donators[0]).to.equal(addr1.address);
//     expect(campaign.donations[0]).to.equal(500);
//     expect(await owner.getBalance()).to.equal(initialBalance.add(500));
//   });

  // Add more test cases as needed
});
