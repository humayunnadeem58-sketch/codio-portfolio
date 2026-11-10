/**
 * Contact Form Controller
 * Implements accessible validation, delivery integration, and honest email fallback
 */

import { siteConfig } from "./config.js";

export function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit-btn");
  const statusContainer = document.getElementById("form-status-container");

  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      error: document.getElementById("name-error"),
      validate: (val) => val.trim().length >= 2 || "Please enter your name (at least 2 characters)."
    },
    email: {
      input: document.getElementById("contact-email"),
      error: document.getElementById("email-error"),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) return "Please enter your email address.";
        if (!emailRegex.test(val.trim())) return "Please enter a valid email address (e.g., name@example.com).";
        return true;
      }
    },
    subject: {
      input: document.getElementById("contact-subject"),
      error: document.getElementById("subject-error"),
      validate: (val) => val.trim().length >= 3 || "Please enter a subject (at least 3 characters)."
    },
    message: {
      input: document.getElementById("contact-message"),
      error: document.getElementById("message-error"),
      validate: (val) => val.trim().length >= 10 || "Please enter a message (at least 10 characters)."
    }
  };

  // Real-time inline validation on blur / input
  Object.keys(fields).forEach((key) => {
    const { input, error, validate } = fields[key];
    if (!input || !error) return;

    input.addEventListener("blur", () => {
      validateField(input, error, validate);
    });

    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        validateField(input, error, validate);
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous status
    clearStatus(statusContainer);

    // Validate all fields
    let hasError = false;
    let firstInvalidInput = null;

    Object.keys(fields).forEach((key) => {
      const { input, error, validate } = fields[key];
      const isValid = validateField(input, error, validate);
      if (!isValid) {
        hasError = true;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    const formData = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      subject: fields.subject.input.value.trim(),
      message: fields.message.input.value.trim()
    };

    // Check if an external endpoint is configured
    const endpoint = siteConfig.contactEndpoint && siteConfig.contactEndpoint.trim();

    if (endpoint) {
      // Endpoint is configured: attempt async submission
      await handleEndpointSubmission(endpoint, formData, form, submitBtn, statusContainer);
    } else {
      // Endpoint is not configured: honest fallback flow per AGENTS.md requirements
      handleHonestFallback(formData, statusContainer);
    }
  });
}

function validateField(input, errorElement, validateFn) {
  const result = validateFn(input.value);
  if (result === true) {
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
    return true;
  } else {
    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = result;
    errorElement.classList.add("visible");
    return false;
  }
}

async function handleEndpointSubmission(endpoint, formData, form, submitBtn, statusContainer) {
  setSubmitting(true, submitBtn);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      form.reset();
      showStatus(
        statusContainer,
        "success",
        "Thank you! Your message has been sent successfully. I will get back to you shortly."
      );
    } else {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || "The message could not be sent. Please use the fallback email options below.";
      showStatus(statusContainer, "error", message);
      renderFallbackActions(formData, statusContainer);
    }
  } catch (error) {
    showStatus(
      statusContainer,
      "error",
      "Network connection error occurred. Please use the fallback email options below to send directly."
    );
    renderFallbackActions(formData, statusContainer);
  } finally {
    setSubmitting(false, submitBtn);
  }
}

function handleHonestFallback(formData, statusContainer) {
  statusContainer.className = "form-status visible";
  statusContainer.style.backgroundColor = "var(--bg-surface-elevated)";
  statusContainer.style.border = "1px solid var(--border-strong)";
  statusContainer.style.color = "var(--text-primary)";

  const receiver = siteConfig.receiverEmail || "contact@example.com";
  const mailtoBody = encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`);
  const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${formData.subject}`);
  const mailtoUrl = `mailto:${receiver}?subject=${mailtoSubject}&body=${mailtoBody}`;

  statusContainer.innerHTML = `
    <div style="margin-bottom: var(--space-3);">
      <strong style="color: var(--accent-primary); font-size: var(--text-md); display: block; margin-bottom: var(--space-2);">
        Ready to send your message
      </strong>
      <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-3);">
        No external backend form delivery service is currently configured on this site. You can send this message immediately via your email client or copy the formatted message to your clipboard:
      </p>
    </div>
    <div class="fallback-actions">
      <a href="${mailtoUrl}" class="btn btn-primary btn-sm" id="btn-open-email">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Open in Email Client
      </a>
      <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-fallback">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        Copy Message
      </button>
    </div>
    <div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle); font-size: var(--text-xs); color: var(--text-dim);">
      <strong>Site Owner Note:</strong> To enable direct in-browser delivery, set <code>contactEndpoint</code> in <code>js/config.js</code> or configure an endpoint like Formspree. See <code>README.md</code> for instructions.
    </div>
  `;

  // Attach copy handler
  const copyBtn = statusContainer.querySelector("#btn-copy-fallback");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const fullText = `Subject: ${formData.subject}\nFrom: ${formData.name} (${formData.email})\n\n${formData.message}`;
      navigator.clipboard.writeText(fullText).then(() => {
        if (typeof window.showToast === "function") {
          window.showToast("Message copied to clipboard!");
        }
      });
    });
  }

  statusContainer.focus();
}

function renderFallbackActions(formData, container) {
  const receiver = siteConfig.receiverEmail || "contact@example.com";
  const mailtoBody = encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`);
  const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${formData.subject}`);
  const mailtoUrl = `mailto:${receiver}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "fallback-actions";
  actionsDiv.style.marginTop = "var(--space-3)";
  actionsDiv.innerHTML = `
    <a href="${mailtoUrl}" class="btn btn-secondary btn-sm">Open in Email Client</a>
  `;
  container.appendChild(actionsDiv);
}

function setSubmitting(isSubmitting, submitBtn) {
  if (isSubmitting) {
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.dataset.originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Sending...
    `;
  } else {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
    if (submitBtn.dataset.originalText) {
      submitBtn.innerHTML = submitBtn.dataset.originalText;
    }
  }
}

function showStatus(container, type, message) {
  container.className = `form-status visible ${type}`;
  container.textContent = message;
  container.setAttribute("role", type === "error" ? "alert" : "status");
  container.setAttribute("tabindex", "-1");
  container.focus();
}

function clearStatus(container) {
  container.className = "form-status";
  container.textContent = "";
  container.removeAttribute("role");
  container.removeAttribute("style");
}
