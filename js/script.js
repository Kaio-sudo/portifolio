const header = document.querySelector("header");

function atualizarNavbar() {
    header?.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", atualizarNavbar, { passive: true });
atualizarNavbar();

const portfolioElementos = document.querySelectorAll(".portfolio-revelar");
const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (portfolioElementos.length > 0 && !prefereMovimentoReduzido && "IntersectionObserver" in window) {
    const portfolioObserver = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("portfolio-revelar-visivel");
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    portfolioElementos.forEach((elemento) => {
        elemento.classList.add("portfolio-revelar-pendente");
        portfolioObserver.observe(elemento);
    });
}