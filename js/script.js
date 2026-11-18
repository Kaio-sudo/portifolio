const header = document.querySelector("header");

function atualizarNavbar() {
    header?.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", atualizarNavbar, { passive: true });
atualizarNavbar();