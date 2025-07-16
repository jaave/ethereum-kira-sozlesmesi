// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract KiraSozlesmesi {
    address public resmiOtorite;
    address public evSahibi;
    address public kiraci;
    uint256 public evKimlikNo;
    uint256 public kiraBedeli;
    uint256 public gecerlilikTarihi;

    bool public kiraBelirlendi = false;
    bool public kiraciBelirlendi = false;
    bool public odemeYapildi = false;

    constructor(address _evSahibi, uint256 _evKimlikNo) {
        require(_evSahibi != msg.sender, "Ev sahibi resmi otorite olamaz");
        resmiOtorite = msg.sender;
        evSahibi = _evSahibi;
        evKimlikNo = _evKimlikNo;
    }

    modifier sadeceEvSahibi() {
        require(msg.sender == evSahibi, "Sadece ev sahibi bu islemi yapabilir");
        _;
    }

    modifier sadeceResmiOtorite() {
        require(msg.sender == resmiOtorite, "Sadece resmi otorite bu islemi yapabilir");
        _;
    }

    modifier sozlesmeGecerliMi() {
        require(block.timestamp <= gecerlilikTarihi, "Sozlesme artik gecerli degil");
        _;
    }

    function setKiraBedeli(uint256 _kiraBedeli) external sadeceEvSahibi {
        require(!kiraBelirlendi, "Kira bedeli daha once belirlenmis");
        kiraBedeli = _kiraBedeli;
        kiraBelirlendi = true;
        kontrolGecerlilikTarihi();
    }

    function setKiraci(address _kiraci) external sadeceEvSahibi {
        require(!kiraciBelirlendi, "Kiraci daha once belirlenmis");
        kiraci = _kiraci;
        kiraciBelirlendi = true;
        kontrolGecerlilikTarihi();
    }

    function kontrolGecerlilikTarihi() internal {
        if (kiraBelirlendi && kiraciBelirlendi && gecerlilikTarihi == 0) {
            gecerlilikTarihi = block.timestamp + 1 days;
        }
    }

    function odeKira() external payable sozlesmeGecerliMi {
        require(msg.sender == kiraci, "Sadece kiraci odeme yapabilir");
        require(kiraBelirlendi && kiraciBelirlendi, "Kira veya kiraci belirlenmemis");
        require(!odemeYapildi, "Kira zaten odenmis");

        uint256 toplamKira = kiraBedeli * 12;
        require(msg.value >= toplamKira, "Yetersiz odeme");

        gecerlilikTarihi = block.timestamp + 365 days;
        odemeYapildi = true;
    }

    function parayiEvSahibineGonder() external sadeceResmiOtorite {
        require(odemeYapildi, "Once kira odenmeli");
        payable(evSahibi).transfer(address(this).balance);
    }
}
