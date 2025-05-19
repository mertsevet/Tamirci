document.addEventListener('DOMContentLoaded', function() {
    console.log('Login script loaded');

    // Test kullanıcısı ile form doldurma
    const fillTestButton = document.getElementById('fill-test-button');
    if (fillTestButton) {
        fillTestButton.addEventListener('click', function() {
            document.getElementById('email').value = 'test@example.com';
            document.getElementById('password').value = 'test123';
        });
    }

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
    async function handleLogin(e) {
        if (e) e.preventDefault();
        console.log('Login handler called');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showAlert('Lütfen e-posta ve şifrenizi girin.', 'error');
            return;
        }
        
        // E-posta formatı kontrol
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }
        
        try {
            // API'den giriş işlemi
            console.log("window.loginUser'a erişim denetleniyor:", typeof window.loginUser);
            const result = await window.loginUser(email, password);
            console.log('Giriş sonucu:', result);
            
            if (result.success) {
                // Giriş başarılı gösterimi
                showAlert('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Kullanıcı rolüne göre yönlendirme
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        }
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
        loginButton.addEventListener('click', function(e) {
            if (!loginForm) {
                handleLogin(e);
            }
        });
    } else {
        console.error('Login button not found');
    }
    
    // Alert mesajı gösterme
    function showAlert(message, type = 'info') {
        // Önceki alertleri temizle
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Yeni alert oluştur
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Formu bul ve ondan önce ekle
        const form = document.querySelector('#loginForm') || document.querySelector('form');
        if (form) {
            form.parentNode.insertBefore(alertDiv, form);
            
            // 4 saniye sonra alerti kaldır
            setTimeout(() => {
                alertDiv.remove();
            }, 4000);
        }
    }
    
    // Oturum kontrolü
    function checkSession() {
        console.log('checkSession fonksiyonu çağrıldı, window.checkUserSession:', typeof window.checkUserSession);
        try {
            const session = window.checkUserSession();
            console.log('Oturum kontrolü sonucu:', session);
            if (session.loggedIn) {
                console.log('User already logged in, redirecting...');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Oturum kontrolü hatası:', error);
        }
    }
    
    // Sayfa yüklendiğinde oturum kontrolü yap
    checkSession();
    
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
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showAlert(`${provider} ile giriş işlevi henüz entegre edilmedi.`, 'info');
        });
    });
    
    // CSS ekleme (alertler için)
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 14px;
            position: relative;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .alert-info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .test-user-info {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .fill-test-button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .fill-test-button:hover {
            background-color: #0069d9;
        }
    `;
    document.head.appendChild(style);
}); 