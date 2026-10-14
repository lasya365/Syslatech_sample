const selector = document.querySelector(
    "#theme-select"
  ) as HTMLSelectElement | null;

  function applyTheme(theme: string) {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        theme
      );
    }
  }

  if (selector) {
    const savedTheme =
      localStorage.getItem("theme") || "auto";

    selector.value = savedTheme;
    applyTheme(savedTheme);

    selector.addEventListener("change", () => {
      const selectedTheme = selector.value;

      localStorage.setItem("theme", selectedTheme);
      applyTheme(selectedTheme);
    });
  }
