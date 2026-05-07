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
                Nous utilisons des cookies de mesure d'audience pour ameliorer le site.
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
        // Boucler si on dépasse
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;

        // Retirer la classe active de tous les slides et dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Ajouter la classe active au slide et dot actuel
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) currentSlide = 0;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        showSlide(currentSlide);
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

    // Initialiser
    showSlide(0);
    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeHamburgerMenu();
    initializeCookieConsent();
    initializeHeroCarousel();
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
