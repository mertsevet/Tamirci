document.getElementById('tamirciKayitFormu').addEventListener('submit', function(event) {
    let hatalar = {};

    // Ad, soyad, kullanıcı adı, e-posta, şifre, telefon, uzmanlık alanları, tecrübe yılı, çalışma bölgesi, çalışma saatleri kontrolü
    // ... (Buraya tüm alanlar için doğrulama kodları eklenecek)

    // Hata mesajlarını göster
    document.querySelectorAll('.hata-mesaji').forEach(function(element) {
        element.textContent = '';
    });

    for (let alan in hatalar) {
        document.getElementById(alan).nextElementSibling.textContent = hatalar[alan];
    }

    // Hata varsa formu gönderme
    if (Object.keys(hatalar).length > 0) {
        event.preventDefault();
    }
});