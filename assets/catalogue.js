(function () {
  const allMaterials = window.HARI_OM_MATERIALS || [];
  const chapters = window.HARI_OM_CHAPTERS || [];
  const selected = new Set();
  const spread = document.getElementById('book-spread');
  const toc = document.getElementById('book-toc');
  const thumbnails = document.getElementById('book-thumbnails');
  const search = document.getElementById('book-search');
  const indicator = document.getElementById('book-page-indicator');
  const previous = document.getElementById('book-prev');
  const next = document.getElementById('book-next');
  const selectionList = document.getElementById('selection-items');
  const selectionCount = document.getElementById('selection-count');
  const selectionStatus = document.getElementById('selection-status');
  const previewDialog = document.getElementById('image-dialog');
  const previewImage = document.getElementById('image-dialog-img');
  const previewCaption = document.getElementById('image-dialog-caption');

  if (!spread || !toc || !allMaterials.length) return;

  let activeCategory = 'all';
  let currentPage = 0;
  let direction = 'next';
  let pageSize = window.matchMedia('(max-width: 720px)').matches ? 2 : 4;

  function filteredMaterials() {
    const query = (search?.value || '').trim().toLowerCase();
    return allMaterials.filter((material) => {
      const categoryMatches = activeCategory === 'all' || material.category === activeCategory;
      const queryMatches = !query || `${material.name} ${material.categoryName} ${material.description}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }

  function materialCard(material) {
    const isSelected = selected.has(material.id);
    return `
      <article class="sample-card" data-material-id="${material.id}">
        <button class="sample-image-button" type="button" data-zoom="${material.id}" aria-label="Zoom image: ${material.name}">
          <img src="${material.image}" alt="${material.alt}" width="520" height="320" loading="lazy" decoding="async" />
          <span class="sample-zoom-hint">View detail</span>
        </button>
        <div class="sample-card__content">
          <p class="sample-category">${material.categoryName}</p>
          <h3>${material.name}</h3>
          <p>${material.description}</p>
          <p class="sample-disclaimer">Illustrative image · confirm exact material and finish</p>
          <button class="button ${isSelected ? 'button-selected' : 'button-secondary'} sample-select" type="button" data-select="${material.id}" aria-pressed="${isSelected}">
            ${isSelected ? 'Added to enquiry' : 'Add to enquiry'}
          </button>
        </div>
      </article>
    `;
  }

  function pageMarkup(items, pageLabel, side) {
    return `
      <article class="book-page book-page--${side}">
        <div class="book-page__header"><span>HARI OM ENTERPRISES</span><span>${pageLabel}</span></div>
        <div class="book-page__samples">
          ${items.length ? items.map(materialCard).join('') : '<p class="book-empty">No materials match this search.</p>'}
        </div>
        <div class="book-page__footer">Materials for considered spaces</div>
      </article>
    `;
  }

  function renderThumbnails(items) {
    thumbnails.innerHTML = items.slice(0, 10).map((material) => `
      <button class="book-thumb" type="button" data-thumb="${material.id}" aria-label="Go to ${material.name}">
        <img src="${material.image}" alt="" width="56" height="42" loading="lazy" />
        <span>${material.name}</span>
      </button>
    `).join('');
  }

  function render() {
    const products = filteredMaterials();
    const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
    currentPage = Math.min(currentPage, pageCount - 1);
    const first = currentPage * pageSize;
    const items = products.slice(first, first + pageSize);
    const pages = pageSize === 2
      ? [pageMarkup(items, `${first + 1}–${first + items.length}`, 'left')]
      : [
          pageMarkup(items.slice(0, 2), `${first + 1}–${Math.min(first + 2, products.length)}`, 'left'),
          pageMarkup(items.slice(2, 4), `${first + 3}–${Math.min(first + 4, products.length)}`, 'right')
        ];

    spread.classList.remove('turn-forward', 'turn-back');
    spread.classList.add(direction === 'next' ? 'turn-forward' : 'turn-back');
    spread.innerHTML = pages.join('');
    indicator.textContent = products.length
      ? `Page ${currentPage + 1} of ${pageCount} · ${products.length} references`
      : 'No materials found';
    previous.disabled = currentPage === 0;
    next.disabled = currentPage >= pageCount - 1 || !products.length;
    renderThumbnails(items);
    updateSelection();
  }

  function setCategory(category) {
    activeCategory = category;
    currentPage = 0;
    toc.querySelectorAll('[data-category]').forEach((button) => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  function renderToc() {
    toc.innerHTML = `
      <button type="button" class="book-toc__item active" data-category="all" aria-pressed="true">All chapters <span>${allMaterials.length}</span></button>
      ${chapters.map((chapter) => `
        <button type="button" class="book-toc__item" data-category="${chapter.id}" aria-pressed="false">
          ${chapter.title}<span>${allMaterials.filter((item) => item.category === chapter.id).length}</span>
        </button>
      `).join('')}
    `;
  }

  function updateSelection() {
    const items = allMaterials.filter((material) => selected.has(material.id));
    selectionCount.textContent = String(items.length);
    selectionList.innerHTML = items.length
      ? items.map((material) => `
          <li><span><strong>${material.name}</strong><small>${material.categoryName}</small></span><button type="button" data-remove="${material.id}" aria-label="Remove ${material.name}">Remove</button></li>
        `).join('')
      : '<li>No materials selected yet.</li>';
    spread.querySelectorAll('[data-select]').forEach((button) => {
      const isSelected = selected.has(button.dataset.select);
      button.classList.toggle('button-selected', isSelected);
      button.classList.toggle('button-secondary', !isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
      button.textContent = isSelected ? 'Added to enquiry' : 'Add to enquiry';
    });
  }

  function openPreview(material) {
    if (!previewDialog || !previewImage || !previewDialog.showModal) return;
    previewImage.src = material.image;
    previewImage.alt = material.alt;
    previewCaption.textContent = `${material.name} · illustrative reference image`;
    previewDialog.showModal();
  }

  function setPageForMaterial(materialId) {
    const products = filteredMaterials();
    const index = products.findIndex((material) => material.id === materialId);
    if (index < 0) {
      const material = allMaterials.find((item) => item.id === materialId);
      if (!material) return;
      activeCategory = material.category;
      if (search) search.value = '';
      setCategory(material.category);
      setPageForMaterial(materialId);
      return;
    }
    currentPage = Math.floor(index / pageSize);
    direction = index >= currentPage * pageSize ? 'next' : 'back';
    render();
    document.getElementById('material-booklet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.HariOmCatalogue = Object.freeze({
    openMaterial: setPageForMaterial,
    addMaterial(materialId) {
      if (!allMaterials.some((material) => material.id === materialId)) return false;
      selected.add(materialId);
      updateSelection();
      return true;
    }
  });

  toc.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (button) setCategory(button.dataset.category);
  });

  search?.addEventListener('input', () => {
    currentPage = 0;
    render();
  });

  previous?.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      direction = 'back';
      render();
    }
  });

  next?.addEventListener('click', () => {
    const pageCount = Math.ceil(filteredMaterials().length / pageSize);
    if (currentPage < pageCount - 1) {
      currentPage += 1;
      direction = 'next';
      render();
    }
  });

  spread.addEventListener('click', (event) => {
    const selectButton = event.target.closest('[data-select]');
    if (selectButton) {
      const id = selectButton.dataset.select;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      updateSelection();
      return;
    }

    const zoomButton = event.target.closest('[data-zoom]');
    if (zoomButton) {
      const material = allMaterials.find((item) => item.id === zoomButton.dataset.zoom);
      if (material) openPreview(material);
    }
  });

  thumbnails.addEventListener('click', (event) => {
    const button = event.target.closest('[data-thumb]');
    if (button) setPageForMaterial(button.dataset.thumb);
  });

  selectionList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (button) {
      selected.delete(button.dataset.remove);
      updateSelection();
    }
  });

  document.getElementById('selection-clear')?.addEventListener('click', () => {
    selected.clear();
    selectionStatus.textContent = '';
    updateSelection();
  });

  document.getElementById('selection-whatsapp')?.addEventListener('click', () => {
    const items = allMaterials.filter((material) => selected.has(material.id));
    if (!items.length) {
      selectionStatus.textContent = 'Add at least one material before starting an enquiry.';
      return;
    }
    const list = items.map((material, index) => `${index + 1}. ${material.name} (${material.categoryName})`).join('\n');
    const message = `Hello Hari Om Enterprises,\n\nI would like to enquire about these material references:\n\n${list}\n\nPlease share further details and confirm available samples.`;
    window.HariOmWhatsApp.open(message, selectionStatus);
  });

  document.getElementById('selection-print')?.addEventListener('click', () => {
    if (!selected.size) {
      selectionStatus.textContent = 'Select one or more materials before printing your list.';
      return;
    }
    document.body.classList.add('print-material-selection');
    window.print();
    window.setTimeout(() => document.body.classList.remove('print-material-selection'), 500);
  });

  document.getElementById('book-print')?.addEventListener('click', () => window.print());

  document.getElementById('book-fullscreen')?.addEventListener('click', async () => {
    const shell = document.getElementById('material-booklet-view');
    if (!shell) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch (error) {
      const status = document.getElementById('selection-status');
      if (status) status.textContent = `Fullscreen is unavailable in this browser: ${error.message}`;
    }
  });

  document.querySelector('.image-dialog__close')?.addEventListener('click', () => previewDialog?.close());
  previewDialog?.addEventListener('click', (event) => {
    if (event.target === previewDialog) previewDialog.close();
  });

  window.matchMedia('(max-width: 720px)').addEventListener('change', (event) => {
    const firstMaterial = filteredMaterials()[currentPage * pageSize];
    pageSize = event.matches ? 2 : 4;
    if (firstMaterial) {
      const index = filteredMaterials().findIndex((material) => material.id === firstMaterial.id);
      currentPage = Math.floor(index / pageSize);
    }
    render();
  });

  renderToc();
  render();
})();
