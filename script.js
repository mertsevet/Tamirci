// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', function() {
    // API URL
    const API_URL = 'http://localhost:3001';

    // Kullanıcı oturumunu kontrol et ve header'ı güncelle
    console.log('Sayfa yüklendi, kullanıcı oturumu kontrol ediliyor...');
    checkUserSession();

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
        // Modal açılmasını engellemek için event listener'ı kaldırıyoruz
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
            // Yönlendirmeyi engellemeyi kaldırıyoruz, href özelliğine göre çalışmasını sağlıyoruz
            // e.preventDefault();
            // createJobModal();
            
            // listings.html sayfasına yönlensin
            window.location.href = 'listings.html';
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

// Kullanıcı oturumunu kontrol eden fonksiyon
function checkUserSession() {
    try {
        console.log('script.js: checkUserSession çağrılıyor');
        // localStorage'dan doğrudan kontrol yapalım
        const token = localStorage.getItem('token');
        const userJSON = localStorage.getItem('user');
        
        if (token && userJSON) {
            try {
                const user = JSON.parse(userJSON);
                console.log('script.js: Kullanıcı oturumu aktif:', user);
                updateHeaderForLoggedInUser(user);
                return { loggedIn: true, user };
            } catch (e) {
                console.error('script.js: JSON parse hatası:', e);
            }
        } else {
            console.log('script.js: Kullanıcı oturumu aktif değil');
        }
        
        return { loggedIn: false };
    } catch (error) {
        console.error('script.js: checkUserSession hatası:', error);
        return { loggedIn: false };
    }
}

// Header'ı giriş yapmış kullanıcıya göre güncelle
function updateHeaderForLoggedInUser(user) {
    console.log('updateHeaderForLoggedInUser çağrıldı, user:', user);
    
    try {
        const nav = document.querySelector('header nav ul');
        if (!nav) {
            console.error('Nav elementi bulunamadı!');
            return;
        }
        
        // Önceki login ve signup butonlarını temizle
        const loginButton = document.querySelector('a[href="login.html"]');
        const signupButton = document.querySelector('a[href="musteri-kayit.html"]');
        
        console.log('Login butonu:', loginButton);
        console.log('Signup butonu:', signupButton);
        
        // Ebeveyn li elementlerini bulup kaldır
        if (loginButton) {
            const loginLi = loginButton.closest('li');
            if (loginLi) {
                console.log('Login li elementi kaldırılıyor');
                loginLi.remove();
            }
        }
        
        if (signupButton) {
            const signupLi = signupButton.closest('li');
            if (signupLi) {
                console.log('Signup li elementi kaldırılıyor');
                signupLi.remove();
            }
        }
        
        // Kullanıcı menüsünü ekle (eğer daha önce eklenmemişse)
        if (!document.querySelector('.user-menu')) {
            const userMenuItem = document.createElement('li');
            userMenuItem.classList.add('user-menu');
            
            // Kullanıcı rolünü belirle
            const role = user.role === 'technician' ? 'Tamirci' : 'Müşteri';
            
            // Profil için baş harfler
            let initials = '';
            if (user.firstName && user.lastName) {
                initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
            } else if (user.name) {
                const nameParts = user.name.split(' ');
                if (nameParts.length > 1) {
                    initials = `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
                } else {
                    initials = nameParts[0].charAt(0);
                }
            } else {
                initials = user.email.charAt(0).toUpperCase();
            }
            
            // Tam isim oluştur
            let fullName = '';
            if (user.firstName && user.lastName) {
                fullName = `${user.firstName} ${user.lastName}`;
            } else if (user.name) {
                fullName = user.name;
            } else {
                fullName = user.email.split('@')[0];
            }
            
            // Kullanıcı menüsü HTML'i
            userMenuItem.innerHTML = `
                <div class="user-menu-trigger">
                    <div class="user-avatar-small">
                        <span>${initials}</span>
                    </div>
                    <span>${user.firstName || fullName.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-menu-dropdown">
                    <div class="user-info">
                        <div class="user-avatar-large">
                            <span>${initials}</span>
                        </div>
                        <div class="user-details">
                            <div class="user-name">${fullName}</div>
                            <div class="user-role">${role}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                    <ul>
                        <li><a href="#" id="panel-link"><i class="fas fa-tachometer-alt"></i> Panel</a></li>
                        <li><a href="#" id="profile-link"><i class="fas fa-user-cog"></i> Profil</a></li>
                        <li><a href="#" id="notifications-link"><i class="fas fa-bell"></i> Bildirimler</a></li>
                        <li class="divider"></li>
                        <li><a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a></li>
                    </ul>
                </div>
            `;
            
            // Menüyü nav içine ekle (ilk sıraya)
            if (nav.children.length > 0) {
                nav.insertBefore(userMenuItem, nav.firstChild);
            } else {
                nav.appendChild(userMenuItem);
            }
            
            console.log('Kullanıcı menüsü eklendi');
            
            // Event listeners ekle
            setupUserMenuEventListeners(userMenuItem, user);
        } else {
            console.log('Kullanıcı menüsü zaten mevcut');
        }
    } catch (error) {
        console.error('updateHeaderForLoggedInUser hatası:', error);
    }
}

// Kullanıcı menüsü için event listener'ları ekle
function setupUserMenuEventListeners(userMenuItem, user) {
    // Menü açma/kapama
    const userMenuTrigger = userMenuItem.querySelector('.user-menu-trigger');
    const userMenuDropdown = userMenuItem.querySelector('.user-menu-dropdown');
    
    userMenuTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        userMenuDropdown.classList.toggle('active');
    });
    
    // Sayfa herhangi bir yerine tıklandığında menüyü kapat
    document.addEventListener('click', function(event) {
        if (!userMenuItem.contains(event.target)) {
            userMenuDropdown.classList.remove('active');
        }
    });
    
    // Panel butonuna tıklandığında
    const panelLink = userMenuItem.querySelector('#panel-link');
    panelLink.addEventListener('click', function(e) {
        e.preventDefault();
        createOrRedirectToPanel(e, user);
    });
    
    // Profil butonuna tıklandığında
    const profileLink = userMenuItem.querySelector('#profile-link');
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        createProfileModal(user);
    });
    
    // Bildirimler butonuna tıklandığında
    const notificationsLink = userMenuItem.querySelector('#notifications-link');
    notificationsLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Şu anda yeni bildiriminiz bulunmamaktadır.');
    });
    
    // Çıkış yapma işlevi
    const logoutButton = userMenuItem.querySelector('#logout-button');
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Local storage'dan kullanıcı bilgilerini temizle
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Sayfayı yenile
        window.location.reload();
    });
}

// Panel sayfasına yönlendirme veya oluşturma
function createOrRedirectToPanel(e, user) {
    e.preventDefault();
    
    // Kullanıcı rol kontrolü ve ilgili panel oluşturma
    if (user.role === 'technician') {
        createTechnicianPanelModal(user);
    } else {
        createCustomerPanelModal(user);
    }
}

// Tamirci paneli modalı
function createTechnicianPanelModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal panel-modal';
    
    // Profil için ilk harfler
    let initials = '';
    if (user.firstName && user.lastName) {
        initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.name) {
        const nameParts = user.name.split(' ');
        initials = nameParts.length > 1 
            ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
            : nameParts[0].charAt(0);
    } else {
        initials = user.email.charAt(0).toUpperCase();
    }
    
    // Tam ismi oluştur
    let fullName = '';
    if (user.firstName && user.lastName) {
        fullName = `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
        fullName = user.name;
    } else {
        fullName = user.email.split('@')[0];
    }
    
    modal.innerHTML = `
        <div class="modal-content wide-modal">
            <span class="close-button">&times;</span>
            <div class="panel-header">
                <h2>Tamirci Kontrol Paneli</h2>
                <p>Hoş geldiniz, ${fullName}</p>
            </div>
            
            <div class="panel-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-tools"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Tamamlanan İşler</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">5.0</div>
                        <div class="stat-label">Değerlendirme</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">₺0</div>
                        <div class="stat-label">Kazanç</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Aktif İlanlar</div>
                    </div>
                </div>
            </div>
            
            <div class="panel-tabs">
                <div class="tab active" data-tab="active-jobs">Aktif İşlerim</div>
                <div class="tab" data-tab="offers">Verdiğim Teklifler</div>
                <div class="tab" data-tab="completed-jobs">Tamamlanan İşler</div>
                <div class="tab" data-tab="settings">Ayarlar</div>
            </div>
            
            <div class="tab-content active" id="active-jobs-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-clipboard"></i></div>
                    <h3>Aktif işiniz bulunmuyor</h3>
                    <p>İlanlar bölümünden ilanlara göz atıp müşterilere teklifler verebilirsiniz.</p>
                    <a href="listings.html" class="panel-button">İlanları Görüntüle</a>
                </div>
            </div>
            
            <div class="tab-content" id="offers-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-comment-dollar"></i></div>
                    <h3>Henüz teklif vermemişsiniz</h3>
                    <p>İlanlar bölümünden ilanlara göz atıp müşterilere teklifler verebilirsiniz.</p>
                    <a href="listings.html" class="panel-button">İlanları Görüntüle</a>
                </div>
            </div>
            
            <div class="tab-content" id="completed-jobs-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Tamamlanmış işiniz bulunmuyor</h3>
                    <p>Tamamladığınız işler burada listelenecek.</p>
                </div>
            </div>
            
            <div class="tab-content" id="settings-content">
                <form class="panel-form" id="technician-settings-form">
                    <h3>Hesap Ayarları</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Profil Resmi</label>
                            <div class="avatar-upload">
                                <div class="avatar-preview">
                                    <div class="user-avatar-large">
                                        <span>${initials}</span>
                                    </div>
                                </div>
                                <button type="button" class="avatar-upload-button" disabled>Resim Yükle</button>
                                <small>Bu özellik henüz aktif değil</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="settingsFirstName">Ad</label>
                            <input type="text" id="settingsFirstName" name="firstName" value="${user.firstName || ''}">
                        </div>
                        <div class="form-group">
                            <label for="settingsLastName">Soyad</label>
                            <input type="text" id="settingsLastName" name="lastName" value="${user.lastName || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="settingsPhone">Telefon</label>
                        <input type="tel" id="settingsPhone" name="phone" value="${user.phone || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="settingsLocation">Konum</label>
                        <input type="text" id="settingsLocation" name="location" value="${user.location || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="settingsExpertise">Uzmanlık Alanları</label>
                        <div class="expertise-tags">
                            ${user.expertise ? user.expertise.map(exp => `<span class="tag">${exp}</span>`).join('') : ''}
                        </div>
                        <small>Uzmanlık alanlarınız profilinizi güncelleyerek değiştirebilirsiniz</small>
                    </div>
                    
                    <button type="button" class="profile-link-button">Profili Düzenle</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal kapatma
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Tab değiştirme işlevi
    const tabs = modal.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Aktif tabı değiştir
            modal.querySelector('.tab.active').classList.remove('active');
            this.classList.add('active');
            
            // İlgili içeriği göster
            modal.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            modal.querySelector(`#${tabId}-content`).classList.add('active');
        });
    });
    
    // Profil düzenleme butonuna tıklanınca
    const profileLinkButton = modal.querySelector('.profile-link-button');
    if (profileLinkButton) {
        profileLinkButton.addEventListener('click', function() {
            // Bu modalı kapat
            document.body.removeChild(modal);
            
            // Profil modalını aç
            createProfileModal(user);
        });
    }
}

// Müşteri paneli modalı
function createCustomerPanelModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal panel-modal';
    
    // Profil için ilk harfler
    let initials = '';
    if (user.firstName && user.lastName) {
        initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.name) {
        const nameParts = user.name.split(' ');
        initials = nameParts.length > 1 
            ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
            : nameParts[0].charAt(0);
    } else {
        initials = user.email.charAt(0).toUpperCase();
    }
    
    // Tam ismi oluştur
    let fullName = '';
    if (user.firstName && user.lastName) {
        fullName = `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
        fullName = user.name;
    } else {
        fullName = user.email.split('@')[0];
    }
    
    modal.innerHTML = `
        <div class="modal-content wide-modal">
            <span class="close-button">&times;</span>
            <div class="panel-header">
                <h2>Müşteri Kontrol Paneli</h2>
                <p>Hoş geldiniz, ${fullName}</p>
            </div>
            
            <div class="panel-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Açık İlanlar</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-comment-dollar"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Alınan Teklifler</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-tools"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Devam Eden İşler</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <div class="stat-value">0</div>
                        <div class="stat-label">Tamamlanan İşler</div>
                    </div>
                </div>
            </div>
            
            <div class="panel-tabs">
                <div class="tab active" data-tab="my-listings">İlanlarım</div>
                <div class="tab" data-tab="received-offers">Teklifler</div>
                <div class="tab" data-tab="progress-jobs">Devam Eden</div>
                <div class="tab" data-tab="completed-jobs">Tamamlanan</div>
            </div>
            
            <div class="tab-content active" id="my-listings-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-clipboard-list"></i></div>
                    <h3>Henüz ilan oluşturmadınız</h3>
                    <p>Tamir ihtiyacınız için hemen bir ilan oluşturun ve teklifler almaya başlayın.</p>
                    <a href="listings.html" class="panel-button">İlanları Görüntüle</a>
                    <button id="create-listing-button" class="panel-button primary-button">Yeni İlan Oluştur</button>
                </div>
            </div>
            
            <div class="tab-content" id="received-offers-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-comment-dollar"></i></div>
                    <h3>Henüz teklif almadınız</h3>
                    <p>İlan oluşturduğunuzda tamircilerden gelen teklifler burada görünecek.</p>
                </div>
            </div>
            
            <div class="tab-content" id="progress-jobs-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-hourglass-half"></i></div>
                    <h3>Devam eden işiniz yok</h3>
                    <p>Tamircilerin çalışmakta olduğu işleriniz burada görünecek.</p>
                </div>
            </div>
            
            <div class="tab-content" id="completed-jobs-content">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Tamamlanan işiniz yok</h3>
                    <p>Tamamlanan tamir işleriniz burada görünecek.</p>
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
    
    // Tab değiştirme işlevi
    const tabs = modal.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Aktif tabı değiştir
            modal.querySelector('.tab.active').classList.remove('active');
            this.classList.add('active');
            
            // İlgili içeriği göster
            modal.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            modal.querySelector(`#${tabId}-content`).classList.add('active');
        });
    });
    
    // Yeni ilan oluşturma butonu
    const createListingButton = modal.querySelector('#create-listing-button');
    if (createListingButton) {
        createListingButton.addEventListener('click', function() {
            // İlan oluşturma sayfasına yönlendir
            alert('İlan oluşturma sayfasına yönlendiriliyorsunuz...');
            window.location.href = 'listings.html';
        });
    }
    
    // Ayarlar ve profil için ek CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .panel-form {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 8px;
        }
        
        .panel-form h3 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .avatar-upload {
            display: flex;
            align-items: center;
        }
        
        .avatar-preview {
            margin-right: 15px;
        }
        
        .avatar-upload-button {
            padding: 8px 15px;
            background-color: #e73c33;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .avatar-upload-button:hover {
            background-color: #c5352e;
        }
        
        .avatar-upload-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        
        .avatar-upload small {
            display: block;
            margin-top: 5px;
            color: #666;
            font-size: 12px;
        }
        
        .expertise-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .tag {
            background-color: #e73c33;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 13px;
        }
        
        .profile-link-button {
            background-color: #e73c33;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 20px;
            cursor: pointer;
            margin-top: 15px;
        }
        
        .profile-link-button:hover {
            background-color: #c5352e;
        }
        
        .primary-button {
            background-color: #e73c33;
            color: white;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(styleElement);
}

// Kullanıcı profil modalı
function createProfileModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal profile-modal';
    
    // Kullanıcı adının baş harfleri
    let initials = '';
    if (user.firstName && user.lastName) {
        initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.name) {
        const nameParts = user.name.split(' ');
        initials = nameParts.length > 1 
            ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
            : nameParts[0].charAt(0);
    } else {
        initials = user.email.charAt(0).toUpperCase();
    }
    
    // Rol bilgisi
    const role = user.role === 'technician' ? 'Tamirci' : 'Müşteri';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div class="profile-header">
                <div class="profile-avatar">
                    <span>${initials}</span>
                </div>
                <h2>Profil Bilgileri</h2>
            </div>
            
            <div class="alert-container"></div>
            
            <form class="profile-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="profileFirstName">Ad</label>
                        <input type="text" id="profileFirstName" value="${user.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="profileLastName">Soyad</label>
                        <input type="text" id="profileLastName" value="${user.lastName || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="profileEmail">E-posta</label>
                    <input type="email" id="profileEmail" value="${user.email}" readonly>
                    <small>E-posta adresi değiştirilemez</small>
                </div>
                
                <div class="form-group">
                    <label for="profilePhone">Telefon</label>
                    <input type="tel" id="profilePhone" value="${user.phone || ''}">
                </div>
                
                <div class="form-group">
                    <label for="profileRole">Hesap Türü</label>
                    <input type="text" id="profileRole" value="${role}" readonly>
                </div>
                
                <div class="form-group">
                    <label for="profilePassword">Şifre</label>
                    <input type="password" id="profilePassword" placeholder="Şifrenizi değiştirmek için yeni şifre girin">
                </div>
                
                <div class="form-group">
                    <label for="profilePasswordConfirm">Şifre Tekrar</label>
                    <input type="password" id="profilePasswordConfirm" placeholder="Yeni şifrenizi tekrar girin">
                </div>
                
                <button type="submit" class="profile-save-button">Profili Güncelle</button>
            </form>
            
            <div class="profile-footer">
                <button class="delete-account-button">Hesabımı Sil</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal kapatma
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Alert gösterme fonksiyonu
    function showAlert(message, type = 'success') {
        const alertContainer = modal.querySelector('.alert-container');
        
        // Önceki alertleri temizle
        alertContainer.innerHTML = '';
        
        // Alert oluştur
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);
        
        // 3 saniye sonra kaldır
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    // Profil güncelleme formu
    const profileForm = modal.querySelector('.profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form verilerini al
        const firstName = document.getElementById('profileFirstName').value.trim();
        const lastName = document.getElementById('profileLastName').value.trim();
        const phone = document.getElementById('profilePhone').value.trim();
        const password = document.getElementById('profilePassword').value;
        const passwordConfirm = document.getElementById('profilePasswordConfirm').value;
        
        // Validasyon
        if (!firstName || !lastName) {
            showAlert('Ad ve soyad alanları boş bırakılamaz.', 'error');
            return;
        }
        
        if (password && password.length < 6) {
            showAlert('Şifre en az 6 karakter uzunluğunda olmalıdır.', 'error');
            return;
        }
        
        // Şifre kontrolü
        if (password && password !== passwordConfirm) {
            showAlert('Şifreler eşleşmiyor. Lütfen kontrol edin.', 'error');
            return;
        }
        
        try {
            // Kayıtlı kullanıcıları al
            const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            
            if (userIndex !== -1) {
                // Kullanıcı bilgilerini güncelle
                const updatedUserData = { ...registeredUsers[userIndex] };
                updatedUserData.firstName = firstName;
                updatedUserData.lastName = lastName;
                updatedUserData.phone = phone;
                
                // Şifre değişimi yapıldıysa güncelle
                if (password) {
                    updatedUserData.password = password;
                }
                
                // Kayıtlı kullanıcılar listesini güncelle
                registeredUsers[userIndex] = updatedUserData;
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
                
                // Kullanıcı oturum bilgisini güncelle (şifre olmadan)
                const userToStore = { ...updatedUserData };
                delete userToStore.password;
                localStorage.setItem('user', JSON.stringify(userToStore));
                
                showAlert('Profil bilgileriniz başarıyla güncellendi.');
                
                // 1.5 saniye sonra sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showAlert('Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.', 'error');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            showAlert('Güncelleme sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        }
    });
    
    // Hesap silme butonu
    const deleteAccountButton = modal.querySelector('.delete-account-button');
    deleteAccountButton.addEventListener('click', function() {
        const confirm = window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.');
        
        if (confirm) {
            try {
                // Kullanıcılar listesinden kaldır
                const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
                const filteredUsers = registeredUsers.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
                
                localStorage.setItem('registered_users', JSON.stringify(filteredUsers));
                
                // Oturum bilgilerini temizle
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                showAlert('Hesabınız başarıyla silindi. Anasayfaya yönlendiriliyorsunuz...', 'success');
                
                // 2 saniye sonra anasayfaya yönlendir
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                console.error('Account deletion error:', error);
                showAlert('Hesap silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
            }
        }
    });
    
    // Alert CSS stilleri
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .alert-container {
            margin-bottom: 20px;
        }
        .alert {
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 4px;
            font-size: 14px;
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
    `;
    document.head.appendChild(styleElement);
} 