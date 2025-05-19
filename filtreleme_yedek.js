// listings.html filtreleme kodu yedek
$(document).ready(function(){
    // Arama filtresi
    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".listing-card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        updateListingCount();
    });

    // Filtreleme fonksiyonu
    function filterListings() {
        // Tüm ilanları göster
        $(".listing-card").show();
        
        // Aktif filtre etiketlerini temizle
        $(".active-filters").empty();
        
        // Kategori filtreleri
        var selectedCategories = [];
        $(".category-filter:checked").each(function(){
            var category = $(this).val();
            selectedCategories.push(category);
            addFilterTag($(this).next("span").text().trim());
        });
        
        if (selectedCategories.length > 0) {
            $(".listing-card").each(function(){
                if (!selectedCategories.includes($(this).data("category"))) {
                    $(this).hide();
                }
            });
        }
        
        // Şehir filtresi
        var selectedCity = $("#city-filter").val();
        if (selectedCity) {
            var cityName = $("#city-filter option:selected").text();
            addFilterTag(cityName);
            $(".listing-card").each(function(){
                if ($(this).data("city") !== selectedCity) {
                    $(this).hide();
                }
            });
        }
        
        // İlçe filtresi
        var selectedDistrict = $("#district-filter").val();
        if (selectedDistrict && !$("#district-filter").prop("disabled")) {
            var districtName = $("#district-filter option:selected").text();
            addFilterTag(districtName);
        }
        
        // Fiyat aralığı filtresi
        var minPrice = parseInt($("#min-price").val()) || 0;
        var maxPrice = parseInt($("#max-price").val()) || 9999999;
        
        if (minPrice > 0 || maxPrice < 9999999) {
            addFilterTag("₺" + minPrice + " - ₺" + (maxPrice === 9999999 ? "∞" : maxPrice));
            
            $(".listing-card").each(function(){
                var price = $(this).data("price");
                if (price < minPrice || price > maxPrice) {
                    $(this).hide();
                }
            });
        }
        
        // Durum filtresi
        var selectedStatus = [];
        $(".filter-status input:checked").each(function(){
            var status = $(this).val();
            selectedStatus.push(status);
            addFilterTag($(this).next("span").text().trim());
        });
        
        // Tümünü temizle butonu ekle
        if ($(".active-filters").children().length > 0) {
            $("<span>")
                .addClass("filter-tag clear-all")
                .text("Tümünü Temizle")
                .click(resetFilters)
                .appendTo(".active-filters");
            
            // Filtre etiketleri container'ını göster
            $(".filter-tags-container").show();
        } else {
            // Filtre etiketleri container'ını gizle
            $(".filter-tags-container").hide();
        }
        
        // İlan sayısını güncelle
        updateListingCount();
    }
    
    // Filtre etiketi ekleme
    function addFilterTag(text) {
        $("<span>")
            .addClass("filter-tag")
            .html(text + ' <i class="fas fa-times"></i>')
            .appendTo(".active-filters")
            .find("i")
            .click(function(){
                $(this).parent().remove();
                
                // Etikete göre filtre öğesini temizle
                var tagText = $(this).parent().text().trim();
                
                // Kategori filtresi
                $(".category-filter").each(function(){
                    if ($(this).next("span").text().trim() === tagText) {
                        $(this).prop("checked", false);
                    }
                });
                
                // Şehir filtresi
                if ($("#city-filter option:selected").text() === tagText) {
                    $("#city-filter").val("");
                }
                
                // İlçe filtresi
                if ($("#district-filter option:selected").text() === tagText) {
                    $("#district-filter").val("");
                }
                
                // Fiyat filtresi (basit kontrol)
                if (tagText.startsWith("₺")) {
                    $("#min-price, #max-price").val("");
                }
                
                // Durum filtresi
                $(".filter-status input").each(function(){
                    if ($(this).next("span").text().trim() === tagText) {
                        $(this).prop("checked", false);
                    }
                });
                
                // Yeniden filtrele
                filterListings();
            });
    }
    
    // Filtreleri temizleme
    function resetFilters() {
        $(".category-filter").prop("checked", false);
        $("#city-filter").val("");
        $("#district-filter").val("");
        $("#district-filter").prop("disabled", true);
        $("#min-price, #max-price").val("");
        $("#price-range").val(5000);
        $(".filter-status input").prop("checked", false);
        $(".active-filters").empty();
        $(".listing-card").show();
        
        // Filtre etiketleri container'ını gizle
        $(".filter-tags-container").hide();
        
        // İlan sayısını güncelle
        updateListingCount();
    }
    
    // İlan sayısını güncelleme
    function updateListingCount() {
        var visibleCount = $(".listing-card:visible").length;
        $(".listings-count span").text(visibleCount);
    }
    
    // Filtrele butonuna tıklama
    $("#apply-filter").click(function(){
        filterListings();
    });
    
    // Temizle butonuna tıklama
    $("#reset-filter").click(function(){
        resetFilters();
    });
    
    // Sıralama değişince
    $("#listings-sort").change(function(){
        var sortType = $(this).val();
        
        if (sortType === "newest") {
            // Bu örnekte sıralama yapmıyoruz, gerçek uygulamada tarih verisine göre sıralama yapılabilir
        } else if (sortType === "price_low") {
            // Fiyata göre artan sıralama
            $(".listings-grid .listing-card").sort(function(a, b) {
                return $(a).data("price") - $(b).data("price");
            }).appendTo(".listings-grid");
        } else if (sortType === "price_high") {
            // Fiyata göre azalan sıralama
            $(".listings-grid .listing-card").sort(function(a, b) {
                return $(b).data("price") - $(a).data("price");
            }).appendTo(".listings-grid");
        }
    });
    
    // Sayfa yüklendiğinde ilan sayısını güncelle
    updateListingCount();
    
    // Sayfa değiştiğinde filtreleri sıfırla
    $(".pagination-button").click(function() {
        resetFilters();
        
        // Tüm ilanlardaki üst sınıfları kaldır
        $(".listing-card").removeClass("featured");
        $(".listing-badge").hide();
    });
    
    // Şehir seçildiğinde ilçeleri güncelle
    $("#city-filter").change(function() {
        var selectedCity = $(this).val();
        var districtFilter = $("#district-filter");
        
        if (selectedCity) {
            districtFilter.prop("disabled", false);
            
            // İlçeleri temizle
            districtFilter.html('<option value="">Tüm İlçeler</option>');
            
            // İlçeleri ekle (varsa)
            var districts = getCityDistricts(selectedCity);
            
            districts.forEach(function(district) {
                $("<option>")
                    .val(district.toLowerCase())
                    .text(district)
                    .appendTo(districtFilter);
            });
            
        } else {
            districtFilter.prop("disabled", true);
            districtFilter.html('<option value="">Tüm İlçeler</option>');
        }
    });
    
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
    
    // Sayfa yüklendiğinde filtre alanlarını başlat
    $(".filter-tags-container").hide();
    
    // Fiyat sürgüsü ayarı
    $("#price-range").on("input", function() {
        $("#max-price").val($(this).val());
        var minValue = Math.round($(this).val() * 0.1);
        $("#min-price").val(minValue);
    });
    
    // Min-Max fiyat girişlerini düzenle
    $("#min-price").on("input", function() {
        var minVal = parseInt($(this).val()) || 0;
        var maxVal = parseInt($("#max-price").val()) || 10000;
        
        if (minVal > maxVal) {
            $(this).val(maxVal);
        }
    });
    
    $("#max-price").on("input", function() {
        var minVal = parseInt($("#min-price").val()) || 0;
        var maxVal = parseInt($(this).val()) || 10000;
        
        if (maxVal < minVal) {
            $(this).val(minVal);
        }
        
        $("#price-range").val(maxVal);
    });
}); 