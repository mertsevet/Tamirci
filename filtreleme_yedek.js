// listings.html filtreleme kodu yedek - SADECE TASARIM İÇİN
$(document).ready(function(){
    console.log('🎨 Filtreleme sistemi tasarım modu aktif');
    
    // İlan gizleme fonksiyonları devre dışı - sadece tasarım korunacak
    // Bu dosya sadece CSS ve genel sayfa stilini korumak için
    
    // Arama filtresi - DEVRE DIŞI
    $("#searchInput").on("keyup", function() {
        // Arama fonksiyonu devre dışı bırakıldı
        console.log('🔍 Arama işlevi devre dışı');
    });

    // Filtreleme fonksiyonu - DEVRE DIŞI
    function filterListings() {
        console.log('🚫 Filtreleme devre dışı - tasarım korunuyor');
        // Filtreleme işlevleri devre dışı bırakıldı
    }
    
    // Filtre etiketi ekleme - DEVRE DIŞI
    function addFilterTag(text) {
        console.log('🏷️ Filtre etiketi ekleme devre dışı');
        // Etiket ekleme devre dışı
    }
    
    // Filtreleri temizleme - DEVRE DIŞI
    function resetFilters() {
        console.log('🧹 Filtre temizleme devre dışı');
        // Temizleme işlevi devre dışı
    }
    
    // İlan sayısını güncelleme - AKTİF
    function updateListingCount() {
        var totalCount = $(".listing-card").length;
        $(".listings-count span").text(totalCount);
        console.log(`📊 Toplam ilan sayısı: ${totalCount}`);
    }
    
    // Filtrele butonuna tıklama - DEVRE DIŞI
    $("#apply-filter").click(function(){
        console.log('🚫 Filtrele butonu devre dışı');
    });
    
    // Temizle butonuna tıklama - DEVRE DIŞI
    $("#reset-filter").click(function(){
        console.log('🚫 Temizle butonu devre dışı');
    });
    
    // Sıralama değişince - DEVRE DIŞI
    $("#listings-sort").change(function(){
        console.log('🚫 Sıralama devre dışı');
    });
    
    // Tüm ilanları görünür yap
    $(".listing-card").show();
    $(".listing-card").css('display', 'block');
    $(".listing-card").css('visibility', 'visible');
    
    // Sayfa yüklendiğinde ilan sayısını güncelle
    updateListingCount();
    
    // Şehir değişiminde ilçe güncelleme - SADECE UI İÇİN
    $("#city-filter").change(function(){
        var selectedCity = $(this).val();
        var districtSelect = $("#district-filter");
        
        if (selectedCity) {
            districtSelect.prop("disabled", false);
            districtSelect.html('<option value="">Tüm İlçeler</option>');
            
            var districts = getCityDistricts(selectedCity);
            $.each(districts, function(index, district){
                districtSelect.append('<option value="' + district.toLowerCase() + '">' + district + '</option>');
            });
        } else {
            districtSelect.prop("disabled", true);
            districtSelect.html('<option value="">Tüm İlçeler</option>');
        }
    });
    
    // Fiyat aralığı sürgüsü
    $("#price-range").on("input", function(){
        var value = $(this).val();
        $("#max-price").val(value);
        $("#min-price").val(Math.round(value * 0.1));
    });
    
    $("#min-price, #max-price").on("input", function(){
        var minVal = parseInt($("#min-price").val()) || 0;
        var maxVal = parseInt($("#max-price").val()) || 10000;
        
        if (minVal > maxVal) {
            if ($(this).attr("id") === "min-price") {
                $(this).val(maxVal);
            } else {
                $(this).val(minVal);
            }
        }
        
        $("#price-range").val(maxVal);
    });

    function getCityDistricts(city) {
        var cityDistricts = {
            'istanbul': ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
            'ankara': ['Altındağ', 'Çankaya', 'Etimesgut', 'Keçiören', 'Mamak', 'Sincan', 'Yenimahalle', 'Akyurt', 'Beypazarı', 'Çamlıdere', 'Çubuk', 'Elmadağ', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kahramankazan', 'Kızılcahamam', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Şereflikoçhisar'],
            'izmir': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
            'bursa': ['Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
            'antalya': ['Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradi', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik']
        };
        
        return cityDistricts[city] || [];
    }
    
    console.log('✅ Filtreleme sistemi tasarım modu başlatıldı');
}); 