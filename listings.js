document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde çalışacak kodlar
    // Not: Filtreleme işlemleri artık filtreleme_yedek.js'den yönetiliyor
    // initializeFilters();
    // setupEventListeners();
    
    // URL parametresini kontrol et ve arama yap
    checkURLSearchParameter();
    
    loadListings();
    
    // Kullanıcı ilanlarını yükle (biraz gecikmeli ki grid hazır olsun)
    setTimeout(() => {
        loadUserListings();
        setupListingButtons();
    }, 500);
});

// Sayfa ilk yüklendiğinde çalışacak işlemler
function initializeFilters() {
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
    // Kategori filtrelerini oluştur
    const filterCategory = document.querySelector('.filter-category');
    const filterStatus = document.querySelector('.filter-status');
    const filterUrgency = document.querySelector('.filter-urgency');
    
    // Aktif filtreleri gizle (varsayılan olarak hiçbir filtre seçili değil)
    const activeFilters = document.querySelector('.active-filters');
    if (activeFilters.children.length <= 1) { // Sadece "Tümünü Temizle" butonu varsa
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
    */
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
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
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
    
    // Aktif filtre etiketlerindeki çarpıları dinle
    const activeFilters = document.querySelector('.active-filters');
    if (activeFilters) {
        activeFilters.addEventListener('click', function(e) {
            if (e.target.classList.contains('fa-times')) {
                // Filtre etiketini kaldır
                const filterTag = e.target.parentElement;
                filterTag.remove();
                
                // Filtreleri yeniden uygula
                applyFilters();
                
                // Aktif filtre yoksa container'ı gizle
                if (activeFilters.children.length <= 1) {
                    activeFilters.parentElement.style.display = 'none';
                }
            } else if (e.target.classList.contains('clear-all')) {
                resetFilters();
            }
        });
    }
    
    // Pagination kaldırıldı
    
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
                applyFilters();
            }
        });
        
        // Arama butonuna tıklandığında ara
        searchButton.addEventListener('click', function() {
            applyFilters();
        });
    }
    */
}

// Filtreleri uygula
function applyFilters() {
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
    // Seçili kategorileri al
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category input:checked')).map(input => input.value);
    
    // Seçili şehir ve ilçe
    const selectedCity = document.getElementById('city-filter').value;
    const selectedDistrict = document.getElementById('district-filter').value;
    
    // Fiyat aralığı
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    
    // Aciliyet durumu
    const selectedUrgency = Array.from(document.querySelectorAll('.filter-urgency input:checked')).map(input => input.value);
    
    // İlan durumu
    const selectedStatus = Array.from(document.querySelectorAll('.filter-status input:checked')).map(input => input.value);
    
    // Arama metni
    const searchText = document.getElementById('listings-search-input').value.trim();
    
    // Sıralama
    const sortOption = document.getElementById('listings-sort').value;
    
    // Aktif filtreleri güncelle
    updateActiveFilterTags(selectedCategories, selectedCity, selectedDistrict, minPrice, maxPrice, selectedUrgency, selectedStatus, searchText);
    
    // Burada API çağrısı yapılacak ve ilanlar filtrelenerek getirilecek
    // Örnek bir gecikme simülasyonu
    showLoadingState();
    setTimeout(() => {
        loadListings(1, {
            categories: selectedCategories,
            city: selectedCity,
            district: selectedDistrict,
            minPrice: minPrice,
            maxPrice: maxPrice,
            urgency: selectedUrgency,
            status: selectedStatus,
            search: searchText,
            sort: sortOption
        });
    }, 600);
    */
}

// Aktif filtre etiketlerini güncelle
function updateActiveFilterTags(categories, city, district, minPrice, maxPrice, urgency, status, searchText) {
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
    const activeFilters = document.querySelector('.active-filters');
    
    // Tümünü temizle butonu hariç tüm etiketleri temizle
    const clearAllButton = activeFilters.querySelector('.clear-all');
    activeFilters.innerHTML = '';
    
    if (clearAllButton) {
        activeFilters.appendChild(clearAllButton);
    } else {
        // Tümünü temizle butonunu ekle
        const clearAllTag = document.createElement('span');
        clearAllTag.className = 'filter-tag clear-all';
        clearAllTag.textContent = 'Tümünü Temizle';
        activeFilters.appendChild(clearAllTag);
    }
    
    // Kategorileri ekle
    categories.forEach(category => {
        const categoryName = document.querySelector(`.filter-category input[value="${category}"]`).nextElementSibling.textContent.trim();
        addFilterTag(categoryName);
    });
    
    // Şehir ve ilçe
    if (city) {
        const cityName = document.querySelector(`#city-filter option[value="${city}"]`).textContent;
        if (district) {
            const districtName = document.querySelector(`#district-filter option[value="${district}"]`).textContent;
            addFilterTag(`${cityName}, ${districtName}`);
        } else {
            addFilterTag(cityName);
        }
    }
    
    // Fiyat aralığı
    if (minPrice && maxPrice) {
        addFilterTag(`₺${minPrice} - ₺${maxPrice}`);
    }
    
    // Aciliyet
    urgency.forEach(urg => {
        const urgencyName = document.querySelector(`.filter-urgency input[value="${urg}"]`).nextElementSibling.textContent.trim();
        addFilterTag(urgencyName);
    });
    
    // Durum
    status.forEach(stat => {
        const statusName = document.querySelector(`.filter-status input[value="${stat}"]`).nextElementSibling.textContent.trim();
        addFilterTag(statusName);
    });
    
    // Arama metni
    if (searchText) {
        addFilterTag(`Arama: ${searchText}`);
    }
    
    // Aktif filtre varsa container'ı göster, yoksa gizle
    if (activeFilters.children.length > 1) {
        activeFilters.parentElement.style.display = 'block';
    } else {
        activeFilters.parentElement.style.display = 'none';
    }
    */
}

// Yardımcı fonksiyon: Filtre etiketi ekle
function addFilterTag(text) {
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
    activeFilters.appendChild(tag);
    */
}

// Filtreleri sıfırla
function resetFilters() {
    // jQuery filtreleme işlevi kullanıldığından bu fonksiyon devre dışı bırakıldı
    /*
    // Tüm filtreleri sıfırla
    document.querySelectorAll('.filter-category input').forEach(input => input.checked = false);
    document.querySelectorAll('.filter-urgency input').forEach(input => input.checked = false);
    document.querySelectorAll('.filter-status input').forEach(input => input.checked = false);
    
    document.getElementById('city-filter').value = '';
    document.getElementById('district-filter').value = '';
    document.getElementById('district-filter').disabled = true;
    
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('price-range').value = 5000;
    
    document.getElementById('listings-search-input').value = '';
    document.getElementById('listings-sort').value = 'newest';
    
    // Aktif filtreleri temizle
    const activeFilters = document.querySelector('.active-filters');
    const clearAllButton = activeFilters.querySelector('.clear-all');
    
    activeFilters.innerHTML = '';
    if (clearAllButton) {
        activeFilters.appendChild(clearAllButton);
    }
    
    activeFilters.parentElement.style.display = 'none';
    
    // İlanları varsayılan olarak yeniden yükle
    showLoadingState();
    setTimeout(() => {
        loadListings();
    }, 300);
    */
}

// Yükleniyor durumunu göster
function showLoadingState() {
    const listingsGrid = document.querySelector('.listings-grid');
    const loadingHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>İlanlar yükleniyor...</p>
        </div>
    `;
    
    if (listingsGrid) {
        listingsGrid.innerHTML = loadingHTML;
    }
}

// İlanları yükle
function loadListings(page = 1, filters = {}) {
    console.log('Sayfa', page, 'yükleniyor');
    console.log('Uygulanan filtreler:', filters);
    
    // Burada gerçek bir API'dan veri çekilecek, şimdilik örnek olarak mevcut ilanları gösteriyoruz
    const listingsCount = document.querySelector('.listings-count span');
    if (listingsCount) {
        // Örnek ilan sayısı
        let count = 145;
        
        // Filtre varsa ilan sayısını azalt (simülasyon)
        if (Object.keys(filters).length > 0) {
            if (filters.categories && filters.categories.length > 0) {
                count = Math.floor(count * 0.7);
            }
            if (filters.city) {
                count = Math.floor(count * 0.6);
            }
            if (filters.search) {
                count = Math.floor(count * 0.4);
            }
            // Minimum 5 ilan gösterilsin
            count = Math.max(count, 5);
        }
        
        listingsCount.textContent = count;
    }
    
    // Sayfa yükleme işlemleri tamamlandı
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.remove();
    }
}

// Stil ekleyelim
const style = document.createElement('style');
style.textContent = `
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    width: 100%;
}

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #e53935;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.listings-header {
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('images/workshop.jpg');
    background-size: cover;
    background-position: center;
    height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    padding: 0 20px;
}

.listings-header-content h2 {
    font-size: 36px;
    margin-bottom: 10px;
}

.listings-header-content p {
    font-size: 18px;
    max-width: 600px;
}

.listings-section {
    padding: 40px 20px;
    background-color: #f8f9fa;
}

.listings-container-wrapper {
    display: flex;
    max-width: 1300px;
    margin: 0 auto;
    gap: 30px;
}

.listings-sidebar {
    width: 22%;
    padding-right: 15px;
    margin-left: -45px;
}

.listings-main {
    width: 78%;
    padding-left: 25px;
}

.filter-box {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.filter-box h3 {
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    color: #333;
}

.filter-category, .filter-urgency, .filter-status {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-category label, .filter-urgency label, .filter-status label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #555;
}

.filter-location {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.filter-location select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
}

.filter-price {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.price-inputs {
    display: flex;
    align-items: center;
    gap: 10px;
}

.price-inputs input {
    width: 80px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
}

.filter-buttons {
    display: flex;
    gap: 10px;
}

.apply-filter-button, .reset-filter-button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.apply-filter-button {
    background-color: #e53935;
    color: white;
    flex: 2;
}

.reset-filter-button {
    background-color: #f5f5f5;
    color: #333;
    flex: 1;
}

.listings-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.listings-search {
    display: flex;
    width: 60%;
}

.listings-search input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 4px 0 0 4px;
    flex: 1;
    font-size: 14px;
}

.listings-search .search-button {
    padding: 10px 15px;
    background-color: #e53935;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
}

.listings-sort-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.listings-sort-container label {
    font-size: 14px;
    color: #555;
}

.listings-sort-container select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.filter-tags-container {
    margin-bottom: 20px;
}

.active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: #f0f0f0;
    border-radius: 20px;
    font-size: 13px;
    color: #333;
}

.filter-tag i {
    cursor: pointer;
    font-size: 11px;
    color: #777;
}

.filter-tag.clear-all {
    background-color: transparent;
    color: #e53935;
    cursor: pointer;
    font-weight: 500;
}

.listings-results {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.listings-count {
    margin-bottom: 20px;
    font-size: 14px;
    color: #555;
}

.listings-count span {
    font-weight: bold;
    color: #333;
}

.listings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 30px;
}

.listing-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    width: 100%;
    max-width: none;
}

.listing-image {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.listing-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
}

.listing-content {
    padding: 15px;
}

.listing-header h4 {
    font-size: 16px;
    color: #333;
    margin: 0;
}

.listing-description {
    font-size: 13px;
    color: #666;
    margin-bottom: 15px;
    line-height: 1.4;
    height: 54px;
    overflow: hidden;
}

.listing-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    margin-bottom: 12px;
}

.listings-pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 4px;
    background-color: #f5f5f5;
    color: #333;
    cursor: pointer;
    font-size: 14px;
}

.pagination-button.active {
    background-color: #e53935;
    color: white;
}

.pagination-button.next {
    width: auto;
    padding: 0 10px;
}

@media (max-width: 992px) {
    .listings-container-wrapper {
        flex-direction: column;
    }
    
    .listings-sidebar, .listings-main {
        width: 100%;
    }
    
    .listings-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .listings-top-bar {
        flex-direction: column;
        gap: 15px;
    }
    
    .listings-search {
        width: 100%;
    }
}

@media (max-width: 576px) {
    .price-inputs {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .price-inputs input {
        width: 100%;
    }
    
    .filter-buttons {
        flex-direction: column;
    }
    
    .listings-sort-container {
        width: 100%;
        justify-content: space-between;
    }
    
    .pagination-button {
        width: 30px;
        height: 30px;
        font-size: 12px;
    }
    
    .listings-grid {
        grid-template-columns: 1fr;
    }
}

// Featured sınıflı ilan kartlarının stillerini düzenleme
.listing-card.featured {
    border: none;
    transform: none;
}

// Aciliyet ve diğer rozetleri gizleme
.listing-badge {
    display: none;
}
`;

document.head.appendChild(style);

// Pagination fonksiyonları kaldırıldı

// Kategori değerini insanların okuyabileceği hale getir
function getCategoryName(category) {
    const categoryNames = {
        'bilgisayar': 'Bilgisayar',
        'telefon': 'Telefon',
        'beyaz_esya': 'Beyaz Eşya',
        'elektronik': 'Elektronik',
        'elektrik': 'Elektrik',
        'su_tesisati': 'Su Tesisatı',
        'mobilya': 'Mobilya',
        'isi_sistemleri': 'Isı Sistemleri',
        'ev_aletleri': 'Ev Aletleri'
    };
    
    return categoryNames[category] || category;
}

// İlan sayısını güncelle
function updateListingCount() {
    const listingsCount = document.querySelector('.listings-count span');
    if (listingsCount) {
        // Tüm görünür ilanları say
        const visibleCards = document.querySelectorAll('.listing-card:not([style*="display: none"])');
        listingsCount.textContent = visibleCards.length;
    }
}

// URL'den arama parametresini oku ve arama yap
function checkURLSearchParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        // Arama kutusuna terimi yaz
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = decodeURIComponent(searchTerm);
            
            // jQuery filtreleme fonksiyonunu tetikle
            setTimeout(() => {
                $(searchInput).trigger('keyup');
            }, 100);
        }
    }
}

// Kullanıcı ilanlarını localStorage'dan yükle ve göster
function loadUserListings() {
    const userListings = JSON.parse(localStorage.getItem('user_listings') || '[]');
    console.log('Kullanıcı ilanları yüklendi:', userListings);
    
    if (userListings.length > 0) {
        const listingsGrid = document.querySelector('.listings-grid');
        
        if (!listingsGrid) {
            console.error('Listings grid bulunamadı');
            return;
        }
        
        // Kullanıcı ilanlarını en başa ekle
        userListings.reverse().forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card user-listing';
            listingCard.setAttribute('data-category', listing.category);
            listingCard.setAttribute('data-city', listing.city);
            listingCard.setAttribute('data-price', listing.maxBudget || listing.minBudget || 0);
            
            // Fiyat aralığını oluştur
            let priceRange = '';
            if (listing.minBudget && listing.maxBudget) {
                priceRange = `₺${listing.minBudget} - ₺${listing.maxBudget}`;
            } else if (listing.minBudget) {
                priceRange = `₺${listing.minBudget}+`;
            } else if (listing.maxBudget) {
                priceRange = `₺${listing.maxBudget}'e kadar`;
            } else {
                priceRange = 'Belirtilmedi';
            }
            
            // Zaman formatı
            const createdDate = new Date(listing.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - createdDate);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let timeText = '';
            if (diffHours < 1) {
                timeText = 'Az önce';
            } else if (diffHours < 24) {
                timeText = `${diffHours} saat önce`;
            } else if (diffDays === 1) {
                timeText = 'Dün';
            } else {
                timeText = `${diffDays} gün önce`;
            }
            
            // Şehir adları
            const cities = {
                'istanbul': 'İstanbul',
                'ankara': 'Ankara', 
                'izmir': 'İzmir',
                'bursa': 'Bursa',
                'adana': 'Adana',
                'antalya': 'Antalya'
            };
            
            listingCard.innerHTML = `
                <div class="listing-image">
                    <img src="images/listings/user-listing-default.jpg" alt="${listing.title}" onerror="this.src='images/listings/laptop-fan.jpg'">
                    <span class="listing-category">${getCategoryName(listing.category)}</span>
                    <span style="position: absolute; top: 10px; right: 10px; background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">BENİM İLANIM</span>
                </div>
                <div class="listing-content">
                    <div class="listing-header">
                        <h4>${listing.title}</h4>
                        <span class="listing-price">${priceRange}</span>
                    </div>
                    <p class="listing-description">${listing.description}</p>
                    <div class="listing-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${cities[listing.city] || listing.city}, ${listing.district}</span>
                        <span><i class="fas fa-clock"></i> ${timeText}</span>
                    </div>
                    <a href="#" class="listing-button">İncele</a>
                </div>
            `;
            
            // İlanı grid'in başına ekle
            listingsGrid.insertBefore(listingCard, listingsGrid.firstChild);
            
            // İncele butonuna click event ekle
            const viewButton = listingCard.querySelector('.listing-button');
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`listing-detail-new.html?id=${listing.id}&user=true`, '_blank');
            });
        });
        
        // İlan sayısını güncelle
        const listingsCount = document.querySelector('.listings-count span');
        if (listingsCount) {
            const currentCount = parseInt(listingsCount.textContent) || 0;
            listingsCount.textContent = currentCount + userListings.length;
        }
    }
}

function setupListingButtons() {
    // Mevcut sistem ilanlarının incele butonlarını aktifleştir
    const listingCards = document.querySelectorAll('.listing-card');
    
    listingCards.forEach((card) => {
        const viewButton = card.querySelector('.listing-button');
        const badge = card.querySelector('[style*="BENİM İLANIM"]');
        
        // Eğer "BENİM İLANIM" rozeti yoksa sistem ilanıdır
        if (!badge && viewButton && !viewButton.dataset.eventAdded) {
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                // data-id attribute'undan gerçek ID'yi al
                const listingId = card.getAttribute('data-id') || card.dataset.id;
                if (listingId) {
                    window.open(`listing-detail-new.html?id=${listingId}&user=false`, '_blank');
                } else {
                    console.error('İlan ID\'si bulunamadı:', card);
                }
            });
            viewButton.dataset.eventAdded = 'true';
        }
    });
}