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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function enterSite(){
  if (entered) return;
  entered = true;
  enterBtn.disabled = true;

  themeAudio.volume = 0.78;
  try { await themeAudio.play(); } catch (e) { console.warn('Audio play blocked:', e); }
  try { await bgVideo.play(); } catch (e) { console.warn('Video play blocked:', e); }

  gate.classList.add('is-leaving');
  transition.classList.add('is-active');
  transition.setAttribute('aria-hidden','false');

  await sleep(2350);
  videoLayer.classList.add('is-visible');

  await sleep(750);
  transition.classList.remove('is-active');
  transition.setAttribute('aria-hidden','true');
  site.classList.add('is-visible');
  site.setAttribute('aria-hidden','false');
  siteHeader.classList.add('is-visible');
  siteHeader.setAttribute('aria-hidden','false');
  body.classList.remove('locked');
  document.querySelector('.hero .reveal')?.classList.add('is-revealed');
}

enterBtn.addEventListener('click', enterSite);

soundBtn.addEventListener('click', async () => {
  muted = !muted;
  themeAudio.muted = muted;
  soundBtn.classList.toggle('is-muted', muted);
  soundBtn.querySelector('.sound-label').textContent = muted ? 'MUTED' : 'SOUND';
  soundBtn.setAttribute('aria-label', muted ? '音楽を再生する' : '音楽をミュートする');
  if (!muted && themeAudio.paused) {
    try { await themeAudio.play(); } catch (e) {}
  }
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

const revealObserver = new IntersectionObserver((entries) => {
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
