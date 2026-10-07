// Pick a random starting photo, then choose a different one every eight seconds.
const photos = ['photos/portrait-1.jpg', 'photos/portrait-2.jpg', 'photos/portrait-3.jpeg', 'photos/portrait-4.jpeg' , 'photos/portrait-5.jpeg', 'photos/portrait-6.jpeg'];
const layers = [...document.querySelectorAll('.background-photo')];
const toggle = document.querySelector('.slideshow-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = Math.floor(Math.random() * photos.length);
let activeLayer = 0;
let paused = reducedMotion.matches;
let changing = false;
layers[0].src = photos[current];
toggle.hidden = false;

function updateToggle() {
  toggle.textContent = paused ? 'Play background' : 'Pause background';
  toggle.setAttribute('aria-pressed', String(paused));
}
async function changePhoto() {
  if (paused || document.hidden || changing) return;
  changing = true;
  const next = (current + 1 + Math.floor(Math.random() * (photos.length - 1))) % photos.length;
  const incoming = layers[1 - activeLayer];
  incoming.src = photos[next];
  try {
    await incoming.decode();
    if (paused || document.hidden) return;
    incoming.classList.add('is-visible');
    layers[activeLayer].classList.remove('is-visible');
    activeLayer = 1 - activeLayer;
    current = next;
  } catch {
    // Keep the visible photo if the next image cannot be loaded.
  } finally {
    changing = false;
  }
}
toggle.addEventListener('click', () => { paused = !paused; updateToggle(); });
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateToggle(); });
updateToggle();
setInterval(changePhoto, 8000);
