
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

  let draftSaveTimer;
  let draftSubmitted = false;

  const setError = (input, errorElement, message) => {
    input.setAttribute("aria-invalid", String(Boolean(message)));
    errorElement.textContent = message;
  };

  const clearMessages = () => {
    successMessage.hidden = true;
    failureMessage.hidden = true;
    failureMessage.textContent = "";
  };

  // -----------------------------
  // FORM VALIDATION
  // -----------------------------

  const validateName = () => {
    const value = nameInput.value.trim();

    // Accept letters, spaces, apostrophes, and hyphens.
    const validName =
      /^\p{L}[\p{L}\p{M}]*(?:[ '\u2019-][\p{L}][\p{L}\p{M}]*)*$/u.test(value);

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

  // -----------------------------
  // SESSION DRAFT SAVING
  // -----------------------------

  const saveDraft = async () => {
    if (draftSubmitted) return;

    try {
      const response = await fetch("/api/contact-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value,
          countryCode: countryCode.value,
          phone: phoneInput.value,
          email: emailInput.value,
          message: messageInput.value,
        }),
      });

      if (!response.ok) {
        console.error("Unable to save the contact draft.");
      }
    } catch (error) {
      console.error("Unable to save contact draft:", error);
    }
  };

  const scheduleDraftSave = () => {
    if (draftSubmitted) return;

    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(saveDraft, 500);
  };

  // Save the draft whenever the visitor changes a field.
  [
    nameInput,
    countryCode,
    phoneInput,
    emailInput,
    messageInput,
  ].forEach((field) => {
    field.addEventListener("input", scheduleDraftSave);
    field.addEventListener("change", scheduleDraftSave);
  });

  // -----------------------------
  // RESTORE SESSION DRAFT
  // -----------------------------

  const restoreDraft = async () => {
    try {
      const response = await fetch("/api/contact-draft");
      const result = await response.json();

      if (!response.ok || !result.success || !result.draft) {
        return;
      }

      const draft = result.draft;

      nameInput.value = draft.name ?? "";
      countryCode.value =
        draft.countryCode ?? countryCode.value;
      phoneInput.value = draft.phone ?? "";
      emailInput.value = draft.email ?? "";
      messageInput.value = draft.message ?? "";

      // Update the message character counter.
      messageCount.textContent = String(messageInput.value.length);
    } catch (error) {
      console.error("Unable to restore contact draft:", error);
    }
  };

  // -----------------------------
  // CLEAR SESSION DRAFT
  // -----------------------------

  const clearDraft = async () => {
    clearTimeout(draftSaveTimer);

    const response = await fetch("/api/contact-draft", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to clear the saved draft.");
    }
  };

  // -----------------------------
  // EXISTING FIELD BEHAVIOUR
  // -----------------------------

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

  // -----------------------------
  // CONTACT FORM SUBMISSION
  // -----------------------------

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessages();

    const nameIsValid = validateName();
    const phoneIsValid = validatePhone();
    const emailIsValid = validateEmail();

    if (!nameIsValid || !phoneIsValid || !emailIsValid) {
      const firstInvalid = form.querySelector(
        '[aria-invalid="true"]'
      );

      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
      }

      return;
    }

    // Make sure the latest values are saved before submission.
    clearTimeout(draftSaveTimer);
    await saveDraft();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          countryCode: countryCode.value,
          phone: phoneInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your inquiry."
        );
      }

      // The inquiry was saved successfully.
      draftSubmitted = true;

      try {
        await clearDraft();
      } catch (error) {
        // The inquiry is already saved, so don't report
        // the contact submission itself as a failure.
        console.error("Unable to clear contact draft:", error);
      }

      successMessage.textContent =
        "Thank you for your interest! Your inquiry has been saved successfully.";

      successMessage.hidden = false;
      successMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    } catch (error) {
      failureMessage.textContent =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      failureMessage.hidden = false;
    }
  });

  // Restore the saved values when the page loads.
  restoreDraft();
}
