const body = document.body;
const gate = document.getElementById('gate');
const enterBtn = document.getElementById('enterBtn');
const transition = document.getElementById('transition');
const videoLayer = document.getElementById('videoLayer');
const bgVideo = document.getElementById('bgVideo');
const themeAudio = document.getElementById('themeAudio');
const site = document.getElementById('site');
const siteHeader = document.getElementById('siteHeader');
const soundBtn = document.getElementById('soundBtn');
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');

let entered = false;
let muted = false;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const imagePaths = Array.from({ length: 6 }, (_, i) => `assets/dance${i + 1}.webp`);
const laneOrders = {
  a: [0, 3, 1, 5, 2, 4],
  b: [4, 1, 5, 2, 0, 3],
  c: [2, 5, 0, 4, 3, 1]
};

function buildImageTracks(){
  document.querySelectorAll('.image-track').forEach(track => {
    const lane = track.closest('.image-lane');
    const key = lane.classList.contains('image-lane--b') ? 'b' : lane.classList.contains('image-lane--c') ? 'c' : 'a';
    const order = laneOrders[key];
    const sequence = [...order, ...order];
    track.style.top = '0';
    track.innerHTML = sequence.map(index => `<img src="${imagePaths[index]}" alt="" loading="eager" decoding="async">`).join('');
  });
}

buildImageTracks();

async function enterSite(){
  if (entered) return;
  entered = true;
  enterBtn.disabled = true;

  themeAudio.volume = 0.78;
  const audioPlay = themeAudio.play().catch(() => {});
  const videoPlay = bgVideo.play().catch(() => {});

  transition.classList.add('is-active');
  transition.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => gate.classList.add('is-leaving'));
  });

  await sleep(2750);
  transition.classList.add('is-opening');

  await sleep(650);
  videoLayer.classList.add('is-visible');
  videoLayer.setAttribute('aria-hidden', 'false');

  await sleep(850);
  transition.classList.add('is-finished');
  site.classList.add('is-visible');
  site.setAttribute('aria-hidden', 'false');
  siteHeader.classList.add('is-visible');
  siteHeader.setAttribute('aria-hidden', 'false');
  body.classList.remove('locked');
  document.querySelector('.hero .reveal')?.classList.add('is-revealed');

  await sleep(450);
  transition.classList.remove('is-active', 'is-opening');
  transition.setAttribute('aria-hidden', 'true');

  await Promise.allSettled([audioPlay, videoPlay]);
}

enterBtn.addEventListener('click', enterSite);

soundBtn.addEventListener('click', () => {
  muted = !muted;
  themeAudio.muted = muted;
  soundBtn.classList.toggle('is-muted', muted);
  soundBtn.querySelector('.sound-label').textContent = muted ? 'MUTED' : 'SOUND';
  soundBtn.setAttribute('aria-label', muted ? '音楽を再生する' : '音楽をミュートする');
  if (!muted && themeAudio.paused) themeAudio.play().catch(() => {});
});

function closeDrawer(){
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const open = !drawer.classList.contains('is-open');
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  menuBtn.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});

drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-revealed');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.addEventListener('visibilitychange', () => {
  if (!entered) return;
  if (document.hidden) bgVideo.pause();
  else bgVideo.play().catch(() => {});
});
