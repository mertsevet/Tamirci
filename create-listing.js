document.addEventListener('DOMContentLoaded', function() {
    // Form elementleri
    const form = document.getElementById('createListingForm');
    const fileInput = document.getElementById('fileInput');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    // Yüklenen dosyalar dizisi
    let uploadedFilesList = [];
    
    // Şehir ve ilçe verileri
    const cityDistricts = {
        'istanbul': ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
        'ankara': ['Altındağ', 'Çankaya', 'Etimesgut', 'Keçiören', 'Mamak', 'Sincan', 'Yenimahalle', 'Akyurt', 'Beypazarı', 'Çamlıdere', 'Çubuk', 'Elmadağ', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kahramankazan', 'Kızılcahamam', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Şereflikoçhisar'],
        'izmir': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
        'bursa': ['Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
        'antalya': ['Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradi', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik'],
        'adana': ['Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'],
        'gaziantep': ['Şahinbey', 'Şehitkamil', 'Oğuzeli', 'Nizip', 'İslahiye', 'Nurdağı', 'Karkamış', 'Yavuzeli', 'Araban'],
        'konya': ['Meram', 'Karatay', 'Selçuklu', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Cihanbeyli', 'Çeltik', 'Çumra', 'Derbent', 'Derebucak', 'Doğanhisar', 'Emirgazi', 'Ereğli', 'Güneysinir', 'Hadim', 'Halkapınar', 'Hüyük', 'Ilgın', 'Kadınhanı', 'Karapınar', 'Kulu', 'Sarayönü', 'Seydişehir', 'Taşkent', 'Tuzlukçu', 'Yalıhüyük', 'Yunak'],
        'mersin': ['Akdeniz', 'Mezitli', 'Toroslar', 'Yenişehir', 'Anamur', 'Aydıncık', 'Bozyazı', 'Çamlıyayla', 'Erdemli', 'Gülnar', 'Mut', 'Silifke', 'Tarsus']
    };
    
    // Kullanıcı oturum kontrolü
    checkUserSession();
    
    // Şehir değiştiğinde ilçeleri güncelle
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        
        // İlçe select'ini temizle ve aktifleştir
        districtSelect.innerHTML = '<option value="">İlçe Seçin</option>';
        
        if (selectedCity && cityDistricts[selectedCity]) {
            districtSelect.disabled = false;
            
            cityDistricts[selectedCity].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ğ/g, 'g');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else {
            districtSelect.disabled = true;
        }
    });
    
    // Dosya yükleme işlemleri
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag & Drop işlemleri
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Dosya seçme fonksiyonu
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    // Dosyaları işleme fonksiyonu
    function handleFiles(files) {
        if (uploadedFilesList.length + files.length > 5) {
            alert('Maksimum 5 fotoğraf yükleyebilirsiniz.');
            return;
        }
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                uploadedFilesList.push(file);
                displayUploadedFile(file);
            } else {
                alert(`${file.name} dosyası desteklenmiyor. Sadece resim dosyaları yükleyebilirsiniz.`);
            }
        });
    }
    
    // Yüklenen dosyayı gösterme fonksiyonu
    function displayUploadedFile(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <span><i class="fas fa-image"></i> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button type="button" class="remove-file" onclick="removeFile('${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedFiles.appendChild(fileElement);
    }
    
    // Dosya silme fonksiyonu (global scope için window'a ekle)
    window.removeFile = function(fileName) {
        // Dosyayı diziden kaldır
        uploadedFilesList = uploadedFilesList.filter(file => file.name !== fileName);
        
        // DOM'dan kaldır
        const fileElements = uploadedFiles.querySelectorAll('.uploaded-file');
        fileElements.forEach(element => {
            if (element.querySelector('span').textContent.includes(fileName)) {
                element.remove();
            }
        });
    };
    
    // Form gönderimi
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form verilerini topla
        const formData = new FormData();
        
        // Temel form verilerini ekle
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type !== 'file' && input.name) {
                formData.append(input.name, input.value);
            }
        });
        
        // Dosyaları ekle
        uploadedFilesList.forEach((file, index) => {
            formData.append(`photo_${index}`, file);
        });
        
        // Validasyon kontrolü
        if (!validateForm()) {
            return;
        }
        
        // Form verilerini console'a yazdır (geliştirme amaçlı)
        console.log('Form verileri:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
        // İlan oluşturma simülasyonu
        createListing(formData);
    });
    
    // Form validasyonu
    function validateForm() {
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const city = document.getElementById('city').value;
        const district = document.getElementById('district').value;
        
        if (!title) {
            alert('İlan başlığı gereklidir.');
            document.getElementById('title').focus();
            return false;
        }
        
        if (!category) {
            alert('Kategori seçmelisiniz.');
            document.getElementById('category').focus();
            return false;
        }
        
        if (!description) {
            alert('Sorun açıklaması gereklidir.');
            document.getElementById('description').focus();
            return false;
        }
        
        if (!city) {
            alert('Şehir seçmelisiniz.');
            document.getElementById('city').focus();
            return false;
        }
        
        if (!district) {
            alert('İlçe seçmelisiniz.');
            document.getElementById('district').focus();
            return false;
        }
        
        return true;
    }
    
    // İlan oluşturma fonksiyonu
    function createListing(formData) {
        // Yükleme durumunu göster
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'İlan Oluşturuluyor...';
        submitButton.disabled = true;
        
        // Simüle edilmiş API çağrısı
        setTimeout(() => {
            try {
                // İlan verilerini localStorage'a kaydet (gerçek uygulamada API'ye gönderilir)
                const listings = JSON.parse(localStorage.getItem('user_listings') || '[]');
                
                const newListing = {
                    id: Date.now(),
                    title: formData.get('title'),
                    category: formData.get('category'),
                    brand: formData.get('brand'),
                    model: formData.get('model'),
                    description: formData.get('description'),
                    symptoms: formData.get('symptoms'),
                    minBudget: formData.get('minBudget'),
                    maxBudget: formData.get('maxBudget'),
                    city: formData.get('city'),
                    district: formData.get('district'),
                    address: formData.get('address'),
                    contactTime: formData.get('contactTime'),
                    preferredContact: formData.get('preferredContact'),
                    createdAt: new Date().toISOString(),
                    status: 'active',
                    photos: uploadedFilesList.length // Fotoğraf sayısı
                };
                
                listings.push(newListing);
                localStorage.setItem('user_listings', JSON.stringify(listings));
                
                // Başarı mesajı göster
                showSuccessMessage();
                
                // 2 saniye sonra ilanlar sayfasına yönlendir
                setTimeout(() => {
                    window.location.href = 'listings.html';
                }, 2000);
                
            } catch (error) {
                console.error('İlan oluşturma hatası:', error);
                alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
                
                // Butonu eski haline getir
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }, 1500);
    }
    
    // Başarı mesajı gösterme
    function showSuccessMessage() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 400px;">
                <div style="color: #28a745; font-size: 48px; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #28a745; margin-bottom: 15px;">İlan Başarıyla Oluşturuldu!</h2>
                <p style="color: #666; margin-bottom: 20px;">
                    İlanınız yayınlandı. Tamirciler size teklifler göndermeye başlayacak.
                </p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <small style="color: #666;">
                        <i class="fas fa-info-circle"></i> 
                        İlanlar sayfasına yönlendiriliyorsunuz...
                    </small>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 2 saniye sonra modalı kaldır
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 2000);
    }
    
    // Kullanıcı oturum kontrolü
    function checkUserSession() {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                updateHeaderForLoggedInUser(userData);
            } catch (e) {
                console.error('User data parse error:', e);
            }
        }
    }
    
    // Header'ı giriş yapan kullanıcı için güncelle
    function updateHeaderForLoggedInUser(user) {
        console.log('create-listing.js: updateHeaderForLoggedInUser çağrıldı, user:', user);
        
        try {
            const nav = document.querySelector('.main-nav ul');
            if (!nav) {
                console.error('create-listing.js: Nav elementi bulunamadı');
                return;
            }

            // Giriş ve kayıt butonlarını kaldır
            const loginButton = document.querySelector('.login-btn');
            if (loginButton) {
                console.log('create-listing.js: Login butonu kaldırılıyor');
                const loginLi = loginButton.closest('li');
                if (loginLi) {
                    loginLi.remove();
                }
            }

            const signupButton = document.querySelector('.signup-btn');
            if (signupButton) {
                console.log('create-listing.js: Signup butonu kaldırılıyor');
                const signupLi = signupButton.closest('li');
                if (signupLi) {
                    signupLi.remove();
                }
            }
            
            // Kullanıcı menüsünü ekle (eğer daha önce eklenmemişse)
            if (!document.querySelector('.user-menu')) {
                const userMenuItem = document.createElement('li');
                userMenuItem.classList.add('user-menu');
                
                // Kullanıcı rolünü belirle
                const role = user.role === 'technician' ? 'Tamirci' : 
                            user.role === 'admin' ? 'Admin' : 'Müşteri';
                
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
                            <li><a href="profile.html#panel" id="panel-link"><i class="fas fa-tachometer-alt"></i> Panel</a></li>
                            <li><a href="profile.html"><i class="fas fa-user-cog"></i> Profil</a></li>
                            <li><a href="profile.html#chat" id="chat-link"><i class="fas fa-comments"></i> Sohbet</a></li>
                            <li><a href="profile.html#offers" id="offers-link"><i class="fas fa-handshake"></i> Teklifler</a></li>
                            <li><a href="profile.html#notifications" id="notifications-link"><i class="fas fa-bell"></i> Bildirimler</a></li>
                            ${user.role === 'admin' || user.userType === 'admin' ? '<li class="divider"></li><li><a href="#" id="admin-panel-link"><i class="fas fa-shield-alt"></i> Admin Paneli</a></li>' : ''}
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
                
                console.log('create-listing.js: Kullanıcı menüsü eklendi');
                
                // Event listeners ekle
                setupUserMenuEventListeners(userMenuItem, user);
            } else {
                console.log('create-listing.js: Kullanıcı menüsü zaten mevcut');
            }
        } catch (error) {
            console.error('create-listing.js: updateHeaderForLoggedInUser hatası:', error);
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
            window.location.href = 'profile.html#panel';
        });
        
        // Sohbet butonuna tıklandığında
        const chatLink = userMenuItem.querySelector('#chat-link');
        chatLink.addEventListener('click', function(e) {
            window.location.href = 'profile.html#chat';
        });
        
        // Teklifler butonuna tıklandığında
        const offersLink = userMenuItem.querySelector('#offers-link');
        offersLink.addEventListener('click', function(e) {
            window.location.href = 'profile.html#offers';
        });
        
        // Bildirimler butonuna tıklandığında
        const notificationsLink = userMenuItem.querySelector('#notifications-link');
        notificationsLink.addEventListener('click', function(e) {
            window.location.href = 'profile.html#notifications';
        });
        
        // Admin paneli butonuna tıklandığında (sadece admin kullanıcılar için)
        const adminPanelLink = userMenuItem.querySelector('#admin-panel-link');
        if (adminPanelLink) {
            adminPanelLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Admin paneli bu sayfada kullanılamaz. Ana sayfaya yönlendiriliyorsunuz.');
                window.location.href = 'index.html';
            });
        }
        
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
}); 