(function () {
  const config = window.HARI_OM_CONFIG;

  function configuredNumber() {
    return (config.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  }

  function createUrl(message) {
    const number = configuredNumber();
    if (!/^\d{8,15}$/.test(number)) return '';
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function showSetupMessage(status) {
    if (status) {
      status.textContent = 'WhatsApp is not configured yet. Add the verified business number in assets/config.js before using this action.';
      status.hidden = false;
    }
  }

  function open(message, status) {
    const url = createUrl(message);
    if (!url) {
      showSetupMessage(status);
      return false;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (status) status.textContent = 'WhatsApp opened with your enquiry. Review the message and send it there.';
    return true;
  }

  function bindLinks() {
    document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
      const message = link.dataset.whatsappMessage || 'Hello Hari Om Enterprises, I would like to enquire about your services.';
      const url = createUrl(message);
      link.href = url || '#contact';
      link.setAttribute('aria-disabled', String(!url));
      link.classList.toggle('is-unconfigured', !url);

      link.addEventListener('click', (event) => {
        const currentUrl = createUrl(link.dataset.whatsappMessage || message);
        if (!currentUrl) {
          event.preventDefault();
          const status = link.closest('section, article, .contact-card, .hero')?.querySelector('.form-status');
          showSetupMessage(status);
          if (!status) {
            const notice = document.getElementById('whatsapp-setup-notice');
            if (notice) notice.hidden = false;
          }
          return;
        }
        if (link.tagName === 'A') {
          link.href = currentUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        } else {
          event.preventDefault();
          open(link.dataset.whatsappMessage || message, link.closest('aside')?.querySelector('.form-status'));
        }
      });
    });
  }

  function updateContactDetails() {
    const phone = (config.BUSINESS_PHONE || '').trim();
    const email = (config.EMAIL_ADDRESS || '').trim();
    document.querySelectorAll('[data-business-phone]').forEach((element) => {
      if (phone) {
        element.textContent = phone;
        element.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
      } else {
        element.textContent = 'Business phone not configured';
        element.href = '#contact';
      }
    });
    document.querySelectorAll('[data-business-email]').forEach((element) => {
      if (email) {
        element.textContent = email;
        element.href = `mailto:${email}`;
      } else {
        element.textContent = 'Business email not configured';
        element.href = '#contact';
      }
    });
  }

  window.HariOmWhatsApp = Object.freeze({ createUrl, open, showSetupMessage, configured: () => Boolean(createUrl('test')) });
  document.addEventListener('DOMContentLoaded', () => {
    bindLinks();
    updateContactDetails();
  });
})();
