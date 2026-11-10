(function () {
  const projectIdeas = [
    {
      title: 'Kitchen design inspiration',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for practical kitchen planning, storage and warm finishes.'
    },
    {
      title: 'Wardrobe design inspiration',
      category: 'wardrobe',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for clean storage layouts and considered material choices.'
    },
    {
      title: 'Custom woodwork inspiration',
      category: 'carpentry',
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for furniture, cabinetry and detailed wood finishes.'
    },
    {
      title: 'Flooring design inspiration',
      category: 'flooring',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for surface patterns and flooring combinations.'
    },
    {
      title: 'Marble surface inspiration',
      category: 'marble',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for natural-stone tones and veining in an interior.'
    },
    {
      title: 'Commercial interior inspiration',
      category: 'commercial',
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for workplace planning and commercial finishes.'
    },
    {
      title: 'Bathroom renovation inspiration',
      category: 'renovation',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
      description: 'A reference for contemporary bathroom layouts and tile choices.'
    }
  ];

  function renderPortfolio(filter) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    const items = filter === 'all'
      ? projectIdeas
      : projectIdeas.filter((project) => project.category === filter);

    grid.innerHTML = items.map((project) => `
      <article class="portfolio-card">
        <button class="portfolio-image-button" type="button" data-portfolio-image="${project.title}">
          <img src="${project.image}" alt="${project.title} — illustrative stock image, not a Hari Om Enterprises project" width="720" height="480" loading="lazy" decoding="async" />
          <span>View image</span>
        </button>
        <div class="portfolio-card__body">
          <span class="portfolio-tag">${project.category}</span>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="portfolio-meta"><span>Illustrative reference</span><a href="#enquiry" data-service="${project.category}">Enquire</a></div>
        </div>
      </article>
    `).join('');
  }

  function setStatus(element, message) {
    if (element) element.textContent = message;
  }

  function formValues(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function buildEnquiryMessage(title, values) {
    const lines = Object.entries(values)
      .filter(([, value]) => String(value).trim())
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}: ${String(value).trim()}`);
    return `Hello Hari Om Enterprises,\n\n${title}\n\n${lines.join('\n')}\n\nPlease contact me regarding a quotation.`;
  }

  async function sendEnquiry(form, status, title) {
    const values = formValues(form);
    const endpoint = (window.HARI_OM_CONFIG?.ENQUIRY_ENDPOINT || '').trim();

    if (endpoint) {
      setStatus(status, 'Submitting your enquiry securely…');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: title, fields: values })
        });
        if (!response.ok) throw new Error(`Enquiry service returned ${response.status}.`);
        setStatus(status, 'Your enquiry was submitted. Thank you.');
        form.reset();
        return;
      } catch (error) {
        setStatus(status, `${error.message} Your details are still on this page. You can try WhatsApp instead.`);
        status.parentElement.querySelector('.form-fallback')?.remove();
        const fallback = document.createElement('button');
        fallback.className = 'button button-whatsapp form-fallback';
        fallback.type = 'button';
        fallback.textContent = 'Continue to WhatsApp';
        fallback.addEventListener('click', () => {
          window.HariOmWhatsApp.open(buildEnquiryMessage(title, values), status);
        });
        status.after(fallback);
        return;
      }
    }

    window.HariOmWhatsApp.open(buildEnquiryMessage(title, values), status);
  }

  function initMobileNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function initMaterialsPreview() {
    const grid = document.getElementById('materials-grid');
    if (!grid) return;
    const preview = [];
    const seen = new Set();
    window.materials.forEach((material) => {
      if (!seen.has(material.category)) {
        preview.push(material);
        seen.add(material.category);
      }
    });

    const filterButtons = document.querySelectorAll('[data-material-filter]');
    const search = document.getElementById('material-search');
    let activeFilter = 'all';

    function render() {
      const query = (search?.value || '').trim().toLowerCase();
      const visible = preview.filter((material) => {
        const categoryMatch = activeFilter === 'all' || material.category === activeFilter;
        const queryMatch = !query || `${material.name} ${material.categoryName}`.toLowerCase().includes(query);
        return categoryMatch && queryMatch;
      });

      grid.innerHTML = visible.map((material) => `
        <article class="material-card">
          <img src="${material.image}" alt="${material.alt}" width="640" height="420" loading="lazy" decoding="async" />
          <div class="material-card__body">
            <p class="material-category">${material.categoryName}</p>
            <h3>${material.name}</h3>
            <p>${material.description}</p>
            <p class="sample-disclaimer">Illustrative image · confirm exact material and finish</p>
            <button type="button" class="button button-secondary" data-open-material="${material.id}">View in material booklet</button>
          </div>
        </article>
      `).join('') || '<p class="empty-state">No material references match your search.</p>';
    }

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        activeFilter = button.dataset.materialFilter;
        render();
      });
    });
    search?.addEventListener('input', render);
    grid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-open-material]');
      if (button) window.HariOmCatalogue?.openMaterial(button.dataset.openMaterial);
    });
    render();
  }

  function initPortfolio() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const grid = document.getElementById('portfolio-grid');
    const dialog = document.getElementById('image-dialog');
    const dialogImage = document.getElementById('image-dialog-img');
    const dialogCaption = document.getElementById('image-dialog-caption');

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        renderPortfolio(button.dataset.filter);
      });
    });

    grid?.addEventListener('click', (event) => {
      const imageButton = event.target.closest('[data-portfolio-image]');
      if (imageButton && dialog?.showModal) {
        const project = projectIdeas.find((item) => item.title === imageButton.dataset.portfolioImage);
        if (!project) return;
        dialogImage.src = project.image;
        dialogImage.alt = `${project.title} — illustrative stock image`;
        dialogCaption.textContent = `${project.title} · illustrative reference, not a completed Hari Om Enterprises project`;
        dialog.showModal();
      }
    });
    renderPortfolio('all');
  }

  function initServiceLinks() {
    const formService = document.getElementById('contact-service');
    const radioValues = {
      carpentry: 'Carpentry & woodwork',
      kitchen: 'Modular kitchen',
      wardrobe: 'Wardrobes & furniture',
      flooring: 'Marble, granite & tiles',
      marble: 'Marble, granite & tiles',
      renovation: 'Complete renovation',
      commercial: 'Other interior work'
    };

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-service]');
      if (!link) return;
      const service = link.dataset.service;
      if (formService && [...formService.options].some((option) => option.value === service)) {
        formService.value = service;
      }
      const serviceChoice = document.querySelector('#general-enquiry-form input[name="service"]');
      const choice = [...document.querySelectorAll('#general-enquiry-form input[name="service"]')]
        .find((input) => input.value === radioValues[service]);
      if (choice && serviceChoice) choice.checked = true;
    });
  }

  function initMultiStepEnquiry() {
    const form = document.getElementById('general-enquiry-form');
    if (!form) return;
    const steps = [...form.querySelectorAll('.enquiry-step')];
    const back = document.getElementById('enquiry-back');
    const next = document.getElementById('enquiry-next');
    const submit = document.getElementById('enquiry-submit');
    const progress = document.getElementById('enquiry-progress');
    const label = document.getElementById('enquiry-step-label');
    const review = document.getElementById('enquiry-review');
    const status = document.getElementById('enquiry-status');
    const labels = ['Choose a service', 'Property information', 'Project requirements', 'Budget and timeline', 'Your details', 'Review and submit'];
    let current = 0;

    function drawReview() {
      const entries = [...new FormData(form).entries()].filter(([, value]) => String(value).trim());
      review.replaceChildren();
      entries.forEach(([key, value]) => {
        const row = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${key.replace(/([A-Z])/g, ' $1')}: `;
        row.append(strong, document.createTextNode(String(value)));
        review.appendChild(row);
      });
    }

    function showStep(index) {
      current = index;
      steps.forEach((step, stepIndex) => {
        const active = stepIndex === index;
        step.hidden = !active;
        step.classList.toggle('is-active', active);
      });
      label.textContent = `Step ${index + 1} of ${steps.length} · ${labels[index]}`;
      progress.style.width = `${((index + 1) / steps.length) * 100}%`;
      back.hidden = index === 0;
      next.hidden = index === steps.length - 1;
      submit.hidden = index !== steps.length - 1;
      if (index === steps.length - 1) drawReview();
      setStatus(status, '');
    }

    next.addEventListener('click', () => {
      const invalid = [...steps[current].querySelectorAll('input, select, textarea')].find((field) => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      showStep(Math.min(current + 1, steps.length - 1));
    });
    back.addEventListener('click', () => showStep(Math.max(current - 1, 0)));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalid = [...form.querySelectorAll('input, select, textarea')].find((field) => field.required && !field.checkValidity());
      if (invalid) {
        const fieldset = invalid.closest('.enquiry-step');
        showStep(Number(fieldset.dataset.step));
        invalid.reportValidity();
        return;
      }
      sendEnquiry(form, status, 'Project enquiry');
    });
    showStep(0);
  }

  function initStandaloneForms() {
    const largeForm = document.getElementById('large-project-form');
    const contactForm = document.getElementById('contact-form');
    largeForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!largeForm.reportValidity()) return;
      sendEnquiry(largeForm, document.getElementById('large-project-status'), 'Large project enquiry');
    });
    contactForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      sendEnquiry(contactForm, document.getElementById('contact-status'), 'General enquiry');
    });
  }

  function initPhoneValidation() {
    document.querySelectorAll('input[type="tel"]').forEach((input) => {
      input.addEventListener('input', () => {
        const value = input.value.trim();
        const digits = value.replace(/\D/g, '');
        const allowed = /^\+?[\d ()-]+$/.test(value);
        input.setCustomValidity(value && (!allowed || digits.length < 8 || digits.length > 15)
          ? 'Enter a valid phone number with 8 to 15 digits.'
          : '');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
    initMobileNavigation();
    initMaterialsPreview();
    initPortfolio();
    initServiceLinks();
    initMultiStepEnquiry();
    initStandaloneForms();
    initPhoneValidation();
    document.querySelector('.image-dialog__close')?.addEventListener('click', () => document.getElementById('image-dialog')?.close());
    document.getElementById('image-dialog')?.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });
  });
})();
