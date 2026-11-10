document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const yearEl = document.getElementById('year');
  const materialGrid = document.getElementById('materials-grid');
  const portfolioGrid = document.getElementById('portfolio-grid');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('open')));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  const projects = [
    {
      title: 'Bespoke Modular Kitchen',
      category: 'kitchen',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      description: 'Warm wood tones, smart storage, and a minimal aesthetic designed for everyday family living.'
    },
    {
      title: 'Luxury Wardrobe Design',
      category: 'wardrobe',
      location: 'Andheri',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      description: 'Custom wardrobe planning with integrated lighting, soft-close fittings, and sleek modular detailing.'
    },
    {
      title: 'Marble Flooring Refresh',
      category: 'flooring',
      location: 'Powai',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      description: 'Stone-inspired flooring and finishing that brings warmth, brightness, and a premium feel to the home.'
    },
    {
      title: 'Office Renovation',
      category: 'commercial',
      location: 'Bandra',
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
      description: 'A functional office transformation with refined textures, efficient zoning, and a cleaner brand presence.'
    },
    {
      title: 'Premium Bathroom Upgrade',
      category: 'renovation',
      location: 'Dadar',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
      description: 'Contemporary tiling, built-in storage, and cleaner lines for a more relaxed daily experience.'
    },
    {
      title: 'Living Room Styling',
      category: 'interiors',
      location: 'Lower Parel',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      description: 'A balanced palette and wood detailing to create a calmer and more welcoming family environment.'
    }
  ];

  function renderPortfolio(filter = 'all') {
    if (!portfolioGrid) return;

    const filteredProjects = filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter);

    portfolioGrid.innerHTML = filteredProjects.map((project) => `
      <article class="portfolio-card">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="portfolio-card__body">
          <span class="portfolio-tag">${project.category}</span>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="portfolio-meta">
            <span>${project.location}</span>
            <a href="#contact">Enquire</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((el) => el.classList.remove('active'));
      button.classList.add('active');
      renderPortfolio(button.dataset.filter);
    });
  });

  renderPortfolio();

  function renderMaterials(filter = 'all', searchTerm = '') {
    if (!materialGrid) return;

    const visibleMaterials = materials.filter((material) => {
      const matchesCategory = filter === 'all' || material.category === filter;
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    materialGrid.innerHTML = visibleMaterials.map((material) => `
      <article class="material-card">
        <img src="${material.image}" alt="${material.name}" loading="lazy" />
        <div class="material-card__body">
          <p class="material-category">${material.category}</p>
          <h3>${material.name}</h3>
          <p>${material.description}</p>
          <ul>
            ${material.specs.map((spec) => `<li>${spec}</li>`).join('')}
          </ul>
          <button type="button" class="button button-secondary">Enquire About This Material</button>
        </div>
      </article>
    `).join('');
  }

  const materialFilterButtons = document.querySelectorAll('[data-material-filter]');
  const materialSearch = document.getElementById('material-search');
  let activeMaterialFilter = 'all';

  materialFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      materialFilterButtons.forEach((el) => el.classList.remove('active'));
      button.classList.add('active');
      activeMaterialFilter = button.dataset.materialFilter;
      renderMaterials(activeMaterialFilter, materialSearch ? materialSearch.value.trim() : '');
    });
  });

  if (materialSearch) {
    materialSearch.addEventListener('input', (event) => {
      renderMaterials(activeMaterialFilter, event.target.value);
    });
  }

  renderMaterials();

  const forms = document.querySelectorAll('form[data-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Thank you. We will contact you shortly.';
      }
      form.reset();
    });
  });
});
