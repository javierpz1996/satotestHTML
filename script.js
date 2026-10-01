// reloj
const clock = document.getElementById("clock");

function tick() {
  clock.textContent = new Date().toLocaleTimeString("es-AR", {
    hour: "numeric",
    minute: "2-digit",
  });
}

tick();
setInterval(tick, 15000);

// carrusel
document.querySelectorAll("[data-carousel]").forEach((root) => {
  if (root.hasAttribute("hidden")) return;

  const slides = Array.from(root.querySelectorAll(".carousel__slide"));
  const dots = Array.from(root.querySelectorAll(".carousel__dot"));
  const prev = root.querySelector(".carousel__nav--prev");
  const next = root.querySelector(".carousel__nav--next");
  if (slides.length < 2) return;

  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  dots.forEach((dot, i) => dot.addEventListener("click", () => go(i, true)));

  function render() {
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", String(!on));
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  function go(i, manual) {
    index = (i + slides.length) % slides.length;
    render();
    if (manual) restart();
  }

  prev.addEventListener("click", () => go(index - 1, true));
  next.addEventListener("click", () => go(index + 1, true));

  // teclado
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(index - 1, true);
    if (e.key === "ArrowRight") go(index + 1, true);
  });

  // swipe
  let startX = null;
  root.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  root.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), true);
  });

  // autoplay
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;

  function restart() {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(() => go(index + 1), 4500);
  }

  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("focusin", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);

  render();
  restart();
});

// pestañas
const tabs = document.querySelectorAll(".tab");
const pages = {
  todo: document.getElementById("page-todo"),
  nsfw: document.getElementById("page-nsfw"),
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });

    Object.entries(pages).forEach(([key, page]) => {
      page.classList.toggle("is-visible", key === tab.dataset.panel);
    });
  });
});
