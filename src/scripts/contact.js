
const form = document.querySelector("#contact-form");

if (form instanceof HTMLFormElement) {
  const nameInput = document.querySelector("#contact-name");
  const countryCode = document.querySelector("#country-code");
  const phoneInput = document.querySelector("#contact-phone");
  const emailInput = document.querySelector("#contact-email");
  const messageInput = document.querySelector("#contact-message");

  const nameError = document.querySelector("#name-error");
  const phoneError = document.querySelector("#phone-error");
  const emailError = document.querySelector("#email-error");
  const messageCount = document.querySelector("#message-count");

  const successMessage = document.querySelector("#contact-success");
  const failureMessage = document.querySelector("#contact-failure");

  const setError = (input, errorElement, message) => {
    input.setAttribute("aria-invalid", String(Boolean(message)));
    errorElement.textContent = message;
  };

  const clearMessages = () => {
    successMessage.hidden = true;
    failureMessage.hidden = true;
    failureMessage.textContent = "";
  };

  const validateName = () => {
    const value = nameInput.value.trim();

    // Accept letters, spaces, apostrophes, and hyphens.
    // Reject numbers and names made only of special characters.
    const validName =
      /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(value);

    let error = "";

    if (!value) {
      error = "Please enter your name.";
    } else if (value.length < 2 || value.length > 60) {
      error = "Name must be between 2 and 60 characters.";
    } else if (!validName) {
      error = "Enter a valid name using letters only.";
    }

    setError(nameInput, nameError, error);
    return !error;
  };

  const validatePhone = () => {
    const value = phoneInput.value.trim();
    const digitsOnly = /^\d+$/.test(value);

    let error = "";

    if (!value) {
      error = "Please enter your mobile number.";
    } else if (!digitsOnly) {
      error = "Use digits only, without spaces or symbols.";
    } else if (value.length < 7 || value.length > 15) {
      error = "Enter a number containing 7 to 15 digits.";
    }

    setError(phoneInput, phoneError, error);
    return !error;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();
    let error = "";

    if (!value) {
      error = "Please enter your email address.";
    } else if (
      value.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Please enter a valid email address.";
    }

    setError(emailInput, emailError, error);
    return !error;
  };

  nameInput.addEventListener("input", () => {
    validateName();
    clearMessages();
  });

  phoneInput.addEventListener("input", () => {
    validatePhone();
    clearMessages();
  });

  emailInput.addEventListener("input", () => {
    validateEmail();
    clearMessages();
  });

  countryCode.addEventListener("change", clearMessages);

  messageInput.addEventListener("input", () => {
    messageCount.textContent = String(messageInput.value.length);
    clearMessages();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessages();

    const nameIsValid = validateName();
    const phoneIsValid = validatePhone();
    const emailIsValid = validateEmail();

    if (!nameIsValid || !phoneIsValid || !emailIsValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');

      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
      }

      return;
    }

    /*
     * Front-end demonstration only:
     * This does not send the form to your company.
     * Connect a backend or form service before using it in production.
     */
    successMessage.textContent =
      "Thank you for your interest! Your form is valid. Connect the form to our submission service so our team can receive your message and contact you.";

    successMessage.hidden = false;
    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  });
}
