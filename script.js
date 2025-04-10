// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    // Arama çubuğu işlevselliği
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');
    
    searchButton.addEventListener('click', function() {
        const searchValue = searchInput.value.trim();
        if (searchValue) {
            // Arama işlemi burada yapılabilir
            console.log('Arama yapıldı:', searchValue);
            // Arama sonucunu göstermek için 
            // window.location.href = 'arama-sonuclari.html?query=' + encodeURIComponent(searchValue);
            alert('Aranan tamir hizmeti: ' + searchValue + '\nBu işlev henüz geliştirme aşamasında.');
        } else {
            alert('Lütfen aramak istediğiniz hizmeti girin.');
        }
    });
    
    // Enter tuşu ile arama yapma
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Servis ikonlarına tıklama işlevselliği
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const service = this.querySelector('span').textContent;
            console.log(`${service} seçildi`);
            alert(`${service} kategorisindeki tamirciler listeleniyor...`);
            // Gerçek uygulamada ilgili servis sayfasına yönlendirme yapılabilir
            // window.location.href = 'tamirciler.html?kategori=' + encodeURIComponent(service);
        });
    });
    
    // Sayfa kaydırma animasyonu
    function smoothScroll(target, duration) {
        const targetElement = document.querySelector(target);
        const targetPosition = targetElement.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, targetPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Üye ol butonuna tıklama
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Üye olma tipini seçme modalını aç
            createUserTypeModal();
        });
    }
    
    // Üye olma tipi seçme modalını oluşturma
    function createUserTypeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content user-type-modal">
                <span class="close-button">&times;</span>
                <h2>Üye Olmak İstediğiniz Hesap Tipini Seçin</h2>
                <div class="user-type-options">
                    <div class="user-type-option" id="customer-option">
                        <div class="user-type-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>Müşteri Olarak Üye Ol</h3>
                        <p>Tamir hizmeti almak için müşteri hesabı oluşturun.</p>
                    </div>
                    <div class="user-type-option" id="technician-option">
                        <div class="user-type-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <h3>Tamirci Olarak Üye Ol</h3>
                        <p>Tamir hizmeti vermek için tamirci hesabı oluşturun.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal kapatma
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Müşteri seçeneğine tıklama
        const customerOption = document.getElementById('customer-option');
        customerOption.addEventListener('click', function() {
            document.body.removeChild(modal);
            createSignupModal('customer');
        });
        
        // Tamirci seçeneğine tıklama
        const technicianOption = document.getElementById('technician-option');
        technicianOption.addEventListener('click', function() {
            document.body.removeChild(modal);
            createSignupModal('technician');
        });
    }
    
    // Müşteri/Tamirci kayıt formunu oluştur
    function createSignupModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        let title = type === 'customer' ? 'Müşteri Olarak Üye Ol' : 'Tamirci Olarak Üye Ol';
        let specificFields = '';
        
        if (type === 'technician') {
            specificFields = `
                <div class="form-group">
                    <label for="expertise">Uzmanlık Alanı</label>
                    <select id="expertise" required multiple>
                        <option value="telefon">Telefon</option>
                        <option value="bilgisayar">Bilgisayar</option>
                        <option value="televizyon">Televizyon</option>
                        <option value="elektrikli">Elektrikli Ev Aletleri</option>
                        <option value="ev">Ev Onarım</option>
                        <option value="arac">Araç</option>
                    </select>
                    <small>Birden fazla seçmek için CTRL tuşuna basılı tutarak seçim yapın.</small>
                </div>
                <div class="form-group">
                    <label for="experience">Deneyim (Yıl)</label>
                    <input type="number" id="experience" min="0" max="50" required>
                </div>
                <div class="form-group">
                    <label for="hourly-rate">Saatlik Ücret (₺)</label>
                    <input type="number" id="hourly-rate" min="0" required>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="name">Ad Soyad</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-posta</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Telefon</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <input type="password" id="password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Şifre Tekrar</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                    <div class="form-group">
                        <label for="location">Konum</label>
                        <input type="text" id="location" placeholder="Örn: İstanbul, Kadıköy" required>
                    </div>
                    ${specificFields}
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" required>
                            Kullanım koşullarını ve gizlilik politikasını kabul ediyorum
                        </label>
                    </div>
                    <button type="submit" class="submit-button">Üye Ol</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal kapatma
        const closeButton = document.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Form gönderimi
        const form = document.getElementById('signup-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Şifre kontrolü
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }
            
            let message = type === 'customer' 
                ? 'Müşteri kaydınız başarıyla oluşturuldu! Artık tamir hizmeti alabilirsiniz.' 
                : 'Tamirci kaydınız başarıyla oluşturuldu! Profiliniz onaylandıktan sonra teklifler verebilirsiniz.';
            
            alert(message);
            document.body.removeChild(modal);
        });
    }
    
    // Örnek ilan oluşturma formu modalını açma
    function createJobModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Tamir İlanı Oluştur</h2>
                <form id="job-form">
                    <div class="form-group">
                        <label for="title">İlan Başlığı</label>
                        <input type="text" id="title" placeholder="Örn: Telefon Ekranı Kırıldı" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Kategori</label>
                        <select id="category" required>
                            <option value="">Kategori Seçin</option>
                            <option value="telefon">Telefon</option>
                            <option value="bilgisayar">Bilgisayar</option>
                            <option value="televizyon">Televizyon</option>
                            <option value="elektrikli">Elektrikli Ev Aletleri</option>
                            <option value="ev">Ev Onarım</option>
                            <option value="arac">Araç</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Sorun Açıklaması</label>
                        <textarea id="description" rows="4" placeholder="Sorunun detaylarını yazın" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photo">Fotoğraf Ekle</label>
                        <input type="file" id="photo" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="location">Konum</label>
                        <input type="text" id="location" placeholder="Örn: İstanbul, Kadıköy" required>
                    </div>
                    <button type="submit" class="submit-button">İlanı Yayınla</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal kapatma
        const closeButton = document.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Form gönderimi
        const form = document.getElementById('job-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                location: document.getElementById('location').value
            };
            
            console.log('İlan verileri:', formData);
            alert('İlanınız başarıyla yayınlandı! Tamirciler tekliflerini göndermeye başlayacak.');
            
            document.body.removeChild(modal);
        });
    }
    
    // İlanlar butonuna tıklama
    const ilanlarButton = document.querySelector('.red-button');
    if (ilanlarButton) {
        ilanlarButton.addEventListener('click', function(e) {
            e.preventDefault();
            // İlan oluşturma modalını aç
            createJobModal();
        });
    }
    
    // Sayfa yüklendiğinde animasyon efekti
    function fadeInElements() {
        const heroContent = document.querySelector('.hero-content');
        setTimeout(() => {
            heroContent.style.opacity = '1';
        }, 300);
    }
    
    fadeInElements();
}); 