
window.toggleMenu = function () {
    const nav = document.getElementById("main-nav");
    const button = document.querySelector(".menu-toggle");

    if (!nav || !button) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
};
