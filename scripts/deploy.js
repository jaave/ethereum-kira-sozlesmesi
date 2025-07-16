const hre = require("hardhat");

async function main() {
  const evSahibi = "0xEvSahibiAdresi"; // buraya farklı bir cüzdan adresi yaz
  const evKimlikNo = 123456789;

  const KiraSozlesmesi = await hre.ethers.getContractFactory("KiraSozlesmesi");
  const kira = await KiraSozlesmesi.deploy(evSahibi, evKimlikNo);

  await kira.deployed();

  console.log(`KiraSozlesmesi deployed to: ${kira.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
