// Déterminer le chemin relatif vers le dossier racine
function getBasePath() {
  // Si on est dans pages/, le chemin est ../
  // Sinon, le chemin est ./
  const currentPath = window.location.pathname;
  return currentPath.includes('/pages/') ? '../' : './';
}

// Corriger les chemins des liens après l'injection
function fixLinkPaths(basePath) {
  const navLinks = document.querySelectorAll('.nav-link[href^="/"]');
  navLinks.forEach(link => {
    let href = link.getAttribute('href');
    // Remplacer / au début par le basePath approprié
    if (href === '/') {
      // Lien vers l'accueil
      link.setAttribute('href', basePath === './' ? './index.html' : '../index.html');
    } else {
      // Autres chemins (ex: /pages/evenements.html)
      href = href.substring(1); // Retirer le / initial
      link.setAttribute('href', basePath + href);
    }
  });
  
  // Corriger le logo-link
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.setAttribute('href', basePath === './' ? './index.html' : '../index.html');
  }

  // Corriger la source de l'image du logo selon la page courante
  const logoImage = document.querySelector('.logo-mark');
  if (logoImage) {
    logoImage.setAttribute('src', `${basePath}images/concordia%20logo%20carr%C3%A9-03.png`);
  }
}

// Charger et injecter les composants
async function loadComponents() {
  const basePath = getBasePath();
  
  try {
    // Charger le header
    const headerResponse = await fetch(`${basePath}components/header.html`);
    const headerHTML = await headerResponse.text();
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = headerHTML;
      fixLinkPaths(basePath);
      initializeThemeToggle();
      highlightCurrentPage();
    }
  } catch (error) {
    console.error('Erreur lors du chargement du header:', error);
  }
  
  try {
    // Charger le footer
    const footerResponse = await fetch(`${basePath}components/footer.html`);
    const footerHTML = await footerResponse.text();
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = footerHTML;
      fixLinkPaths(basePath);
    }
  } catch (error) {
    console.error('Erreur lors du chargement du footer:', error);
  }
}

// Gérer le toggle du thème
function initializeThemeToggle() {
  const themeToggleButton = document.getElementById('themeToggle');
  const rootElement = document.documentElement;
  const storageThemeKey = 'concordia-theme';

  if (!themeToggleButton) return;

  function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    themeToggleButton.textContent = '';
    themeToggleButton.setAttribute('aria-label', theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(storageThemeKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      return;
    }

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(prefersLight ? 'light' : 'dark');
  }

  initTheme();

  themeToggleButton.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(storageThemeKey, nextTheme);
  });
}

// Mettre en évidence la page actuelle dans la navigation
function highlightCurrentPage() {
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Déterminer si ce lien correspond à la page actuelle
    let isActive = false;
    if ((href === './index.html' || href === '../index.html') && (currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
      isActive = true;
    } else if (!href.includes('index.html') && currentPath.includes(href.split('/').pop())) {
      isActive = true;
    }
    
    if (isActive) {
      link.classList.add('active');
    }
  });
}

// Charger les composants au chargement du DOM
document.addEventListener('DOMContentLoaded', loadComponents);
