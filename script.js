const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const canvas = document.getElementById("signalCanvas");
const ctx = canvas?.getContext("2d");
let width = 0;
let height = 0;
let points = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const total = Math.max(70, Math.floor(width / 18));
  points = Array.from({ length: total }, (_, index) => ({
    x: (index / (total - 1)) * width,
    y: height * (0.42 + Math.sin(index * 0.55) * 0.08),
    phase: index * 0.34,
    speed: 0.012 + (index % 7) * 0.001,
  }));
}

function drawSignal(time = 0) {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#242424");
  background.addColorStop(0.42, "#191919");
  background.addColorStop(1, "#090909");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#fffefa";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  const wave = ctx.createLinearGradient(0, 0, width, 0);
  wave.addColorStop(0, "#f9f9f8");
  wave.addColorStop(0.5, "#c9c8c2");
  wave.addColorStop(1, "#77746e");
  ctx.strokeStyle = wave;
  ctx.lineWidth = 3;
  ctx.beginPath();

  points.forEach((point, index) => {
    const y =
      point.y +
      Math.sin(time * point.speed + point.phase) * 42 +
      Math.sin(time * 0.006 + index * 0.16) * 18;

    if (index === 0) {
      ctx.moveTo(point.x, y);
    } else {
      ctx.lineTo(point.x, y);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    if (index % 8 !== 0) return;
    const y = point.y + Math.sin(time * point.speed + point.phase) * 42;
    ctx.beginPath();
    ctx.fillStyle = index % 16 === 0 ? "#f9f9f8" : "#c9c8c2";
    ctx.arc(point.x, y, index % 16 === 0 ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawSignal);
}

resizeCanvas();
drawSignal();
window.addEventListener("resize", resizeCanvas);
