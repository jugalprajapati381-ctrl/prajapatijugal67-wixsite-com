(function () {
  const launcher = document.getElementById('chatbot-launcher');
  const panel = document.getElementById('chatbot-panel');
  const messages = document.getElementById('chatbot-messages');
  const options = document.getElementById('chatbot-options');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  if (!launcher || !panel || !messages || !options || !form || !input) return;

  const quickOptions = window.HARI_OM_QUICK_OPTIONS || [];
  const knowledge = window.HARI_OM_FAQ || [];
  const intakePrompts = [
    { key: 'service', prompt: 'What work are you interested in? For example, a modular kitchen, carpentry, flooring or renovation.' },
    { key: 'location', prompt: 'Which area is the project in?' },
    { key: 'requirements', prompt: 'Briefly describe the work or rooms involved.' },
    { key: 'name', prompt: 'What name should the team use when following up?' },
    { key: 'phone', prompt: 'What mobile number should the team contact? It will only be included in the WhatsApp draft.' }
  ];
  let greeted = false;
  let intakeIndex = -1;
  const intake = {};

  function addMessage(text, sender, link) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message chat-message--${sender}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    if (link) {
      const anchor = document.createElement('a');
      anchor.className = 'chat-message-link';
      anchor.href = link.href;
      anchor.textContent = link.label;
      anchor.addEventListener('click', closeChat);
      messages.appendChild(anchor);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function renderOptions() {
    options.replaceChildren();
    quickOptions.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.label;
      button.addEventListener('click', () => {
        if (option.action === 'whatsapp') {
          addMessage(option.label, 'user');
          const opened = window.HariOmWhatsApp.open('Hello Hari Om Enterprises, I would like to discuss a project.', null);
          addMessage(opened
            ? 'WhatsApp opened with a draft message. Review and send it there.'
            : 'WhatsApp is not configured yet. Add the verified number to assets/config.js to enable this action.', 'assistant');
          return;
        }
        addMessage(option.label, 'user');
        if (option.query.toLowerCase().includes('request a quote')) {
          beginIntake();
        } else {
          answer(option.query);
        }
      });
      options.appendChild(button);
    });
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      addMessage('Hello! Welcome to Hari Om Enterprises. How can we help you transform your space today?', 'assistant');
      renderOptions();
    }
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  function beginIntake() {
    intakeIndex = 0;
    Object.keys(intake).forEach((key) => delete intake[key]);
    addMessage(intakePrompts[intakeIndex].prompt, 'assistant');
    options.replaceChildren();
  }

  function finishIntake() {
    const lines = intakePrompts.map(({ key }) => `${key[0].toUpperCase()}${key.slice(1)}: ${intake[key]}`);
    const message = `Hello Hari Om Enterprises,\n\nI would like to request a project quotation.\n\n${lines.join('\n')}\n\nPlease contact me regarding next steps.`;
    const opened = window.HariOmWhatsApp.open(message, null);
    addMessage(opened
      ? 'Your project details are ready in a WhatsApp draft. Please review and send the message there.'
      : 'Your details are still in this chat, but WhatsApp has not been configured. Add the verified business number in assets/config.js before sending.', 'assistant');
    intakeIndex = -1;
    renderOptions();
  }

  function answer(query) {
    const normalized = query.toLowerCase();
    const match = knowledge.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
    if (match) {
      addMessage(match.answer, 'assistant', match.link ? { href: match.link, label: match.linkLabel } : null);
      return;
    }
    addMessage('I can help with service information, materials, large-project enquiries or quotations. Choose an option below or describe the project in the enquiry form.', 'assistant', { href: '#enquiry', label: 'Open project enquiry' });
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openChat();
    else closeChat();
  });
  document.getElementById('chatbot-close')?.addEventListener('click', closeChat);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(text, 'user');

    if (intakeIndex >= 0) {
      if (text.toLowerCase() === 'cancel') {
        intakeIndex = -1;
        addMessage('No problem. Your draft project details have been cleared from this chat.', 'assistant');
        renderOptions();
        return;
      }
      intake[intakePrompts[intakeIndex].key] = text;
      intakeIndex += 1;
      if (intakeIndex < intakePrompts.length) addMessage(intakePrompts[intakeIndex].prompt, 'assistant');
      else finishIntake();
      return;
    }
    if (/\b(request|need|want|quote|quotation|estimate)\b/i.test(text)) {
      beginIntake();
      return;
    }
    answer(text);
  });
})();
