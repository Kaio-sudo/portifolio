const header = document.querySelector("header");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const themeToggleIcon = document.querySelector("#theme-toggle-icon");
const footerYear = document.querySelector("#footer-year");
const scrollProgress = document.querySelector("#scroll-progress");

if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
}

const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (themeToggle instanceof HTMLButtonElement) {
    let savedTheme = null;

    try {
        savedTheme = window.localStorage.getItem("portfolio-theme");
    } catch (error) {
        console.warn("Não foi possível carregar a preferência de tema salva.", error);
    }

    function atualizarTema(theme, persist = false) {
        const temaAtual = theme === "light" ? "light" : "dark";
        const isLight = temaAtual === "light";

        document.documentElement.dataset.theme = temaAtual;
        themeToggle.setAttribute("aria-pressed", String(isLight));
        themeToggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
        themeToggle.title = isLight ? "Ativar modo escuro" : "Ativar modo claro";

        if (themeToggleLabel) {
            themeToggleLabel.textContent = isLight ? "Modo escuro" : "Modo claro";
        }

        if (themeToggleIcon) {
            themeToggleIcon.textContent = isLight ? "☾" : "☼";
        }

        if (persist) {
            try {
                window.localStorage.setItem("portfolio-theme", temaAtual);
            } catch (error) {
                console.warn("Não foi possível salvar a preferência de tema.", error);
            }
        }
    }

    atualizarTema(savedTheme);
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        atualizarTema(nextTheme, true);
    });
}

function atualizarNavbar() {
    header?.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", atualizarNavbar, { passive: true });
atualizarNavbar();

let scrollFrame = 0;

function atualizarProgressoRolagem() {
    if (scrollFrame) {
        return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
        const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaRolavel > 0 ? Math.min(window.scrollY / alturaRolavel, 1) : 0;

        if (scrollProgress instanceof HTMLElement) {
            scrollProgress.style.transform = `scaleX(${progresso})`;
        }

        scrollFrame = 0;
    });
}

window.addEventListener("scroll", atualizarProgressoRolagem, { passive: true });
window.addEventListener("resize", atualizarProgressoRolagem);
atualizarProgressoRolagem();

const elementosRevelar = document.querySelectorAll(".portfolio-revelar, [data-reveal]");

if (elementosRevelar.length > 0 && !prefereMovimentoReduzido && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("portfolio-revelar-visivel");
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementosRevelar.forEach((elemento) => {
        elemento.classList.add("portfolio-revelar-pendente");
        revealObserver.observe(elemento);
    });
}

const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");

if (contactForm instanceof HTMLFormElement && contactFeedback instanceof HTMLElement) {
    const contactFields = Array.from(
        contactForm.querySelectorAll("input[required], textarea[required]")
    );

    contactFields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.value.trim() && field.checkValidity()) {
                field.removeAttribute("aria-invalid");
            }

            if (contactFeedback.dataset.estado === "erro") {
                const hasInvalidField = contactFields.some(
                    (contactField) => !contactField.value.trim() || !contactField.checkValidity()
                );

                if (!hasInvalidField) {
                    contactFeedback.textContent = "";
                    delete contactFeedback.dataset.estado;
                }
            }
        });
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const invalidFields = contactFields.filter(
            (field) => !field.value.trim() || !field.checkValidity()
        );

        contactFields.forEach((field) => {
            if (invalidFields.includes(field)) {
                field.setAttribute("aria-invalid", "true");
            } else {
                field.removeAttribute("aria-invalid");
            }
        });

        if (invalidFields.length > 0) {
            contactFeedback.dataset.estado = "erro";
            contactFeedback.textContent = "Confira os campos obrigatórios e informe um e-mail válido.";
            invalidFields[0].focus();
            return;
        }

        const dados = new FormData(contactForm);
        const nome = String(dados.get("nome") || "").trim();
        const email = String(dados.get("email") || "").trim();
        const assunto = String(dados.get("assunto") || "").trim();
        const mensagem = String(dados.get("mensagem") || "").trim();
        const corpo = `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\n\n${mensagem}`;
        const mailto = `mailto:kh0658027@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

        contactFeedback.dataset.estado = "info";
        contactFeedback.textContent =
            "O site tentará abrir seu aplicativo de e-mail. Revise e envie a mensagem por lá; o portfólio não consegue confirmar o envio.";
        window.location.href = mailto;
    });
}