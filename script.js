document.getElementById('kayitFormu').addEventListener('submit', function(event) {
    let hatalar = {};

    // E-posta kontrolü
    if (!document.getElementById('eposta').value) {
        hatalar.eposta = "E-posta alanı boş bırakılamaz.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('eposta').value)) {
        hatalar.eposta = "Geçersiz e-posta adresi.";
    }

    // Şifre kontrolü
    if (!document.getElementById('sifre').value) {
        hatalar.sifre = "Şifre alanı boş bırakılamaz.";
    } else if (document.getElementById('sifre').value.length < 8) {
        hatalar.sifre = "Şifre en az 8 karakter olmalıdır.";
    }

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