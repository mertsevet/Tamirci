// Enhanced Cursor Fix - Sürekli çalışan siyah cursor
(function() {
    console.log('Enhanced black cursor fix loading...');
    
    // CSS injection - En güçlü yöntem
    const styleElement = document.createElement('style');
    styleElement.id = 'black-cursor-force';
    styleElement.innerHTML = `
        /* Güçlü cursor override */
        input[type="text"], 
        input[type="email"], 
        input[type="password"], 
        input[type="tel"], 
        input[type="number"], 
        input[type="search"],
        input[type="url"],
        textarea, 
        .form-control, 
        .input-with-icon input {
            cursor: text !important;
            caret-color: #000000 !important;
        }
        
        /* Hover durumları */
        input[type="text"]:hover, 
        input[type="email"]:hover, 
        input[type="password"]:hover, 
        input[type="tel"]:hover, 
        input[type="number"]:hover, 
        input[type="search"]:hover,
        input[type="url"]:hover,
        textarea:hover, 
        .form-control:hover, 
        .input-with-icon input:hover {
            cursor: text !important;
            caret-color: #000000 !important;
        }
        
                 /* Focus durumları */
        input[type="text"]:focus, 
        input[type="email"]:focus, 
        input[type="password"]:focus, 
        input[type="tel"]:focus, 
        input[type="number"]:focus, 
        input[type="search"]:focus,
        input[type="url"]:focus,
        textarea:focus, 
        .form-control:focus, 
        .input-with-icon input:focus {
            cursor: text !important;
            caret-color: #000000 !important;
        }
        
        /* Butonlar için pointer cursor */
        button,
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        .btn,
        .button,
        a[href],
        [onclick],
        [role="button"] {
            cursor: pointer !important;
        }
        
        /* Buton hover durumları */
        button:hover,
        input[type="button"]:hover,
        input[type="submit"]:hover,
        input[type="reset"]:hover,
        .btn:hover,
        .button:hover,
        a[href]:hover,
        [onclick]:hover,
        [role="button"]:hover {
            cursor: pointer !important;
        }
    `;
    
    // Style'ı head'e ekle
    function injectStyle() {
        if (!document.getElementById('black-cursor-force')) {
            document.head.appendChild(styleElement);
        }
    }
    
    // Input elementlerine direkt style uygula
    function forceInputStyles() {
        // Text input'lar için
        const inputSelectors = [
            'input[type="text"]',
            'input[type="email"]', 
            'input[type="password"]',
            'input[type="tel"]',
            'input[type="number"]',
            'input[type="search"]',
            'input[type="url"]',
            'textarea',
            '.form-control',
            '.input-with-icon input'
        ];
        
        inputSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.setProperty('cursor', 'text', 'important');
                element.style.setProperty('caret-color', '#000000', 'important');
            });
        });
        
        // Butonlar için pointer cursor
        const buttonSelectors = [
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            'input[type="reset"]',
            '.btn',
            '.button',
            'a[href]',
            '[onclick]',
            '[role="button"]'
        ];
        
        buttonSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.setProperty('cursor', 'pointer', 'important');
            });
        });
    }
    
    // Sürekli çalışacak fonksiyon
    function continuouslyApplyFix() {
        injectStyle();
        forceInputStyles();
    }
    
    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', continuouslyApplyFix);
    } else {
        continuouslyApplyFix();
    }
    
    // Her 50ms'de bir çalıştır (sürekli override)
    setInterval(continuouslyApplyFix, 50);
    
    // Mouse events için
    document.addEventListener('mouseover', function(e) {
        if (e.target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], input[type="search"], input[type="url"], textarea')) {
            e.target.style.setProperty('cursor', 'text', 'important');
            e.target.style.setProperty('caret-color', '#000000', 'important');
        }
        // Butonlar için pointer cursor
        else if (e.target.matches('button, input[type="button"], input[type="submit"], input[type="reset"], .btn, .button, a[href], [onclick], [role="button"]')) {
            e.target.style.setProperty('cursor', 'pointer', 'important');
        }
    });
    
    // Focus events için
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], input[type="search"], input[type="url"], textarea')) {
            e.target.style.setProperty('cursor', 'text', 'important');
            e.target.style.setProperty('caret-color', '#000000', 'important');
        }
    });
    
    // Mutation Observer - Dinamik içerik için
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setTimeout(continuouslyApplyFix, 10);
            }
        });
    });
    
    // Observer'ı başlat
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    console.log('Enhanced black cursor fix loaded successfully');
})(); 