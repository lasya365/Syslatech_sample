document
  .querySelectorAll<HTMLElement>(".workflow")
  .forEach((section) => {
    const buttons = Array.from(
      section.querySelectorAll<HTMLButtonElement>(
        ".workflow-button"
      )
    );

    const description =
      section.querySelector<HTMLElement>(
        ".workflow-step-description"
      );

    if (buttons.length === 0) return;

    // Select one workflow stage and update its description.
    function selectStep(index: number) {
      const selectedButton = buttons[index];

      if (!selectedButton) return;

      buttons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;

        button.classList.toggle("active", isActive);

        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      // Update the accessible description.
      if (description) {
        description.textContent =
          selectedButton.dataset.description ?? "";
      }
    }

    // Animate only the icon being interacted with.
    function animateButton(button: HTMLButtonElement) {
      // Prevent the same animation from restarting repeatedly.
      if (button.classList.contains("wave")) return;

      button.classList.add("wave");
    }

    buttons.forEach((button, index) => {
      // Select and animate a stage when the pointer enters it.
      button.addEventListener("pointerenter", (event) => {
        // Avoid hover behavior for touch interactions.
        if (event.pointerType === "touch") return;

        selectStep(index);
        animateButton(button);
      });

      // Support keyboard navigation.
      button.addEventListener("focus", () => {
        selectStep(index);
      });

      // Allow users to select a stage by clicking or tapping.
      button.addEventListener("click", () => {
        selectStep(index);
      });

      // Remove the animation class when the animation finishes.
      button.addEventListener(
        "animationend",
        (event: AnimationEvent) => {
          if (event.animationName === "workflow-wave") {
            button.classList.remove("wave");
          }
        }
      );
    });

    // Show Commit as the initial active stage.
    selectStep(0);
  });