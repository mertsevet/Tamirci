// API URL
const API_URL = window.API_URL || 'http://localhost:3001';

// API çalışmadığında kullanmak için basit bir localStorage DB sim.
const useLocalStorageDB = true; // API çalışmadığında bunu true yapın

function simulateAPIDelay() {
    return new Promise(resolve => setTimeout(resolve, 300));
}

// Local storage'dan kullanıcıları al
function getLocalUsers() {
    const users = localStorage.getItem('local_users');
    return users ? JSON.parse(users) : [];
}

// Local storage'a kullanıcı kaydet
function saveLocalUsers(users) {
    localStorage.setItem('local_users', JSON.stringify(users));
}

// Fonksiyonları global scope'ta tanımlayalım
window.registerUser = async function(userData) {
    try {
        if (useLocalStorageDB) {
            await simulateAPIDelay();
            
            // Tüm kullanıcıları getir
            const users = getLocalUsers();
            
            // Email kontrol
            if (users.some(user => user.email === userData.email)) {
                return { success: false, message: 'Bu e-posta adresi zaten kullanılıyor.' };
            }
            
            // ID atama
            const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
            
            // Yeni kullanıcı oluştur
            const newUser = {
                ...userData,
                id: newId,
                createdAt: new Date().toISOString()
            };
            
            // Kullanıcıyı kaydet
            users.push(newUser);
            saveLocalUsers(users);
            
            // Oturum bilgilerini güncelle (şifre olmadan)
            const { password, ...userWithoutPassword } = newUser;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            localStorage.setItem('token', generateToken());
            
            return { success: true, user: userWithoutPassword };
        }
    
        // Email kullanılıyor mu kontrol et
        const emailCheck = await fetch(`${API_URL}/users?email=${userData.email}`);
        const existingUsers = await emailCheck.json();
        
        if (existingUsers.length > 0) {
            return { success: false, message: 'Bu e-posta adresi zaten kullanılıyor.' };
        }
        
        // Kullanıcı ID'sini otomatik oluşturmak için mevcut kullanıcıları al
        const usersResponse = await fetch(`${API_URL}/users`);
        const users = await usersResponse.json();
        const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
        
        // Yeni kullanıcı oluştur
        const newUser = {
            ...userData,
            id: newId,
            createdAt: new Date().toISOString()
        };
        
        // Kullanıcıyı API'ye kaydet
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        
        if (!response.ok) {
            throw new Error('Kullanıcı kaydedilemedi.');
        }
        
        const savedUser = await response.json();
        
        // Şifreyi istemci tarafında saklamadan önce kaldır
        const { password, ...userWithoutPassword } = savedUser;
        
        // Kullanıcı bilgilerini localStorage'a kaydet (oturum)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', generateToken()); // Basit bir token oluştur
        
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error('Kayıt hatası:', error);
        return { success: false, message: 'Kayıt sırasında bir hata oluştu.' };
    }
};

// Kullanıcı Girişi
window.loginUser = async function(email, password) {
    try {
        if (useLocalStorageDB) {
            await simulateAPIDelay();
            
            // Tüm kullanıcıları getir
            const users = getLocalUsers();
            
            // Kullanıcıyı bul
            const user = users.find(u => u.email === email);
            
            if (!user) {
                return { success: false, message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' };
            }
            
            // Şifre kontrolü
            if (user.password !== password) {
                return { success: false, message: 'Hatalı şifre girdiniz.' };
            }
            
            // Şifreyi çıkarıp döndür
            const { password: userPassword, ...userWithoutPassword } = user;
            
            // Oturum bilgilerini güncelle
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            localStorage.setItem('token', generateToken());
            
            console.log('🔥 Giriş başarılı, kullanıcı bilgileri:', userWithoutPassword);
            console.log('🔥 UserType:', userWithoutPassword.userType);
            console.log('🔥 Role:', userWithoutPassword.role);
            
            return { success: true, user: userWithoutPassword };
        }
        
        // API üzerinden giriş
        // Kullanıcıyı bul
        const response = await fetch(`${API_URL}/users?email=${email}`);
        const users = await response.json();
        
        if (users.length === 0) {
            return { success: false, message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' };
        }
        
        const user = users[0];
        
        // Şifreyi kontrol et
        if (user.password !== password) {
            return { success: false, message: 'Hatalı şifre girdiniz.' };
        }
        
        // Şifreyi istemci tarafında saklamadan önce kaldır
        const { password: userPassword, ...userWithoutPassword } = user;
        
        // Kullanıcı bilgilerini localStorage'a kaydet (oturum)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', generateToken()); // Basit bir token oluştur
        
        console.log('Giriş başarılı, kullanıcı bilgileri:', userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error('Giriş hatası:', error);
        return { success: false, message: 'Giriş sırasında bir hata oluştu.' };
    }
};

// Kullanıcı Çıkışı
window.logoutUser = function() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
};

// Basit bir token oluştur (gerçek bir uygulamada daha güvenli bir yöntem kullanılmalıdır)
function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Mevcut kullanıcı oturumunu kontrol et
window.checkUserSession = function() {
    const token = localStorage.getItem('token');
    const userJSON = localStorage.getItem('user');
    
    console.log('checkUserSession çağrıldı, token:', token);
    console.log('userJSON:', userJSON);
    
    if (token && userJSON) {
        try {
            const user = JSON.parse(userJSON);
            console.log('Oturum aktif, kullanıcı:', user);
            return { loggedIn: true, user };
        } catch (error) {
            console.error('JSON parse hatası:', error);
            return { loggedIn: false };
        }
    }
    
    console.log('Oturum aktif değil');
    return { loggedIn: false };
};

// Test hesabı oluşturma (hızlı test için)
function createTestUser() {
    const testUser = {
        id: 999,
        name: "Admin Test Kullanıcı",
        firstName: "Admin",
        lastName: "Test",
        email: "test@example.com",
        password: "test123",
        role: "admin", // Admin rolü
        userType: "admin", // Admin kullanıcı tipi
        permissions: {
            canViewAllListings: true,
            canEditAllListings: true,
            canDeleteAllListings: true,
            canManageUsers: true,
            canViewStatistics: true,
            canMakeOffers: true,
            canReceiveOffers: true,
            canChat: true,
            canAccessAdminPanel: true
        },
        createdAt: new Date().toISOString()
    };
    
    const users = getLocalUsers();
    const existingUserIndex = users.findIndex(u => u.email === testUser.email);
    
    if (existingUserIndex !== -1) {
        // Mevcut kullanıcıyı admin yap
        users[existingUserIndex] = { ...users[existingUserIndex], ...testUser };
        console.log('Mevcut test kullanıcısı admin yapıldı');
    } else {
        // Yeni admin kullanıcı oluştur
        users.push(testUser);
        console.log('Yeni admin test kullanıcısı oluşturuldu');
    }
    
    saveLocalUsers(users);
    
    // Eğer şu anda bu kullanıcı ile giriş yapılmışsa, oturum bilgilerini güncelle
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.email === testUser.email) {
            const { password, ...userWithoutPassword } = testUser;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            console.log('Aktif oturum admin haklarıyla güncellendi');
        }
    }
}

// Test kullanıcısı oluştur
createTestUser();

// Admin kontrol fonksiyonları
window.isAdmin = function() {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || user.userType === 'admin');
};

window.hasPermission = function(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    // Admin kullanıcılar tüm yetkiye sahip
    if (user.role === 'admin' || user.userType === 'admin') return true;
    
    // Spesifik yetki kontrolü
    return user.permissions && user.permissions[permission] === true;
};

window.getCurrentUser = function() {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
        try {
            return JSON.parse(userJSON);
        } catch (error) {
            console.error('Kullanıcı bilgisi parse hatası:', error);
            return null;
        }
    }
    return null;
};

// Admin paneli erişim kontrolü
window.checkAdminAccess = function() {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || user.userType === 'admin' || hasPermission('canAccessAdminPanel'));
};

// Kullanıcı bilgilerini güncelle
window.updateUserProfile = async function(userId, updatedData) {
    try {
        if (useLocalStorageDB) {
            await simulateAPIDelay();
            
            // Tüm kullanıcıları getir
            const users = getLocalUsers();
            
            // Güncellenen kullanıcıyı bul
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                throw new Error('Kullanıcı bulunamadı');
            }
            
            // Kullanıcıyı güncelle
            const updatedUser = { ...users[userIndex], ...updatedData };
            users[userIndex] = updatedUser;
            
            // Kullanıcılar listesini güncelle
            saveLocalUsers(users);
            
            // Şifreyi temizle
            const { password, ...userWithoutPassword } = updatedUser;
            
            // Eğer aktif oturumda bu kullanıcı güncellendiyse oturum bilgilerini güncelle
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.id === userId) {
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            }
            
            return { success: true, user: userWithoutPassword };
        }
    
        // Mevcut kullanıcı verilerini al
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) {
            throw new Error('Kullanıcı bilgileri alınamadı.');
        }
        
        const existingUser = await response.json();
        
        // Güncellenecek alanları birleştir
        const updatedUser = { ...existingUser, ...updatedData };
        
        // API'ye güncelleme isteği gönder
        const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });
        
        if (!updateResponse.ok) {
            throw new Error('Kullanıcı bilgileri güncellenemedi.');
        }
        
        const savedUser = await updateResponse.json();
        
        // Şifreyi istemci tarafında saklamadan önce kaldır
        const { password, ...userWithoutPassword } = savedUser;
        
        // localStorage'daki kullanıcı bilgilerini güncelle
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        return { success: false, message: 'Profil güncellenirken bir hata oluştu.' };
    }
}; 