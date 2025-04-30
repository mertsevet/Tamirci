document.addEventListener('DOMContentLoaded', function() {
    console.log('Login script loaded');

    // Şifre göster/gizle işlevselliği
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // İkon değiştirme
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Giriş işlevi
    function handleLogin(e) {
        if (e) e.preventDefault();
        console.log('Login handler called');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Lütfen e-posta ve şifrenizi girin.');
            return;
        }
        
        // E-posta formatı kontrol
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Lütfen geçerli bir e-posta adresi girin.');
            return;
        }
        
        // Başarılı giriş simülasyonu
        console.log('Login successful, redirecting...');
        alert('Giriş başarılı! Anasayfaya yönlendiriliyorsunuz.');
        
        // Doğrudan yönlendirme
        window.location.href = 'index.html';
    }
    
    // Form submit olayı
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding submit event');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Giriş butonuna doğrudan işlev ekleme
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        console.log('Login button found, adding click event');
        loginButton.addEventListener('click', handleLogin);
    } else {
        console.error('Login button not found');
    }
    
    // Üye Ol bağlantısı
    const signupLink = document.getElementById('signup-link');
    if (signupLink) {
        // Üye ol sayfasına yönlendirme artık doğrudan HTML href ile yapılıyor
        // Buradaki event listener'ı kaldırıyoruz
    }
    
    // Şifremi Unuttum bağlantısı
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        // Şifremi unuttum sayfasına yönlendirme artık doğrudan HTML href ile yapılıyor
        // Buradaki event listener'ı kaldırıyoruz
    }
    
    // Sosyal medya giriş butonları
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} ile giriş işlevi henüz entegre edilmedi.`);
        });
    });
}); 