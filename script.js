const body = document.body;
const gate = document.getElementById('gate');
const enterBtn = document.getElementById('enterBtn');
const transition = document.getElementById('transition');
const videoLayer = document.getElementById('videoLayer');
const bgVideo = document.getElementById('bgVideo');
const videoSource = document.getElementById('videoSource');
const themeAudio = document.getElementById('themeAudio');
const site = document.getElementById('site');
const siteHeader = document.getElementById('siteHeader');
const soundBtn = document.getElementById('soundBtn');
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');

let entered = false;
let muted = false;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadTransitionImages(){
  document.querySelectorAll('.ribbon img[data-src]').forEach(img => {
    if (!img.src) {
      img.src = img.dataset.src;
      img.decoding = 'async';
    }
  });
}

function loadSoundtrack(){
  if (!themeAudio.src) themeAudio.src = themeAudio.dataset.src;
  themeAudio.volume = 0.76;
  themeAudio.play().catch(() => {});
}

function loadBackgroundVideo(){
  if (!videoSource.src) {
    videoSource.src = videoSource.dataset.src;
    bgVideo.load();
  }
  bgVideo.play().catch(() => {});
}

async function enterSite(){
  if (entered) return;
  entered = true;
  enterBtn.disabled = true;

  loadSoundtrack();
  loadTransitionImages();
  loadBackgroundVideo();

  transition.classList.add('is-active');
  transition.setAttribute('aria-hidden','false');
  gate.classList.add('is-leaving');

  await sleep(2100);
  transition.classList.add('is-opening');
  videoLayer.classList.add('is-visible');
  videoLayer.setAttribute('aria-hidden','false');

  await sleep(850);
  transition.classList.remove('is-active','is-opening');
  transition.setAttribute('aria-hidden','true');
  site.classList.add('is-visible');
  site.setAttribute('aria-hidden','false');
  siteHeader.classList.add('is-visible');
  siteHeader.setAttribute('aria-hidden','false');
  body.classList.remove('locked');
  document.querySelector('.hero .reveal')?.classList.add('is-revealed');
}

enterBtn.addEventListener('click', enterSite, { once:true });

soundBtn.addEventListener('click', () => {
  muted = !muted;
  themeAudio.muted = muted;
  soundBtn.classList.toggle('is-muted', muted);
  soundBtn.querySelector('.sound-label').textContent = muted ? 'MUTED' : 'SOUND';
  if (!muted && themeAudio.paused) themeAudio.play().catch(() => {});
});

function closeDrawer(){
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden','true');
  menuBtn.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded','false');
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
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin:'0px 0px -8% 0px', threshold:0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.addEventListener('visibilitychange', () => {
  if (!entered) return;
  if (document.hidden) {
    bgVideo.pause();
    themeAudio.pause();
  } else {
    bgVideo.play().catch(() => {});
    if (!muted) themeAudio.play().catch(() => {});
  }
});
