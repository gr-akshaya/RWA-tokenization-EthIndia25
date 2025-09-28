const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy ListingManager
  const ListingManager = await ethers.getContractFactory("ListingManager");
  const listingManager = await ListingManager.deploy(deployer.address);
  await listingManager.waitForDeployment();
  console.log("ListingManager:", await listingManager.getAddress());

  // 2️⃣ Deploy TokenFactory
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(await listingManager.getAddress(), deployer.address);
  await factory.waitForDeployment();
  console.log("TokenFactory:", await factory.getAddress());

  // 3️⃣ Grant factory permission to create listings
  await listingManager.grantRole(await listingManager.LISTING_MANAGER_ROLE(), await factory.getAddress());
  console.log("✅ Granted factory LISTING_MANAGER_ROLE");

  // 4️⃣ Deploy a demo ERC3643 token & listing
  // This will automatically assign roles to the creator
  const tx = await factory.createTokenAndListing(
    "RealEstateFund",
    "REF",
    ethers.parseEther("1000000"),
    "0xVerifierAddressHere", // Replace with ProofOfHuman verifier
    "ISIN123456",
    "DE"
  );
  await tx.wait();
  console.log("✅ Token + listing created");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
