// Scripts pour l'Association Concordia

const cookieConsentStorageKey = 'concordia-cookie-consent';

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

document.addEventListener('DOMContentLoaded', () => {
    initializeCookieConsent();
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
