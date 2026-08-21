/**
 * NICOLAS-HYBRID-PORTFOLIO — Forms Handler
 * Real-time validation, serverless integration (Formspree/EmailJS) & interactive feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const serviceInput = document.getElementById('formService');
  const messageInput = document.getElementById('formMessage');

  // Real-time live validations
  nameInput?.addEventListener('input', () => validateField(nameInput, val => val.trim().length >= 2, 'Por favor ingresa tu nombre (mínimo 2 caracteres).'));
  emailInput?.addEventListener('input', () => validateField(emailInput, isValidEmail, 'Ingresa un correo electrónico válido.'));
  messageInput?.addEventListener('input', () => validateField(messageInput, val => val.trim().length >= 10, 'El mensaje debe tener al menos 10 caracteres.'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, val => val.trim().length >= 2, 'Por favor ingresa tu nombre.');
    const isEmailValid = validateField(emailInput, isValidEmail, 'Ingresa un correo electrónico válido.');
    const isMessageValid = validateField(messageInput, val => val.trim().length >= 10, 'El mensaje debe tener al menos 10 caracteres.');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      if (window.showToast) window.showToast('Por favor corrige los campos indicados.', 'error');
      return;
    }

    // Set Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
      </svg>
      Enviando solicitud...
    `;

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceInput?.value || 'General',
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Configurable endpoint (e.g. Formspree / EmailJS / Webhook)
      const formspreeEndpoint = form.getAttribute('action');

      if (formspreeEndpoint && formspreeEndpoint.startsWith('https://formspree.io/')) {
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al enviar formulario');
      } else {
        // Fallback simulation (500ms delay) for GitHub Pages static preview
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      form.reset();
      clearFeedbacks();
      if (window.showToast) {
        window.showToast('¡Mensaje enviado con éxito! Te responderé en breve.', 'success');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      if (window.showToast) {
        window.showToast('Hubo un inconveniente al enviar el mensaje. Intenta por WhatsApp.', 'error');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function validateField(inputElement, validatorFn, errorMsg) {
    if (!inputElement) return true;
    const value = inputElement.value;
    const feedback = inputElement.parentElement.querySelector('.form-feedback');
    const isValid = validatorFn(value);

    if (!isValid) {
      inputElement.style.borderColor = '#EF4444';
      if (feedback) {
        feedback.textContent = errorMsg;
        feedback.className = 'form-feedback error';
      }
      return false;
    } else {
      inputElement.style.borderColor = 'var(--accent-emerald)';
      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'form-feedback success';
      }
      return true;
    }
  }

  function clearFeedbacks() {
    form.querySelectorAll('.form-feedback').forEach(f => f.textContent = '');
    form.querySelectorAll('.form-input, .form-textarea').forEach(i => i.style.borderColor = '');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
