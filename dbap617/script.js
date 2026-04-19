const slides = Array.from(document.querySelectorAll(".slide"));
const slideTitle = document.getElementById("slideTitle");
const progressFill = document.getElementById("progressFill");
const counter = document.getElementById("counter");
const overview = document.getElementById("overview");

let current = 0;

function isPrintMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("print") === "1";
}

function updateSlide(index) {
  if (isPrintMode()) return;

  current = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === current);
  });

  slideTitle.textContent = slides[current].dataset.title || `Slide ${current + 1}`;
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
  counter.textContent = `${current + 1} / ${slides.length}`;

  window.location.hash = `slide-${current + 1}`;
}

function nextSlide() {
  updateSlide(current + 1);
}

function prevSlide() {
  updateSlide(current - 1);
}

function buildOverview() {
  if (!overview) return;

  overview.innerHTML = "";

  slides.forEach((slide, index) => {
    const card = document.createElement("button");
    card.className = "thumb";

    const heading =
      slide.querySelector("h1, h2")?.textContent?.trim() || `Slide ${index + 1}`;

    card.innerHTML = `
      <h4>${index + 1}. ${slide.dataset.title || `Slide ${index + 1}`}</h4>
      <p>${heading}</p>
    `;

    card.addEventListener("click", () => {
      overview.classList.add("hidden");
      updateSlide(index);
    });

    overview.appendChild(card);
  });
}

function toggleOverview() {
  if (isPrintMode()) return;
  overview.classList.toggle("hidden");
}

function toggleFullscreen() {
  if (isPrintMode()) return;

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

document.addEventListener("keydown", (event) => {
  if (isPrintMode()) return;

  if (!overview.classList.contains("hidden")) {
    if (event.key === "Escape" || event.key.toLowerCase() === "p") {
      overview.classList.add("hidden");
    }
    return;
  }

  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
    case " ":
      event.preventDefault();
      nextSlide();
      break;
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      prevSlide();
      break;
    case "Home":
      updateSlide(0);
      break;
    case "End":
      updateSlide(slides.length - 1);
      break;
    case "f":
    case "F":
      toggleFullscreen();
      break;
    case "p":
    case "P":
      toggleOverview();
      break;
    case "Escape":
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
      break;
  }
});

document.addEventListener("click", (event) => {
  if (isPrintMode()) return;
  if (event.target.closest(".thumb")) return;
  if (!overview.classList.contains("hidden")) return;
  nextSlide();
});

overview?.addEventListener("click", (event) => {
  if (event.target === overview) {
    overview.classList.add("hidden");
  }
});

window.addEventListener("load", () => {
  if (isPrintMode()) {
    document.body.classList.add("print-mode");
    slides.forEach((slide) => slide.classList.add("active"));
    slideTitle.textContent = "Print Mode";
    progressFill.style.width = "100%";
    counter.textContent = `${slides.length} slides`;
    return;
  }

  buildOverview();

  const match = window.location.hash.match(/slide-(\d+)/);
  const startIndex = match
    ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1))
    : 0;

  updateSlide(startIndex);
});