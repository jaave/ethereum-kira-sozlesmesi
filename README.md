<<<<<<< HEAD
# 🏢 Ethereum Kira Sözleşmesi Sistemi

Bu proje, Ethereum blockchain üzerinde çalışan akıllı sözleşme tabanlı bir kira yönetim sistemidir. Sepolia test ağı üzerinde geliştirilmiştir.

## 📋 Özellikler

- **Akıllı Sözleşme**: Solidity ile yazılmış güvenli kira sözleşmesi
- **Web Arayüzü**: React tabanlı modern kullanıcı arayüzü
- **Çoklu Rol Sistemi**: Ev sahibi, kiracı ve resmi otorite panelleri
- **Para Transferi**: Güvenli kira ödemesi sistemi
- **Metamask Entegrasyonu**: Web3 cüzdan bağlantısı

## 🚀 Kurulum

### Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Metamask cüzdanı
- Sepolia test ETH

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/[kullanici-adi]/ethereum-kira-sozlesmesi.git
cd ethereum-kira-sozlesmesi
```

2. **Bağımlılıkları yükleyin**
```bash
# Ana proje bağımlılıkları
npm install

# Frontend bağımlılıkları
cd kira-frontend
npm install
cd ..
```

3. **Çevre değişkenlerini ayarlayın**
```bash
# .env dosyası oluşturun
cp .nvenv.example .e
```

`.env` dosyasına şunları ekleyin:
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_sepolia_rpc_url_here
```

4. **Akıllı sözleşmeyi derleyin**
```bash
npm run compile
```

5. **Testleri çalıştırın**
```bash
npm test
```

## 🏃‍♂️ Kullanım

### Akıllı Sözleşme İşlemleri

```bash
# Sepolia ağına deploy et
npm run deploy

# Yerel ağda test et
npm run deploy:local

# Hardhat node başlat
npm run node
```

### Frontend Uygulaması

```bash
cd kira-frontend
npm start
```

Uygulama http://localhost:3000 adresinde açılacaktır.

## 📁 Proje Yapısı

```
ethereum-kira-sozlesmesi/
├── contracts/           # Solidity akıllı sözleşmeleri
│   └── KiraSozlesmesi.sol
├── kira-frontend/       # React frontend uygulaması
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   └── abis/        # ABI dosyaları
│   └── public/
├── scripts/             # Deploy scriptleri
│   └── deploy.js
├── test/                # Test dosyaları
│   └── KiraSozlesmesi.test.js
├── hardhat.config.js    # Hardhat konfigürasyonu
└── package.json
```

## 🎯 Kullanım Senaryoları

### Resmi Otorite Paneli
- Yeni kira sözleşmesi oluşturma
- Sözleşme durumunu takip etme

### Ev Sahibi Paneli
- Kiracı bilgilerini görüntüleme
- Kira ödemelerini takip etme
- Sözleşme durumunu kontrol etme

### Kiracı Paneli
- Kira ödemesi yapma
- Sözleşme detaylarını görüntüleme

### Para Transferi Paneli
- Güvenli kira ödemesi sistemi
- İşlem geçmişi

## 🔧 Teknolojiler

- **Blockchain**: Ethereum, Solidity
- **Development**: Hardhat, Ethers.js
- **Frontend**: React, Bootstrap
- **Testing**: Chai, Mocha
- **Wallet**: Metamask

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje Sahibi - [@kullanici-adi](https://github.com/kullanici-adi)

Proje Linki: [https://github.com/kullanici-adi/ethereum-kira-sozlesmesi](https://github.com/kullanici-adi/ethereum-kira-sozlesmesi) 
=======
# ethereum-kira-sozlesmesi
>>>>>>> cd8279c86c3630d994e340622566330eebb8efbf
