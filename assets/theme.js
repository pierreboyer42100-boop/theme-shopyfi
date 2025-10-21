(function() {
  const root = document.documentElement;
  const body = document.body;
  const storageKey = 'silverlink-a11y';
  const cookieKey = 'silverlink-cookie-consent';
  const config = window.SILVERLINK_CONFIG || {};

  function setFontSize(delta) {
    const current = parseFloat(getComputedStyle(root).fontSize);
    const newSize = Math.min(Math.max(current + delta, 16), 24);
    root.style.fontSize = `${newSize}px`;
    savePrefs({ fontSize: newSize });
  }

  function toggleClass(cls) {
    body.classList.toggle(cls);
    const prefs = loadPrefs();
    prefs[cls] = body.classList.contains(cls);
    savePrefs(prefs);
  }

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePrefs(prefs) {
    localStorage.setItem(storageKey, JSON.stringify(Object.assign(loadPrefs(), prefs)));
    updateA11yState();
  }

  function applyPrefs() {
    const prefs = loadPrefs();
    if (prefs.fontSize) {
      root.style.fontSize = `${prefs.fontSize}px`;
    }
    ['contrast-high', 'dyslexic'].forEach(cls => {
      if (prefs[cls]) {
        body.classList.add(cls);
      }
    });
    updateA11yState();
  }

  function updateA11yState() {
    const target = document.querySelector('[data-accessibility-state]');
    if (!target) return;
    const parts = [];
    if (body.classList.contains('contrast-high')) parts.push('contraste élevé');
    if (body.classList.contains('dyslexic')) parts.push('mode dyslexie');
    target.textContent = parts.length ? parts.join(', ') : 'standard';
  }

  function initControls() {
    const controls = document.querySelector('[data-accessibility-controls]');
    if (!controls) return;
    const status = controls.querySelector('.a11y-controls__status');
    controls.addEventListener('click', (event) => {
      const action = event.target.getAttribute('data-action');
      if (!action) return;
      switch (action) {
        case 'decrease-font':
          setFontSize(-1);
          break;
        case 'increase-font':
          setFontSize(1);
          break;
        case 'toggle-contrast':
          toggleClass('contrast-high');
          break;
        case 'toggle-dyslexia':
          toggleClass('dyslexic');
          break;
      }
      if (status && config.statusMessage) {
        status.textContent = config.statusMessage;
      }
    });
  }

  function initNav() {
    const toggle = document.querySelector('.site-nav__toggle');
    const menu = document.querySelector('.site-nav__menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      menu.setAttribute('aria-expanded', !expanded);
      menu.classList.toggle('is-open');
    });
  }

  function initFAQ() {
    document.querySelectorAll('[data-faq]').forEach(faq => {
      faq.addEventListener('click', (event) => {
        const button = event.target.closest('.faq__question');
        if (!button) return;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
        const answer = button.parentElement.querySelector('.faq__answer');
        if (answer) {
          answer.hidden = expanded;
        }
      });
    });
  }

  function initCookieBanner() {
    const banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;
    const saved = localStorage.getItem(cookieKey);
    if (saved) return;
    banner.hidden = false;
    const form = banner.querySelector('[data-cookie-form]');
    const acceptAll = banner.querySelector('[data-cookie-accept]');
    const rejectAll = banner.querySelector('[data-cookie-reject]');

    const save = (preferences) => {
      localStorage.setItem(cookieKey, JSON.stringify(preferences));
      banner.hidden = true;
      document.dispatchEvent(new CustomEvent('cookie-consent', { detail: preferences }));
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      save({
        analytics: data.get('analytics') === 'on' || data.get('analytics') === 'true',
        marketing: data.get('marketing') === 'on' || data.get('marketing') === 'true'
      });
    });

    acceptAll.addEventListener('click', () => save({ analytics: true, marketing: true }));
    rejectAll.addEventListener('click', () => save({ analytics: false, marketing: false }));
  }

  function initAccents() {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      const track = carousel.querySelector('[data-carousel-track]');
      const prev = carousel.querySelector('.carousel-prev');
      const next = carousel.querySelector('.carousel-next');
      let index = 0;
      if (!track) return;
      const update = () => {
        const width = track.children[0]?.getBoundingClientRect().width || 0;
        track.style.transform = `translateX(${-index * (width + 24)}px)`;
      };
      prev?.addEventListener('click', () => {
        index = Math.max(index - 1, 0);
        update();
      });
      next?.addEventListener('click', () => {
        index = Math.min(index + 1, track.children.length - 1);
        update();
      });
    });
  }

  function initLazy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));
  }

  function initProductRecommendations() {
    document.querySelectorAll('[data-product-recommendations]').forEach(container => {
      const sectionId = container.dataset.sectionId;
      const configEl = document.querySelector(`[data-product-recommendations-config="${sectionId}"]`);
      if (!configEl) return;
      const data = JSON.parse(configEl.textContent || '{}');
      fetch(`/recommendations/products.json?product_id=${container.dataset.productId}&limit=${data.limit || 4}`)
        .then(res => res.json())
        .then(json => {
          container.innerHTML = json.products.map(product => {
            return `
              <article class="product-card">
                <a class="product-card__image" href="${product.url}">
                  <img src="${product.featured_image}" alt="${product.title}" loading="lazy"/>
                </a>
                <div class="product-card__body">
                  <h3><a href="${product.url}">${product.title}</a></h3>
                  <span class="price">${product.price}</span>
                  <a class="btn btn--secondary" href="${product.url}">Voir</a>
                </div>
              </article>`;
          }).join('');
        });
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && config.sw) {
      navigator.serviceWorker.register(config.sw).catch(() => {
        console.warn('SW registration failed');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyPrefs();
    initControls();
    initNav();
    initFAQ();
    initCookieBanner();
    initAccents();
    initLazy();
    initProductRecommendations();
    registerServiceWorker();
  });
})();
