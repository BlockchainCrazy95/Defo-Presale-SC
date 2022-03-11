
const hre = require("hardhat");

async function main() {

  const MockDAI = await hre.ethers.getContractFactory( "MockDAI");
  const mockdai = await MockDAI.deploy();

  await mockdai.deployed();

  console.log( "MockDAI deployed to:", mockdai.address);

  /////////////////////////////////////////////////////////////////////////////////////////////

  const SapphireNode = await hre.ethers.getContractFactory( "SapphireNode");
  const sapphirenode = await SapphireNode.deploy(mockdai.address);

  await sapphirenode.deployed();

  console.log( "SapphireNode deployed to:", sapphirenode.address);

//////////////////////////////////////////////////////////////////////////////////////////////

  const RubyNode = await hre.ethers.getContractFactory( "RubyNode");
  const rubynode = await RubyNode.deploy(mockdai.address);

  await rubynode.deployed();

  console.log( "RubyNode deployed to:", rubynode.address);

  ////////////////////////////////////////////////////////////////////////////////////////////

  const DiamondNode = await hre.ethers.getContractFactory( "DiamondNode");
  const diamondnode = await DiamondNode.deploy(mockdai.address);

  await diamondnode.deployed();

  console.log( "DiamondNode deployed to:", diamondnode.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/*
=== npx hardhat run --network ava_test scripts/deploy.js
MockDAI deployed to: 0x1b0324825E5636b8ACFE959ed7BFe89A84Be9757
SapphireNode deployed to: 0xD2a979DB747955120CdC272Ec1B750Fad7E2fb58
RubyNode deployed to: 0x6821c3Cf024b839fcbBb87fA57B8F3f1A55E78A6
DiamondNode deployed to: 0xFf1C54126656227bc06174ED39aF7151AF3647B2
 */