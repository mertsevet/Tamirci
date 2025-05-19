# Tamirci Web Uygulaması

Bu proje, tamirci hizmetlerini arayanlar ve tamircilerin buluştuğu bir web platformudur. Kullanıcılar tamir ilanları oluşturabilir, tamirciler de bu ilanlara teklif verebilir.

## Gereksinimler

- [Node.js](https://nodejs.org/) (en az v14.x veya üzeri)
- npm (Node.js ile birlikte gelir)

## Kurulum

Projeyi yeni bir bilgisayara taşıdıktan sonra şu adımları izleyin:

1. Terminal veya komut istemcisini açın ve proje klasörüne gidin:
   ```
   cd yol/Tamirci
   ```

2. Gerekli paketleri kurun:
   ```
   npm install
   ```

## Uygulamayı Çalıştırma

### Tek Komutla Başlatma (Önerilen Yöntem)

Hem API sunucusunu hem de web sunucusunu tek bir komutla başlatabilirsiniz:
```
npm start
```

Bu komut, hem JSON-Server API'sini (port 3001) hem de HTTP sunucusunu (port 8081) aynı anda başlatacaktır.

### Ayrı Ayrı Başlatma

Alternatif olarak, uygulamayı iki ayrı terminal/komut istemi penceresi açarak başlatabilirsiniz:

#### 1. API Sunucusu

İlk terminalde JSON-Server API sunucusunu başlatın:
```
npm run api
```
veya
```
npx json-server --watch db.json --port 3001
```

Başarılı olursa şu şekilde bir çıktı göreceksiniz:
```
JSON Server started on PORT :3001
Press CTRL-C to stop
Watching db.json...
```

#### 2. Web Sunucusu

İkinci terminalde web sunucusunu başlatın:
```
npm run web
```
veya
```
npx http-server -p 8081
```

Başarılı olursa şu şekilde bir çıktı göreceksiniz:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8081
```

### 3. Uygulamayı Tarayıcıda Açma

Web tarayıcınızı açın ve şu adresi ziyaret edin:
```
http://localhost:8081
```

### Not: Port Sorunları

Eğer yukarıdaki portlar başka uygulamalar tarafından kullanılıyorsa farklı port numaraları deneyebilirsiniz:
```
npx json-server --watch db.json --port 3002
npx http-server -p 8082
```

## Test Kullanıcısı

Sisteme giriş yapmak için önceden tanımlanmış bir test kullanıcısı mevcuttur:

- E-posta: test@example.com
- Şifre: test123

## Özellikler

- Kullanıcı kaydı ve girişi
- Tamir ilanları görüntüleme
- Tamir ilanı oluşturma
- Tamirci profili oluşturma
- Tamircilerin ilanlar için teklif vermesi
- Kullanıcı profili yönetimi

## Sorun Giderme

Eğer uygulama beklendiği gibi çalışmazsa:

1. Node.js'in doğru versiyonunun yüklü olduğundan emin olun
2. `npm install` komutunun başarıyla tamamlandığını kontrol edin
3. Port çakışması olup olmadığını kontrol edin
4. Tarayıcı konsolunda hata mesajlarını kontrol edin
