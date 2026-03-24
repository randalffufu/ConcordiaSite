// Scripts pour l'Association Concordia

const themeToggleButton = document.getElementById('themeToggle');
const rootElement = document.documentElement;
const storageThemeKey = 'concordia-theme';

function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'light' ? ' Clair' : 'Sombre';
        themeToggleButton.setAttribute('aria-label', theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem(storageThemeKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        return;
    }

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(prefersLight ? 'light' : 'dark');
}

initializeTheme();

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem(storageThemeKey, nextTheme);
    });
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
