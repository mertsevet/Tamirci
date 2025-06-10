document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı oturum kontrolü
    checkUserSession();
    
    // Sayfa yüklendiğinde çalışacak kodlar
    // Not: Filtreleme işlemleri artık filtreleme_yedek.js'den yönetiliyor
    initializeFilters();
    setupEventListeners();
    
    // URL parametresini kontrol et ve arama yap
    checkURLSearchParameter();
    
    // Tüm ilanları görünür yap (filtreleme sorununu çözmek için)
    showAllListings();
    
    // Global event delegation for listing buttons
    setupGlobalListingButtonListener();
    
    // loadListings() devre dışı - HTML'deki statik ilanları kullanacağız
    // loadListings();
    
    // Kullanıcı ilanlarını yükle (biraz gecikmeli ki grid hazır olsun)
    setTimeout(() => {
        // loadUserListings(); // GEÇİCİ DEVRE DIŞI
        setupListingButtons();
    }, 500);
});

// Sayfa ilk yüklendiğinde çalışacak işlemler
function initializeFilters() {
    // Aktif filtreleri gizle (varsayılan olarak hiçbir filtre seçili değil)
    const activeFilters = document.querySelector('.active-filters');
    if (activeFilters && activeFilters.children.length <= 1) { // Sadece "Tümünü Temizle" butonu varsa
        activeFilters.parentElement.style.display = 'none';
    }
    
    // Fiyat aralığı sürgüsünü ayarla
    const priceRange = document.getElementById('price-range');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (priceRange && minPrice && maxPrice) {
        priceRange.addEventListener('input', function() {
            maxPrice.value = this.value;
            // Minimum fiyat, maksimum fiyatın %10'u olarak varsayalım
            minPrice.value = Math.round(this.value * 0.1);
        });
        
        minPrice.addEventListener('input', function() {
            if (parseInt(this.value) > parseInt(maxPrice.value)) {
                this.value = maxPrice.value;
            }
        });
        
        maxPrice.addEventListener('input', function() {
            if (parseInt(this.value) < parseInt(minPrice.value)) {
                this.value = minPrice.value;
            }
            priceRange.value = this.value;
        });
    }
    
    // Şehir ve ilçe bilgilerini yükle
    loadCityDistricts();
}

// Şehir seçildiğinde ilçeleri yükleme
function loadCityDistricts() {
    const cityFilter = document.getElementById('city-filter');
    const districtFilter = document.getElementById('district-filter');
    
    if (cityFilter && districtFilter) {
        // Şehir değiştiğinde ilçeleri güncelle
        cityFilter.addEventListener('change', function() {
            const selectedCity = this.value;
            
            if (selectedCity) {
                districtFilter.disabled = false;
                
                // İlçeleri temizle
                districtFilter.innerHTML = '<option value="">Tüm İlçeler</option>';
                
                // Seçilen şehre göre ilçeleri ekle
                const districts = getCityDistricts(selectedCity);
                districts.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.toLowerCase();
                    option.textContent = district;
                    districtFilter.appendChild(option);
                });
            } else {
                districtFilter.disabled = true;
                districtFilter.innerHTML = '<option value="">Tüm İlçeler</option>';
            }
        });
    }
}

// Şehirlere göre ilçe bilgilerini döndüren yardımcı fonksiyon
function getCityDistricts(city) {
    const cityDistricts = {
        'istanbul': ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
        'ankara': ['Altındağ', 'Çankaya', 'Etimesgut', 'Keçiören', 'Mamak', 'Sincan', 'Yenimahalle', 'Akyurt', 'Beypazarı', 'Çamlıdere', 'Çubuk', 'Elmadağ', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kahramankazan', 'Kızılcahamam', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Şereflikoçhisar'],
        'izmir': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
        'bursa': ['Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
        'antalya': ['Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradi', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik'],
        'adana': ['Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir']
    };
    
    return cityDistricts[city] || [];
}

// Olay dinleyicilerini ayarla
function setupEventListeners() {
    // Filtreleri uygula butonu
    const applyFiltersButton = document.getElementById('apply-filter');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Filtreleri temizle butonu
    const resetFiltersButton = document.getElementById('reset-filter');
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Sıralama değiştiğinde
    const sortSelect = document.getElementById('listings-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Arama kutusu
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // Enter tuşuna basıldığında ara
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Arama butonuna tıklandığında ara
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }
}

// Arama işlemi
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    const listingCards = document.querySelectorAll('.listing-card');
    let visibleCount = 0;
    
    listingCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('.listing-description').textContent.toLowerCase();
        const category = card.querySelector('.listing-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // İlan sayısını güncelle
    const countElement = document.querySelector('.listings-count span');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
}

// Filtreleri uygula
function applyFilters() {
    // Seçili kategorileri al
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category input:checked')).map(input => input.value);
    
    // Seçili şehir ve ilçe
    const selectedCity = document.getElementById('city-filter') ? document.getElementById('city-filter').value : '';
    const selectedDistrict = document.getElementById('district-filter') ? document.getElementById('district-filter').value : '';
    
    // Fiyat aralığı
    const minPrice = document.getElementById('min-price') ? document.getElementById('min-price').value : '';
    const maxPrice = document.getElementById('max-price') ? document.getElementById('max-price').value : '';
    
    // İlan durumu
    const selectedStatus = Array.from(document.querySelectorAll('.filter-status input:checked')).map(input => input.value);
    
    // Arama metni
    const searchText = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
    
    // Aktif filtreleri güncelle
    updateActiveFilterTags(selectedCategories, selectedCity, selectedDistrict, minPrice, maxPrice, [], selectedStatus, searchText);
    
    // Filtreleme işlemini gerçekleştir
    filterListings(selectedCategories, selectedCity, selectedDistrict, minPrice, maxPrice, selectedStatus, searchText);
}

// Filtreleme işlemi
function filterListings(categories, city, district, minPrice, maxPrice, status, searchText) {
    const listingCards = document.querySelectorAll('.listing-card');
    let visibleCount = 0;
    
    listingCards.forEach(card => {
        let showCard = true;
        
        // Kategori filtresi
        if (categories.length > 0) {
            const cardCategory = card.getAttribute('data-category');
            if (!categories.includes(cardCategory)) {
                showCard = false;
            }
        }
        
        // Şehir filtresi
        if (city && showCard) {
            const cardCity = card.getAttribute('data-city');
            if (cardCity !== city) {
                showCard = false;
            }
        }
        
        // Fiyat filtresi
        if ((minPrice || maxPrice) && showCard) {
            const cardPrice = parseInt(card.getAttribute('data-price')) || 0;
            if (minPrice && cardPrice < parseInt(minPrice)) {
                showCard = false;
            }
            if (maxPrice && cardPrice > parseInt(maxPrice)) {
                showCard = false;
            }
        }
        
        // Arama filtresi
        if (searchText && showCard) {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('.listing-description').textContent.toLowerCase();
            const category = card.querySelector('.listing-category').textContent.toLowerCase();
            
            if (!title.includes(searchText.toLowerCase()) && 
                !description.includes(searchText.toLowerCase()) && 
                !category.includes(searchText.toLowerCase())) {
                showCard = false;
            }
        }
        
        // Kartı göster/gizle
        if (showCard) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // İlan sayısını güncelle
    updateListingCount(visibleCount);
}

// Aktif filtre etiketlerini güncelle
function updateActiveFilterTags(categories, city, district, minPrice, maxPrice, urgency, status, searchText) {
    const activeFilters = document.querySelector('.active-filters');
    if (!activeFilters) return;
    
    // Tümünü temizle butonu hariç tüm etiketleri temizle
    const clearAllButton = activeFilters.querySelector('.clear-all');
    activeFilters.innerHTML = '';
    
    let hasActiveFilters = false;
    
    // Kategori etiketleri
    categories.forEach(category => {
        addFilterTag(getCategoryName(category));
        hasActiveFilters = true;
    });
    
    // Şehir etiketi
    if (city) {
        addFilterTag(city.charAt(0).toUpperCase() + city.slice(1));
        hasActiveFilters = true;
    }
    
    // Fiyat etiketi
    if (minPrice || maxPrice) {
        const priceText = `₺${minPrice || '0'} - ₺${maxPrice || '∞'}`;
        addFilterTag(priceText);
        hasActiveFilters = true;
    }
    
    // Durum etiketleri
    status.forEach(s => {
        addFilterTag(getStatusName(s));
        hasActiveFilters = true;
    });
    
    // Arama etiketi
    if (searchText) {
        addFilterTag(`"${searchText}"`);
        hasActiveFilters = true;
    }
    
    // Tümünü temizle butonunu ekle
    if (hasActiveFilters && clearAllButton) {
        activeFilters.appendChild(clearAllButton);
        activeFilters.parentElement.style.display = 'block';
    } else if (clearAllButton) {
        activeFilters.appendChild(clearAllButton);
        if (!hasActiveFilters) {
            activeFilters.parentElement.style.display = 'none';
        }
    }
}

// Filtre etiketi ekle
function addFilterTag(text) {
    const activeFilters = document.querySelector('.active-filters');
    if (!activeFilters) return;
    
    const filterTag = document.createElement('span');
    filterTag.className = 'filter-tag';
    filterTag.innerHTML = `${text} <i class="fas fa-times"></i>`;
    
    // Çarpı butonuna tıklama olayı
    filterTag.querySelector('i').addEventListener('click', function() {
        filterTag.remove();
        applyFilters();
    });
    
    activeFilters.appendChild(filterTag);
}

// Filtreleri temizle
function resetFilters() {
    // Tüm filtreleri temizle
    document.querySelectorAll('.filter-category input[type="checkbox"]').forEach(input => input.checked = false);
    document.querySelectorAll('.filter-status input[type="checkbox"]').forEach(input => input.checked = false);
    
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) cityFilter.value = '';
    
    const districtFilter = document.getElementById('district-filter');
    if (districtFilter) {
        districtFilter.value = '';
        districtFilter.disabled = true;
    }
    
    const minPrice = document.getElementById('min-price');
    if (minPrice) minPrice.value = '';
    
    const maxPrice = document.getElementById('max-price');
    if (maxPrice) maxPrice.value = '';
    
    const priceRange = document.getElementById('price-range');
    if (priceRange) priceRange.value = 5000;
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Aktif filtreleri temizle
    const activeFilters = document.querySelector('.active-filters');
    if (activeFilters) {
        const clearAllButton = activeFilters.querySelector('.clear-all');
        activeFilters.innerHTML = '';
        if (clearAllButton) {
            activeFilters.appendChild(clearAllButton);
        }
        activeFilters.parentElement.style.display = 'none';
    }
    
    // Tüm ilanları göster
    showAllListings();
    
    // İlan sayısını güncelle
    updateListingCount();
}

// URL parametresini kontrol et ve arama yap
function checkURLSearchParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        // Arama kutusuna parametreyi yaz
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = decodeURIComponent(searchQuery);
            
            // Filtreleri uygula
            setTimeout(() => {
                performSearch();
            }, 100);
        }
    }
}

// Tüm ilanları görünür yap
function showAllListings() {
    const listingCards = document.querySelectorAll('.listing-card');
    listingCards.forEach(card => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
    });
    
    updateListingCount();
}

// Global event delegation for listing buttons
function setupGlobalListingButtonListener() {
    console.log('🔍 Global listing button listener kuruldu');
    
    // Ana container'a tek bir event listener ekle
    document.addEventListener('click', function(event) {
        // Sadece "İncele" butonlarını yakala
        if (event.target.classList.contains('listing-button') || 
            (event.target.tagName === 'A' && event.target.textContent.trim() === 'İncele')) {
            
            event.preventDefault();
            
            // En yakın listing card'ı bul
            const listingCard = event.target.closest('.listing-card');
            if (listingCard) {
                const listingId = listingCard.getAttribute('data-id');
                console.log(`🔥 İncele butonuna tıklandı - Listing ID: ${listingId}`);
                
                if (listingId) {
                    const detailUrl = `listing-detail-new.html?id=${listingId}&user=false`;
                    console.log(`🔍 Yönlendiriliyor: ${detailUrl}`);
                    window.location.href = detailUrl;
                } else {
                    console.error('❌ Listing ID bulunamadı!');
                }
            } else {
                console.error('❌ Listing card bulunamadı!');
            }
        }
    });
}

// Butonları ayarla
function setupListingButtons() {
    const listingButtons = document.querySelectorAll('.listing-button');
    listingButtons.forEach(button => {
        const listingCard = button.closest('.listing-card');
        if (listingCard) {
            const listingId = listingCard.getAttribute('data-id');
            console.log(`🔧 Button setup for listing ID: ${listingId}`);
        }
    });
}

// Kategori adını al
function getCategoryName(category) {
    const categoryNames = {
        'ev_aletleri': 'Ev Aletleri',
        'elektronik': 'Elektronik',
        'bilgisayar': 'Bilgisayar',
        'telefon': 'Telefon',
        'elektrik': 'Elektrik',
        'su_tesisati': 'Su Tesisatı',
        'mobilya': 'Mobilya',
        'isi_sistemleri': 'Isı Sistemleri',
        'beyaz_esya': 'Beyaz Eşya',
        'diger': 'Diğer'
    };
    
    return categoryNames[category] || category;
}

// Durum adını al
function getStatusName(status) {
    const statusNames = {
        'beklemede': 'Beklemede',
        'atandi': 'Atandı',
        'devam_ediyor': 'Devam Ediyor',
        'tamamlandi': 'Tamamlandı'
    };
    
    return statusNames[status] || status;
}

// İlan sayısını güncelle
function updateListingCount(count) {
    const countElement = document.querySelector('.listings-count span');
    if (countElement) {
        if (typeof count === 'undefined') {
            // Görünür ilanları say
            const visibleCards = document.querySelectorAll('.listing-card[style*="block"], .listing-card:not([style*="none"])');
            count = visibleCards.length;
        }
        countElement.textContent = count;
    }
}

function checkUserSession() {
    const token = localStorage.getItem('token');
    const userJSON = localStorage.getItem('user');
    
    if (token && userJSON) {
        const user = JSON.parse(userJSON);
        console.log('Kullanıcı oturumu aktif:', user);
        updateHeaderForLoggedInUser(user);
    }
}

function updateHeaderForLoggedInUser(user) {
    // Bu fonksiyon listings.html içinde inline script olarak tanımlı
    // Çakışmayı önlemek için burada boş bırakıyoruz
} 