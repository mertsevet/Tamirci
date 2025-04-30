/**
 * Şifre göster/gizle işlevi
 * Bu kod şifre alanlarına göster/gizle işlevselliği ekler
 */
document.addEventListener('DOMContentLoaded', function() {
    // Şifre göster/gizle butonlarını bul ve işlevsellik ekle
    function setupPasswordToggles() {
        // Tüm şifre göster/gizle butonlarını bul
        const passwordToggleButtons = document.querySelectorAll('.password-toggle-btn');
        
        if (passwordToggleButtons.length > 0) {
            console.log(`${passwordToggleButtons.length} adet şifre göster/gizle butonu bulundu`);
            
            // Her buton için olay dinleyicisi ekle
            passwordToggleButtons.forEach(function(button) {
                // Butona tıklandığında
                button.addEventListener('click', function(e) {
                    // Olayın sayfa tarafından ele alınmasını engelle
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Butonun bulunduğu input container'ı bul
                    const inputContainer = button.closest('.input-with-icon');
                    if (!inputContainer) {
                        console.error('Input container bulunamadı');
                        return;
                    }
                    
                    // Input container içindeki şifre alanını bul
                    const passwordInput = inputContainer.querySelector('input[type="password"], input[type="text"]');
                    if (!passwordInput) {
                        console.error('Şifre alanı bulunamadı');
                        return;
                    }
                    
                    // Şifre göster/gizle simgesini bul
                    const toggleIcon = button.querySelector('.password-toggle');
                    if (!toggleIcon) {
                        console.error('Toggle icon bulunamadı');
                        return;
                    }
                    
                    console.log('Şifre görünürlüğü değiştiriliyor...');
                    
                    // Şifre alanının tipini değiştir
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        toggleIcon.classList.remove('fa-eye');
                        toggleIcon.classList.add('fa-eye-slash');
                    } else {
                        passwordInput.type = 'password';
                        toggleIcon.classList.remove('fa-eye-slash');
                        toggleIcon.classList.add('fa-eye');
                    }
                    
                    console.log('Şifre görünürlüğü değiştirildi:', passwordInput.type);
                });
            });
        } else {
            console.warn('Şifre göster/gizle butonu bulunamadı');
        }
    }
    
    // Sayfa yüklendiğinde çalıştır
    setupPasswordToggles();
    
    // Sayfa tam yüklendikten sonra bir kez daha çalıştır
    setTimeout(setupPasswordToggles, 500);
}); 