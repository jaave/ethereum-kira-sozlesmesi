const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers; 

function toWei(ethAmount) {
  return BigInt(ethAmount * 10 ** 18);
}

describe("KiraSozlesmesi", function () {
  let KiraSozlesmesiFactory, kira, resmiOtorite, evSahibi, kiraci;

  beforeEach(async function () {
    [resmiOtorite, evSahibi, kiraci, baskaHesap] = await ethers.getSigners();

    KiraSozlesmesiFactory = await ethers.getContractFactory("KiraSozlesmesi");
    kira = await KiraSozlesmesiFactory.connect(resmiOtorite).deploy(evSahibi.address, 123456);
  });

  it("1 - Resmi otorite geçerli bir sözleşme oluşturup başarılı bir şekilde ağa yükleyebiliyor mu?", async function () {
    expect(await kira.resmiOtorite()).to.equal(resmiOtorite.address);
    expect(await kira.evSahibi()).to.equal(evSahibi.address);
    expect(await kira.evKimlikNo()).to.equal(123456);
  });

  it("2 - Ev sahibi adresi olarak resmi otoritenin adresi verildiğinde sözleşme bunu reddediyor mu?", async function () {
    await expect(
      KiraSozlesmesiFactory.connect(resmiOtorite).deploy(resmiOtorite.address, 999999)
    ).to.be.revertedWith("Ev sahibi resmi otorite olamaz");
  });

  it("3 - Ev sahibi sözleşmedeki kira bedeli alanını başarıyla değiştirebiliyor mu?", async function () {
    const yeniKira = ethers.parseEther("1.0");
    await kira.connect(evSahibi).setKiraBedeli(yeniKira);
    expect(await kira.kiraBedeli()).to.equal(yeniKira);
  });
  it("4 - Ev sahibi sözleşmedeki kiracı alanını başarıyla değiştirebiliyor mu?", async function () {
    await kira.connect(evSahibi).setKiraci(kiraci.address);
    expect(await kira.kiraci()).to.equal(kiraci.address);
  });
  it("5 - Sadece kira bedeli belirlendikten sonra ev sahibi kiracı alanını başarıyla değiştirebiliyor mu?", async function () {
    const yeniKira = ethers.parseEther("1.0");
    await kira.connect(evSahibi).setKiraBedeli(yeniKira);
    await kira.connect(evSahibi).setKiraci(kiraci.address);

    expect(await kira.kiraci()).to.equal(kiraci.address);
  });
  it("6 - Sadece kiracı belirlendikten sonra ev sahibi kira bedelini değiştirebiliyor mu?", async function () {
  await kira.connect(evSahibi).setKiraci(kiraci.address);
  const yeniKira = toWei(1.0);
  await kira.connect(evSahibi).setKiraBedeli(yeniKira);
  expect(await kira.kiraBedeli()).to.equal(yeniKira);
});
it("7 - Sadece kiracı belirlendikten sonra ev sahibi kiracı alanını değiştiremiyor mu?", async function () {
  await kira.connect(evSahibi).setKiraci(kiraci.address);
  await expect(
    kira.connect(evSahibi).setKiraci("0x0000000000000000000000000000000000000001")
  ).to.be.revertedWith("Kiraci daha once belirlenmis");
});
it("8 - Sadece kira bedeli belirlendikten sonra ev sahibi kira bedelini tekrar değiştiremiyor mu?", async function () {
  const yeniKira = toWei(1.0);
  await kira.connect(evSahibi).setKiraBedeli(yeniKira);
  await expect(
    kira.connect(evSahibi).setKiraBedeli(toWei(2.0))
  ).to.be.revertedWith("Kira bedeli daha once belirlenmis");
});
it("9 - Ev sahibi dışındaki adresler kira bedelini değiştiremesin", async function () {
  await expect(
    kira.connect(kiraci).setKiraBedeli(toWei(1.0))
  ).to.be.revertedWith("Sadece ev sahibi bu islemi yapabilir");
});
it("10 - Ev sahibi dışındaki adresler kiracıyı değiştiremesin", async function () {
  await expect(
    kira.connect(kiraci).setKiraci(kiraci.address)
  ).to.be.revertedWith("Sadece ev sahibi bu islemi yapabilir");
});
it("11 - Kiracı ve kira bedeli belirlendikten sonra kira bedeli değiştirilemesin", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await expect(
    kira.connect(evSahibi).setKiraBedeli(toWei(2.0))
  ).to.be.revertedWith("Kira bedeli daha once belirlenmis");
});
it("12 - Kiracı ve kira bedeli belirlendikten sonra kiracı değiştirilemesin", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await expect(
    kira.connect(evSahibi).setKiraci("0x0000000000000000000000000000000000000001")
  ).to.be.revertedWith("Kiraci daha once belirlenmis");
});
it("13 - Kiracı ve kira belirlendiğinde geçerlilik süresi 24 saat olmalı", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const expected = now + 24 * 60 * 60;
  const actual = await kira.gecerlilikTarihi();

  // ±5 saniye tolerans
  expect(Number(actual)).to.be.closeTo(expected, 5);
});
it("14 - Kiracı geçerli sürede başarılı ödeme yapabiliyor mu?", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await kira.connect(kiraci).odeKira({ value: toWei(12.0) });

  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const expected = now + 365 * 24 * 60 * 60;
  const actual = await kira.gecerlilikTarihi();

  expect(Number(actual)).to.be.closeTo(expected, 5);
});
it("15 - Başarılı ödeme sonrası geçerlilik tarihi 1 yıl ileriye alınmalı", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  const oncekiTarih = await kira.gecerlilikTarihi();

  await kira.connect(kiraci).odeKira({ value: toWei(12.0) });

  const yeniTarih = await kira.gecerlilikTarihi();
  expect(Number(yeniTarih)).to.be.greaterThan(Number(oncekiTarih) + 30000000); // ~1 yıl
});
it("16 - Ödeme yetersizse işlem başarısız olmalı", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await expect(
    kira.connect(kiraci).odeKira({ value: toWei(5.0) })
  ).to.be.revertedWith("Yetersiz odeme");
});
it("17 - Geçerlilik süresi geçtikten sonra ödeme yapılamamalı", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  // Geçerlilik süresini ileriye atmak için zaman atlat:
  await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 gün
  await ethers.provider.send("evm_mine");

  await expect(
    kira.connect(kiraci).odeKira({ value: toWei(12.0) })
  ).to.be.revertedWith("Sozlesme artik gecerli degil");
});
it("18 - Kiracı olmayan biri ödeme yapmaya çalışırsa işlem reddedilmeli", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await expect(
    kira.connect(evSahibi).odeKira({ value: toWei(12.0) })
  ).to.be.revertedWith("Sadece kiraci odeme yapabilir");
});
it("19 - Resmi otorite kira parasını ev sahibine başarıyla gönderebilmeli", async function () {
  await kira.connect(evSahibi).setKiraBedeli(toWei(1.0));
  await kira.connect(evSahibi).setKiraci(kiraci.address);

  await kira.connect(kiraci).odeKira({ value: toWei(12.0) });

  const oldBalance = await ethers.provider.getBalance(evSahibi.address);

  const tx = await kira.connect(resmiOtorite).parayiEvSahibineGonder();
  await tx.wait();

  const newBalance = await ethers.provider.getBalance(evSahibi.address);
  expect(newBalance).to.be.gt(oldBalance);
});







});
