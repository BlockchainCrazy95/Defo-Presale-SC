const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');



describe("SapphireNode", function () {


    let owner;
    let acc1;
    let acc2;
    let acc3;
    let accs;
    beforeEach(async function () {

    mockToken = await ethers.getContractFactory("MockDAI");
    SapphireNode = await ethers.getContractFactory("SapphireNode");
    [owner, acc1, acc2, acc3, ...accs] = await ethers.getSigners();
    mockdai = await mockToken.deploy();
    sapphirenode = await SapphireNode.deploy(mockdai.address);

    });
  
  it("Should return the current price of a sapphire node", async function () {
 
    expect(await sapphirenode.getPrice()).to.equal(540);

  });

  it("Should flip the sale state", async function () {

    const flipsalestate = await sapphirenode.connect(owner).setSaleState()
    await flipsalestate.wait()


    expect(await sapphirenode.activeSale()).to.equal(false);

  });

  //included a for loop to test against batch mint gas effeciency
  it("Should mint a node and return the balance of buyer", async function () {

    expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
    expect(await mockdai.connect(acc1).approve(sapphirenode.address, "5000000000000000000000")).to.ok
    expect(await sapphirenode.connect(acc1).mintNode(4)).to.ok;

   expect(await sapphirenode.connect(owner).balanceOf(acc1.address)).to.equal(4);

  });

  // it("Should mint nodes and return the balance of buyer", async function () {

  //   expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
  //   expect(await mockdai.connect(acc1).approve(sapphirenode.address, "5000000000000000000000")).to.ok
  //   expect(await sapphirenode.connect(acc1).mintNodeBatch(4)).to.ok;

  //   expect(await sapphirenode.connect(owner).balanceOf(acc1.address)).to.equal(4); //returns 5 because it is adding onto previous test

  // });

  it("Should set a new max number of sapphire nodes per wallet", async function () {
 
    const setnodesperwallet = await sapphirenode.connect(owner).setMaxPerWallet(20)
    await setnodesperwallet.wait()


    expect(await sapphirenode.maxNodesPerWallet()).to.equal(20);

  });

  it("Should set a new total number of sapphire nodes", async function () {

    const settotalnodes = await sapphirenode.connect(owner).setMaxTotalSapphireNodes(500)
    await settotalnodes.wait()


    expect(await sapphirenode.maxTotalSapphireNodes()).to.equal(500);

  });

  it("Should set new baseURI", async function () {

    const setbaseuri = await sapphirenode.connect(owner).setBaseURI("https")
    await setbaseuri.wait()

  });

  it("Should set return balance of a given address", async function () {


    expect(await sapphirenode.connect(owner).balanceOf(acc1.address)).to.equal(0);
  });

  it("Should revert when non-owner calls setSaleState", async function () {

    await expectRevert(sapphirenode.connect(acc1).setSaleState(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxTotalSapphireNodes", async function () {
  
    await expectRevert(sapphirenode.connect(acc1).setMaxTotalSapphireNodes(900), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxPerWallet", async function () {

    await expectRevert(sapphirenode.connect(acc1).setMaxPerWallet(7), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setBaseURI", async function () {


    await expectRevert(sapphirenode.connect(acc1).setBaseURI("https"), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls withdrawTokens", async function () {


    await expectRevert(sapphirenode.connect(acc1).withdrawTokens(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls balanceOf", async function () {

    await expectRevert(sapphirenode.connect(acc1).balanceOf(acc1.address), "Ownable: caller is not the owner")

  });
});

describe("RubyNode", function () {


    let owner;
    let acc1;
    let acc2;
    let acc3;
    let accs;
    beforeEach(async function () {

    mockToken = await ethers.getContractFactory("MockDAI");
    RubyNode = await ethers.getContractFactory("RubyNode");
    [owner, acc1, acc2, acc3, ...accs] = await ethers.getSigners();
    mockdai = await mockToken.deploy();
    rubynode = await RubyNode.deploy(mockdai.address);

    });


  it("Should return the current price of a ruby node", async function () {

    expect(await rubynode.getPrice()).to.equal(720);

  });

  it("Should flip the sale state", async function () {

    const flipsalestate = await rubynode.connect(owner).setSaleState()
    await flipsalestate.wait()


    expect(await rubynode.activeSale()).to.equal(false);

  });

  //included a for loop to test against batch mint gas effeciency
  it("Should mint a node and return the balance of buyer", async function () {

    expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
    expect(await mockdai.connect(acc1).approve(rubynode.address, "5000000000000000000000")).to.ok
    expect(await rubynode.connect(acc1).mintNode(4)).to.ok;

    expect(await rubynode.connect(owner).balanceOf(acc1.address)).to.equal(4);

  });

  // it("Should mint nodes and return the balance of buyer", async function () {

  //   expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
  //   expect(await mockdai.connect(acc1).approve(rubynode.address, "5000000000000000000000")).to.ok
  //   expect(await rubynode.connect(acc1).mintNodeBatch(4)).to.ok;

  //  expect(await rubynode.connect(owner).balanceOf(acc1.address)).to.equal(5);

  // });

  it("Should set a new max number of ruby nodes per wallet", async function () {
  
    const setnodesperwallet = await rubynode.connect(owner).setMaxPerWallet(20)
    await setnodesperwallet.wait()


    expect(await rubynode.maxNodesPerWallet()).to.equal(20);

  });

  it("Should set a new total number of ruby nodes", async function () {

    const settotalnodes = await rubynode.connect(owner).setMaxTotalRubyNodes(500)
    await settotalnodes.wait()


    expect(await rubynode.maxTotalRubyNodes()).to.equal(500);

  });

  it("Should set new baseURI", async function () {

    const setbaseuri = await rubynode.connect(owner).setBaseURI("https")
    await setbaseuri.wait()

  });

  it("Should set return balance of a given address", async function () {

    expect(await rubynode.connect(owner).balanceOf(acc1.address)).to.equal(0);
  });

  it("Should revert when non-owner calls setSaleState", async function () {

    await expectRevert(rubynode.connect(acc1).setSaleState(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxTotalRubyNodes", async function () {

    await expectRevert(rubynode.connect(acc1).setMaxTotalRubyNodes(900), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxPerWallet", async function () {


    await expectRevert(rubynode.connect(acc1).setMaxPerWallet(7), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setBaseURI", async function () {

    await expectRevert(rubynode.connect(acc1).setBaseURI("https"), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls withdrawTokens", async function () {

    await expectRevert(rubynode.connect(acc1).withdrawTokens(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls balanceOf", async function () {

    await expectRevert(rubynode.connect(acc1).balanceOf(acc1.address), "Ownable: caller is not the owner")

  });
});

describe("DiamondNode", function () {

    let owner;
    let acc1;
    let acc2;
    let acc3;
    let accs;
    beforeEach(async function () {

    mockToken = await ethers.getContractFactory("MockDAI");
    diamondNode = await ethers.getContractFactory("DiamondNode");
    [owner, acc1, acc2, acc3, ...accs] = await ethers.getSigners();
    mockdai = await mockToken.deploy();
    diamondnode = await diamondNode.deploy(mockdai.address);

    });

  it("Should return the current price of a diamond node", async function () {


    expect(await diamondnode.getPrice()).to.equal(1800);

  });

  it("Should flip the sale state", async function () {

    const flipsalestate = await diamondnode.connect(owner).setSaleState()
    await flipsalestate.wait()


    expect(await diamondnode.activeSale()).to.equal(false);

  });

  it("Should mint a node and return the balance of buyer", async function () {

    expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
    expect(await mockdai.connect(acc1).approve(diamondnode.address, "5000000000000000000000")).to.ok
    expect(await diamondnode.connect(acc1).mintNode(4)).to.ok;

    expect(await diamondnode.connect(owner).balanceOf(acc1.address)).to.equal(4);

  });

  // it("Should mint nodes and return the balance of buyer", async function () {

  //   expect(await mockdai.mintTokens(acc1.address, "5000000000000000000000")).to.ok;
  //   expect(await mockdai.connect(acc1).approve(diamondnode.address, "5000000000000000000000")).to.ok
  //   expect(await diamondnode.connect(acc1).mintNodeBatch(4)).to.ok;

  //   expect(await diamondnode.connect(owner).balanceOf(acc1.address)).to.equal(5); //returns 5 because it is adding onto previous test

  // });

  it("Should set a new max number of diamond nodes per wallet", async function () {


    const setnodesperwallet = await diamondnode.connect(owner).setMaxPerWallet(20)
    await setnodesperwallet.wait()


    expect(await diamondnode.maxNodesPerWallet()).to.equal(20);

  });

  it("Should set a new total number of diamond nodes", async function () {


    const settotalnodes = await diamondnode.connect(owner).setMaxTotalDiamondNodes(500)
    await settotalnodes.wait()


    expect(await diamondnode.maxTotalDiamondNodes()).to.equal(500);

  });

  it("Should set new baseURI", async function () {


    const setbaseuri = await diamondnode.connect(owner).setBaseURI("https")
    await setbaseuri.wait()

  });

  it("Should set return balance of a given address", async function () {


    expect(await diamondnode.connect(owner).balanceOf(acc1.address)).to.equal(0);
  });

  it("Should revert when non-owner calls setSaleState", async function () {


    await expectRevert(diamondnode.connect(acc1).setSaleState(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxTotalDiamondNodes", async function () {
 

    await expectRevert(diamondnode.connect(acc1).setMaxTotalDiamondNodes(900), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setMaxPerWallet", async function () {

    await expectRevert(diamondnode.connect(acc1).setMaxPerWallet(7), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls setBaseURI", async function () {


    await expectRevert(diamondnode.connect(acc1).setBaseURI("https"), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls withdrawTokens", async function () {

    await expectRevert(diamondnode.connect(acc1).withdrawTokens(), "Ownable: caller is not the owner")

  });

  it("Should revert when non-owner calls balanceOf", async function () {

    await expectRevert(diamondnode.connect(acc1).balanceOf(acc1.address), "Ownable: caller is not the owner")

  });
});


