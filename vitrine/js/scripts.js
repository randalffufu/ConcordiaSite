// Scripts pour l'Association Concordia

const cookieConsentStorageKey = 'concordia-cookie-consent';

// ============= HAMBURGER MENU ============= 
function initializeHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu ? navMenu.querySelectorAll('.nav-link') : [];

    if (!hamburgerMenu || !navMenu) return;

    // Toggle menu on hamburger click
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburgerMenu.setAttribute('aria-expanded', 
            hamburgerMenu.classList.contains('active') ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            hamburgerMenu.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.site-header')) {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            hamburgerMenu.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============= HEADER AUTO-MASQUÉ (MOBILE) =============
// Sur téléphone, le header s'escamote quand on descend et revient dès qu'on
// remonte, pour changer de page sans avoir à remonter tout le contenu.
function initializeHeaderAutoHide() {
    const header = document.querySelector('.site-header');
    const navMenu = document.getElementById('navMenu');

    if (!header) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const scrollThreshold = 8; // ignore les micro-défilements qui font clignoter
    let lastScrollY = window.scrollY;
    let ticking = false;

    function update() {
        ticking = false;
        const currentY = window.scrollY;
        const isMenuOpen = navMenu && navMenu.classList.contains('active');

        // Toujours visible sur desktop, en haut de page, ou menu ouvert
        if (!mobileQuery.matches || currentY <= header.offsetHeight || isMenuOpen) {
            header.classList.remove('site-header--hidden');
            lastScrollY = currentY;
            return;
        }

        const delta = currentY - lastScrollY;
        if (Math.abs(delta) < scrollThreshold) return;

        header.classList.toggle('site-header--hidden', delta > 0);
        lastScrollY = currentY;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });

    // Repasser en desktop ne doit jamais laisser le header masqué
    mobileQuery.addEventListener('change', () => {
        header.classList.remove('site-header--hidden');
        lastScrollY = window.scrollY;
    });
}

function getPrivacyPolicyPath() {
    return window.location.pathname.includes('/pages/')
        ? 'politique-confidentialite.html'
        : 'pages/politique-confidentialite.html';
}

function applyMatomoConsent(consent) {
    const paq = window._paq = window._paq || [];

    if (consent === 'accepted') {
        paq.push(['setConsentGiven']);
        paq.push(['rememberConsentGiven']);
        return;
    }

    paq.push(['forgetConsentGiven']);
    paq.push(['disableCookies']);
}

function reopenCookieBanner() {
    localStorage.removeItem(cookieConsentStorageKey);
    hideCookieBanner();
    renderCookieBanner();
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.remove();
    }
}

function renderCookieBanner() {
    if (document.getElementById('cookieBanner')) {
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-banner-content">
            <p class="cookie-banner-text">
                Nous utilisons des cookies de mesure d'audience pour améliorer le site.
                Vous pouvez accepter ou refuser ce suivi.
                Vous pouvez aussi retirer votre consentement à tout moment depuis le pied de page.
                <a href="${getPrivacyPolicyPath()}">En savoir plus</a>
            </p>
            <div class="cookie-banner-actions">
                <button type="button" class="cookie-btn cookie-btn-decline" id="cookieDecline">Refuser</button>
                <button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept">Accepter</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    const acceptButton = document.getElementById('cookieAccept');
    const declineButton = document.getElementById('cookieDecline');

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem(cookieConsentStorageKey, 'accepted');
            applyMatomoConsent('accepted');
            hideCookieBanner();
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem(cookieConsentStorageKey, 'refused');
            applyMatomoConsent('refused');
            hideCookieBanner();
        });
    }
}

function initializeCookieConsent() {
    const savedChoice = localStorage.getItem(cookieConsentStorageKey);

    if (savedChoice === 'accepted' || savedChoice === 'refused') {
        applyMatomoConsent(savedChoice);
        return;
    }

    renderCookieBanner();
}

document.addEventListener('click', (event) => {
    const cookieSettingsButton = event.target.closest('[data-cookie-settings]');
    if (cookieSettingsButton) {
        event.preventDefault();
        reopenCookieBanner();
    }
});

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============= HERO CAROUSEL ============= 
function initializeHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoPlayInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentSlide = index;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Change slide tous les 4 secondes
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Cliquer sur les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetAutoPlay();
        });
    });

    // Pause au survol, reprendre quand on part
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
        if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
    });

    // Initialiser
    showSlide(0);
    startAutoPlay();
}

function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const subject = form.querySelector('[name="subject"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        const body = `Nom : ${name}\nEmail : ${email}\n\n${message}`;
        window.location.href = `mailto:concordia.asso23@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCookieConsent();
    initializeHeroCarousel();
    initializeContactForm();
});

// Animation au chargement de la page
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.card, .event-card');
    cards.forEach((card, index) => {
        card.style.animation = `slideIn 0.5s ease forwards`;
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Ajouter une animation CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
