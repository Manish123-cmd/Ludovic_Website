/* ======================================================
   GSAP + LENIS ENGINE — Ludovic Monsorez Portfolio v3
   ====================================================== */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1. LENIS SMOOTH SCROLL
var lenis = new Lenis({
  duration: 1.4,
  easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothTouch: false
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. PRELOADER
window.addEventListener('load', function () {
  gsap.to('#preloader', {
    opacity: 0, scale: 1.04, duration: .45, delay: .2, ease: 'power2.in',
    onComplete: function () { var p = document.getElementById('preloader'); if (p) p.style.display = 'none'; }
  });
});

// 3. SCROLL PROGRESS BAR
gsap.to('#scrollBar', {
  width: '100%', ease: 'none',
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: .3 }
});

// 4. DARK MODE
var isDark = localStorage.getItem('darkMode') === 'true';
if (isDark) document.body.classList.add('dark-mode');
var dtb = document.getElementById('darkToggle');
if (dtb) {
  dtb.textContent = isDark ? '☀️' : '🍫';
  dtb.onclick = function () {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    dtb.textContent = isDark ? '☀️' : '🍫';
    gsap.fromTo(dtb, { scale: .6, rotation: -180 }, { scale: 1, rotation: 0, duration: .5, ease: 'back.out(2)' });
  };
}

// 5. WHISK CURSOR — follows mouse on desktop, touch on mobile
var whisk = document.getElementById('whisk-cursor');

document.addEventListener('mousemove', function (e) {
  document.body.classList.add('has-mouse');
  gsap.to(whisk, { left: e.clientX, top: e.clientY, duration: 0.08, ease: 'none', overwrite: true });
});

document.addEventListener('touchstart', function (e) {
  var t = e.touches[0];
  gsap.set(whisk, { left: t.clientX, top: t.clientY });
  gsap.to(whisk, { opacity: 1, scale: 1, duration: 0.18, ease: 'back.out(2)' });
}, { passive: true });

document.addEventListener('touchmove', function (e) {
  var t = e.touches[0];
  gsap.to(whisk, { left: t.clientX, top: t.clientY, duration: 0.08, ease: 'none', overwrite: true });
}, { passive: true });

document.addEventListener('touchend', function () {
  gsap.to(whisk, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power2.out' });
}, { passive: true });

document.querySelectorAll('a, button, .gallery-slot').forEach(function (el) {
  el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); gsap.to(whisk, { scale: 1.3, duration: 0.25, ease: 'back.out(2)' }); });
  el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); gsap.to(whisk, { scale: 1, duration: 0.25, ease: 'back.out(2)' }); });
});


// 7. FLOUR PARTICLES
(function () {
  var cv = document.getElementById('flourCanvas');
  if (!cv) {
    cv = document.createElement('canvas'); cv.id = 'flourCanvas';
    cv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;';
    document.body.appendChild(cv);
  }
  var ctx = cv.getContext('2d'), W, H, parts = [];
  function sz() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  sz(); window.addEventListener('resize', sz);
  document.addEventListener('mousemove', function (e) {
    for (var i = 0; i < 2 && parts.length < 50; i++)
      parts.push({
        x: e.clientX + (Math.random() - .5) * 18, y: e.clientY + (Math.random() - .5) * 18,
        r: Math.random() * 3 + 1, dx: (Math.random() - .5) * 1.3, dy: -(Math.random() * 1.6 + .4),
        a: .65 + Math.random() * .3, dec: .011 + Math.random() * .013, c: Math.random() > .5 ? '#f0d49a' : '#e8aa68'
      });
  });
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.x += p.dx; p.y += p.dy; p.a -= p.dec; p.r *= .99;
      if (p.a <= 0) { parts.splice(i, 1); continue; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c; ctx.globalAlpha = p.a; ctx.fill();
    }
    ctx.globalAlpha = 1; requestAnimationFrame(loop);
  })();
})();

// 8. HERO INITIAL STATE
(function () {
  gsap.set(['.hero-eyebrow', '.hero-title', '.hero-sub', '.hero-ctas', '.chef-circle'], { opacity: 0 });
  gsap.set('.pastry-item', { opacity: 0, scale: 0 });
})();

// 9. HERO DEPTH PARALLAX
var speeds = [.35, .28, .32, .40, .55, .50, .70, .60, .65, .75];
document.querySelectorAll('.pastry-item').forEach(function (el, i) {
  gsap.to(el, {
    y: function () { return window.innerHeight * speeds[i]; }, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true }
  });
});
gsap.to('#hero-mesh', {
  y: function () { return window.innerHeight * .35; }, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1, invalidateOnRefresh: true }
});
gsap.to('.hero-stage', {
  y: function () { return -window.innerHeight * .12; }, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5, invalidateOnRefresh: true }
});

// 10. SECTION REVEALS
gsap.utils.toArray('.section-label').forEach(function (el) {
  gsap.fromTo(el, { opacity: 0, x: -30 }, {
    opacity: 1, x: 0, duration: .7, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 92%', once: true }
  });
});
gsap.utils.toArray('.divider').forEach(function (el) {
  gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, {
    scaleX: 1, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 92%', once: true }
  });
});
gsap.utils.toArray('.section-title').forEach(function (el) {
  gsap.fromTo(el, { opacity: 0, y: 40, skewY: 2 }, {
    opacity: 1, y: 0, skewY: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  });
});
gsap.utils.toArray('.section-body').forEach(function (el) {
  gsap.fromTo(el, { opacity: 0, y: 25 }, {
    opacity: 1, y: 0, duration: .8, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%', once: true }
  });
});

// 11. ABOUT SECTION
gsap.fromTo('.about-img-slot', { opacity: 0, x: -80, rotation: -3 }, {
  opacity: 1, x: 0, rotation: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '#about', start: 'top 80%', once: true }
});
gsap.fromTo('.about-img-slot img', { scale: 1.18, y: -40 }, {
  scale: 1, y: 0, ease: 'none',
  scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.8 }
});
gsap.fromTo('#about .slide-right', { opacity: 0, x: 80 }, {
  opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '#about', start: 'top 80%', once: true }
});

// 12. STAT COUNTERS
document.querySelectorAll('.stat-num').forEach(function (el) {
  var txt = el.textContent.trim(), num = parseInt(txt.replace(/\D/g, '')), suf = txt.replace(/[0-9]/g, '');
  if (!num) return;
  var o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true, onEnter: function () {
      gsap.fromTo(el, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(2)' });
      gsap.to(o, { v: num, duration: 1.8, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v) + suf; } });
    }
  });
});

// 13. TIMELINE
var tlEl = document.getElementById('timeline'), tlLine = document.getElementById('timelineLine');
if (tlEl && tlLine) {
  gsap.to(tlLine, {
    height: function () { return tlEl.scrollHeight; }, ease: 'none',
    scrollTrigger: { trigger: '#story', start: 'top 60%', end: 'bottom 70%', scrub: true, invalidateOnRefresh: true }
  });
  document.querySelectorAll('.timeline-item').forEach(function (item) {
    ScrollTrigger.create({
      trigger: item, start: 'top 85%', once: true,
      onEnter: function () { item.classList.add('visible'); }
    });
  });
}

// 14. HORIZONTAL SCROLL STRIP
(function () {
  var track = document.getElementById('hsTrack'), fill = document.getElementById('hsFill');
  if (!track) return;
  var tw = gsap.to(track, {
    x: function () { return -(track.scrollWidth - window.innerWidth); }, ease: 'none',
    scrollTrigger: {
      trigger: '#hscroll-section', start: 'top top', pin: true, scrub: 1,
      end: function () { return '+=' + (track.scrollWidth - window.innerWidth); },
      anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { if (fill) fill.style.width = (self.progress * 100) + '%'; }
    }
  });
  document.querySelectorAll('.hs-panel').forEach(function (panel) {
    var img = panel.querySelector('.hs-panel-img');
    var h3 = panel.querySelector('h3');
    var p = panel.querySelector('p');
    if (img) gsap.fromTo(img, { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.8)', scrollTrigger: { trigger: panel, containerAnimation: tw, start: 'left 85%', once: true } });
    if (h3) gsap.fromTo(h3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: panel, containerAnimation: tw, start: 'left 80%', once: true } });
    if (p) gsap.fromTo(p, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .5, delay: .1, ease: 'power2.out', scrollTrigger: { trigger: panel, containerAnimation: tw, start: 'left 80%', once: true } });
  });
})();

// 15. GALLERY — REVEAL + 3D TILT
gsap.fromTo('.gallery-slot', { opacity: 0, y: 70, scale: .9 }, {
  opacity: 1, y: 0, scale: 1, duration: .9,
  stagger: { each: .09, from: 'start' }, ease: 'power3.out',
  scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', once: true }
});
document.querySelectorAll('.gallery-slot').forEach(function (card) {
  var img = card.querySelector('img');
  if (img) gsap.fromTo(img, { y: -20 }, { y: 20, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
  card.addEventListener('mousemove', function (e) {
    var r = card.getBoundingClientRect();
    var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    gsap.to(card, { rotateY: dx * 14, rotateX: -dy * 14, scale: 1.04, duration: .3, ease: 'power2.out', transformPerspective: 600, overwrite: 'auto' });
    var sh = card.querySelector('.tilt-shine');
    if (sh) {
      sh.style.background = 'radial-gradient(circle at ' + ((e.clientX - r.left) / r.width * 100).toFixed(1) + '% ' + ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%, rgba(255,255,255,.22) 0%, transparent 55%)';
      gsap.to(sh, { opacity: 1, duration: .2 });
    }
  });
  card.addEventListener('mouseleave', function () {
    gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: .5, ease: 'power3.out' });
    var sh = card.querySelector('.tilt-shine'); if (sh) gsap.to(sh, { opacity: 0, duration: .3 });
  });
});

// 16. PHILOSOPHY
(function () {
  var card = document.getElementById('philCard'), quote = document.getElementById('philQuote');
  if (!card || !quote) return;
  quote.innerHTML = quote.textContent.trim().split(' ').map(function (w) {
    return '<span class="phil-word" style="opacity:0;transform:translateY(16px);display:inline-block;">' + w + '</span>';
  }).join(' ');
  gsap.fromTo(card, { opacity: 0, y: 60, scale: .93, rotationY: -8 }, {
    opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: {
      trigger: card, start: 'top 80%', once: true,
      onEnter: function () {
        card.classList.add('visible');
        gsap.to(card.querySelectorAll('.phil-word'), { opacity: 1, y: 0, duration: .5, stagger: .06, ease: 'power2.out', delay: .3 });
      }
    }
  });
  gsap.to('.phil-tablet', { y: -20, ease: 'none', scrollTrigger: { trigger: '#philosophy', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.phil-phone', { y: 30, ease: 'none', scrollTrigger: { trigger: '#philosophy', start: 'top bottom', end: 'bottom top', scrub: 2 } });
})();

// 17. REVIEWS REVEAL
if (document.querySelectorAll('.review-card').length > 0) {
  gsap.fromTo('.review-card', { opacity: 0, y: 60, scale: .93 }, {
    opacity: 1, y: 0, scale: 1, duration: .8,
    stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.reviews-grid', start: 'top 85%', once: true }
  });
}
if (document.querySelector('.review-form-wrap')) {
  gsap.fromTo('.review-form-wrap', { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.review-form-wrap', start: 'top 88%', once: true }
  });
}

// 18. MAGNETIC BUTTONS
document.querySelectorAll('.btn-primary, .btn-outline, .nav-links li:last-child a').forEach(function (btn) {
  btn.addEventListener('mousemove', function (e) {
    var r = btn.getBoundingClientRect();
    gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3, ease: 'power2.out', overwrite: 'auto' });
  });
  btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }); });
});

// 19. CONFETTI BURST
(function () {
  var cv = document.getElementById('confettiCanvas');
  if (!cv) {
    cv = document.createElement('canvas');
    cv.id = 'confettiCanvas';
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(cv);
  }
  var ctx = cv.getContext('2d'), W, H, pieces = [], run = false;
  var cols = ['#c8853a', '#e8aa68', '#f0d49a', '#a05c1a', '#fff8ee'];
  var em = ['🥐', '🧁', '🍰', '🍫', '🍩'];
  function sz() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  sz(); window.addEventListener('resize', sz);
  function burst(ox, oy) {
    for (var i = 0; i < 70; i++) {
      var a = Math.random() * Math.PI * 2, sp = Math.random() * 10 + 2;
      pieces.push({
        x: ox, y: oy, dx: Math.cos(a) * sp, dy: Math.sin(a) * sp - 5,
        r: Math.random() * 5 + 2, col: cols[~~(Math.random() * cols.length)],
        rot: Math.random() * 360, rs: (Math.random() - .5) * 10, al: 1, gv: .28,
        emoji: Math.random() > .78 ? em[~~(Math.random() * em.length)] : null
      });
    }
    if (!run) { run = true; go(); }
  }
  function go() {
    ctx.clearRect(0, 0, W, H);
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i]; p.x += p.dx; p.y += p.dy; p.dy += p.gv; p.rot += p.rs; p.al -= .016;
      if (p.al <= 0 || p.y > H + 20) { pieces.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = p.al; ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      if (p.emoji) { ctx.font = '18px serif'; ctx.fillText(p.emoji, -9, 9); }
      else { ctx.fillStyle = p.col; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .55); }
      ctx.restore();
    }
    if (pieces.length) requestAnimationFrame(go);
    else { run = false; ctx.clearRect(0, 0, W, H); }
  }
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      burst(e.clientX, e.clientY);
      gsap.fromTo(btn, { scale: .88 }, { scale: 1, duration: .5, ease: 'elastic.out(1.2,.4)' });
    });
  });
  window.burstConfetti = burst;
})();

// 20. NAV ACTIVE LINK
var navAs = document.querySelectorAll('.nav-links a[href^="#"]');
var sects = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function () {
  var sy = window.scrollY + 130, cur = '';
  sects.forEach(function (s) { if (s.offsetTop <= sy) cur = s.id; });
  navAs.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}, { passive: true });

// 21. LENIS NAV CLICKS
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var t = document.querySelector(link.getAttribute('href'));
    if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80, duration: 1.6 }); }
  });
});

// 22. MOBILE NAV — right-side drawer
var nt = document.getElementById('navToggle'), nl = document.querySelector('.nav-links');
if (nt && nl) {
  var navBackdrop = document.createElement('div');
  navBackdrop.className = 'nav-backdrop';
  document.body.appendChild(navBackdrop);

  function openDrawer() {
    nl.classList.add('nav-open');
    nt.classList.add('is-open');
    nt.setAttribute('aria-expanded', 'true');
    navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    /* Force off-screen start position then animate in */
    gsap.set(nl, { x: '100%' });
    gsap.to(nl, { x: '0%', duration: 0.42, ease: 'power3.out' });
    gsap.fromTo(nl.querySelectorAll('li'),
      { opacity: 0, x: 28 },
      { opacity: 1, x: 0, duration: 0.32, stagger: 0.07, ease: 'power2.out', delay: 0.18 }
    );
  }

  function closeDrawer() {
    nt.classList.remove('is-open');
    nt.setAttribute('aria-expanded', 'false');
    navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    gsap.to(nl, {
      x: '100%', duration: 0.34, ease: 'power2.in',
      onComplete: function () {
        nl.classList.remove('nav-open');
        /* Remove inline transform so CSS takes over the hidden state */
        gsap.set(nl, { clearProps: 'transform,x' });
      }
    });
  }

  nt.addEventListener('click', function () {
    nl.classList.contains('nav-open') ? closeDrawer() : openDrawer();
  });
  navBackdrop.addEventListener('click', closeDrawer);
  nl.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { if (nl.classList.contains('nav-open')) closeDrawer(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nl.classList.contains('nav-open')) closeDrawer();
  });
}

// 23. LANGUAGE MODAL
var currentLang = 'en';
gsap.fromTo('.lang-modal', { scale: .7, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: .65, ease: 'back.out(1.8)', delay: .3 });

function chooseLang(lang) {
  currentLang = lang;
  var ov = document.getElementById('lang-modal-overlay');
  gsap.to(ov, {
    opacity: 0, scale: .96, duration: .45, ease: 'power2.in',
    onComplete: function () {
      ov.style.display = 'none';
      var hero = document.getElementById('hero');
      if (hero && !hero.classList.contains('lang-chosen')) {
        hero.classList.add('lang-chosen');
        var dropY = -(Math.max(650, window.innerHeight * 0.88));
        var masterTl = gsap.timeline({ delay: 0.1 });

        masterTl
          /* ① Circle: spinning free-fall → elastic bounce */
          .fromTo('.chef-circle',
            { opacity: 0, y: dropY, scale: 0.12, rotation: -540 },
            { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
          )
          /* ② Smooth 360° victory spin */
          .to('.chef-circle', { rotation: 360, duration: 0.72, ease: 'power2.inOut' }, '+=0.08')
          .set('.chef-circle', { rotation: 0 })
          .addLabel('spin_end')
          /* ③ Shockwave rings */
          .fromTo('.chef-circle',
            { boxShadow: '0 0 0 5px rgba(200,133,58,0.9), 0 0 0 12px rgba(240,212,154,0.65), 0 0 0 18px rgba(200,133,58,0.13), 0 20px 56px rgba(90,48,16,0.20)' },
            {
              boxShadow: '0 0 0 55px rgba(200,133,58,0), 0 0 0 110px rgba(240,212,154,0), 0 0 0 18px rgba(200,133,58,0.13), 0 20px 56px rgba(90,48,16,0.20)',
              duration: 0.9, ease: 'power2.out',
              onComplete: function () { gsap.set('.chef-circle', { clearProps: 'boxShadow' }); }
            },
            'spin_end'
          )
          /* ④ Golden radial flash */
          .call(function () {
            var fl = document.createElement('div');
            fl.className = 'hero-impact-flash';
            document.getElementById('hero').appendChild(fl);
            setTimeout(function () { if (fl.parentNode) fl.parentNode.removeChild(fl); }, 1400);
          }, null, 'spin_end+0.02')
          /* ⑤ Text reveals */
          .fromTo('.hero-eyebrow', { opacity: 0, x: 110, skewX: -12 }, { opacity: 1, x: 0, skewX: 0, duration: 0.72, ease: 'power3.out' }, 'spin_end+0.05')
          .fromTo('.hero-title',   { opacity: 0, x: -110, skewX: 11 }, { opacity: 1, x: 0, skewX: 0, duration: 0.82, ease: 'power3.out' }, 'spin_end+0.18')
          .fromTo('.hero-sub',     { opacity: 0, y: 40 },               { opacity: 1, y: 0, duration: 0.68, ease: 'power2.out' },            'spin_end+0.34')
          .fromTo('.hero-ctas',    { opacity: 0, scale: 0.72, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.68, ease: 'back.out(2.2)' }, 'spin_end+0.50')
          /* ⑥ Pastries burst outward */
          .call(function () {
            var icons  = document.querySelectorAll('.pastry-item');
            var heroEl = document.getElementById('hero');
            var hW = heroEl.offsetWidth, hH = heroEl.offsetHeight;
            var isMob  = window.matchMedia('(max-width: 768px)').matches;

            /* Dynamically compute positions from actual rendered layout */
            var _stageBottomPx   = null;
            var _circleCenterTop = null;
            if (isMob) {
              var _heroTopPx = heroEl.getBoundingClientRect().top;
              var _stEl = heroEl.querySelector('.hero-stage');
              if (_stEl) {
                _stageBottomPx = Math.round(_stEl.getBoundingClientRect().bottom - _heroTopPx) + 24;
              }
              var _circEl = heroEl.querySelector('.chef-circle');
              if (_circEl) {
                var _cb = _circEl.getBoundingClientRect();
                /* Vertical center of circle minus half the icon height (28px = 56px/2) */
                _circleCenterTop = Math.round(_cb.top - _heroTopPx + _cb.height / 2 - 28);
              }
            }

            var finalPos = isMob ? [
              /* top row — corners & mid-top, well clear of nav bar */
              { top: '78px',  left: '5px',   bottom: 'auto', right: 'auto' },
              { top: '82px',  left: '24%',   bottom: 'auto', right: 'auto' },
              { top: '82px',  left: 'auto',  bottom: 'auto', right: '24%'  },
              { top: '78px',  left: 'auto',  bottom: 'auto', right: '5px'  },
              /* middle row — aligned with chef-circle center */
              { top: (_circleCenterTop !== null ? _circleCenterTop + 'px' : '36%'), left: '5px',  bottom: 'auto', right: 'auto' },
              { top: (_circleCenterTop !== null ? _circleCenterTop + 'px' : '36%'), left: 'auto', bottom: 'auto', right: '5px'  },
              /* bottom row — below CTA buttons */
              { top: (_stageBottomPx !== null ? _stageBottomPx + 'px' : 'auto'), left: '5px',  bottom: _stageBottomPx !== null ? 'auto' : '56px', right: 'auto' },
              { top: (_stageBottomPx !== null ? _stageBottomPx + 'px' : 'auto'), left: '24%',  bottom: _stageBottomPx !== null ? 'auto' : '56px', right: 'auto' },
              { top: (_stageBottomPx !== null ? _stageBottomPx + 'px' : 'auto'), left: 'auto', bottom: _stageBottomPx !== null ? 'auto' : '56px', right: '24%'  },
              { top: (_stageBottomPx !== null ? _stageBottomPx + 'px' : 'auto'), left: 'auto', bottom: _stageBottomPx !== null ? 'auto' : '56px', right: '5px'  }
            ] : [
              { top: '18%',  left: '4%',   bottom: 'auto', right: 'auto' },
              { top: '20%',  left: '22%',  bottom: 'auto', right: 'auto' },
              { top: '20%',  left: 'auto', bottom: 'auto', right: '22%'  },
              { top: '18%',  left: 'auto', bottom: 'auto', right: '4%'   },
              { top: '48%',  left: '2%',   bottom: 'auto', right: 'auto' },
              { top: '48%',  left: 'auto', bottom: 'auto', right: '2%'   },
              { top: 'auto', left: '4%',   bottom: '6%',   right: 'auto' },
              { top: 'auto', left: '20%',  bottom: '6%',   right: 'auto' },
              { top: 'auto', left: 'auto', bottom: '6%',   right: '20%'  },
              { top: 'auto', left: 'auto', bottom: '6%',   right: '4%'   }
            ];
            var floatDurs = [3.2, 3.8, 3.5, 4.0, 3.3, 3.7, 3.6, 4.1, 3.4, 3.9];

            icons.forEach(function (el, i) {
              var p = finalPos[i];
              gsap.set(el, {
                position: 'absolute',
                top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                xPercent: 0, yPercent: 0, x: 0, y: 0,
                opacity: 0, scale: 0, rotation: 0, force3D: true
              });
            });

            var heroRect = heroEl.getBoundingClientRect();
            icons.forEach(function (el, i) {
              var rect = el.getBoundingClientRect();
              var elCX = rect.left - heroRect.left + rect.width  / 2;
              var elCY = rect.top  - heroRect.top  + rect.height / 2;
              gsap.set(el, { x: hW / 2 - elCX, y: hH / 2 - elCY });

              var d = i * 0.06;
              var iconTl = gsap.timeline({ delay: d, force3D: true });
              iconTl
                .to(el, { opacity: 1, scale: 1.25, duration: 0.18, ease: 'power2.out' })
                .to(el, { x: 0, y: 0, scale: 1.06, rotation: i % 2 === 0 ? 12 : -12, duration: 0.65, ease: 'power3.out' })
                .to(el, { scale: 1, rotation: 0, duration: 0.32, ease: 'back.out(1.8)' });

              var burstEnd = (d + 0.18 + 0.65 + 0.32) * 1000;
              setTimeout(function (elem, dur, idx) {
                return function () {
                  elem.style.animation = 'pi-float ' + dur + 's ease-in-out ' + (idx * 0.15) + 's infinite alternate';
                };
              }(el, floatDurs[i], i), burstEnd);
            });

            if (window.burstConfetti) window.burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
          }, null, 'spin_end+0.02');
      }
    }
  });
  applyLang(lang);
}
function applyLang(lang) {
  document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
  document.querySelectorAll('[data-en][data-fr]').forEach(function (el) {
    var t = el.getAttribute('data-' + lang); if (t !== null) el.innerHTML = t;
  });
  var pq = document.getElementById('philQuote');
  if (pq) {
    pq.innerHTML = pq.textContent.trim().split(' ').map(function (w) {
      return '<span class="phil-word" style="opacity:0;transform:translateY(16px);display:inline-block;">' + w + '</span>';
    }).join(' ');
    gsap.to(pq.querySelectorAll('.phil-word'), { opacity: 1, y: 0, duration: .5, stagger: .06, ease: 'power2.out' });
  }
}
window.chooseLang = chooseLang;

// 24. STAR PICKER
var sel = 5;
document.querySelectorAll('#starPicker span').forEach(function (s) {
  s.classList.add('lit');
  s.addEventListener('mouseover', function () {
    var v = parseInt(s.getAttribute('data-v'));
    document.querySelectorAll('#starPicker span').forEach(function (x) { x.classList.toggle('lit', parseInt(x.getAttribute('data-v')) <= v); });
  });
  s.addEventListener('mouseleave', function () {
    document.querySelectorAll('#starPicker span').forEach(function (x) { x.classList.toggle('lit', parseInt(x.getAttribute('data-v')) <= sel); });
  });
  s.addEventListener('click', function () {
    sel = parseInt(s.getAttribute('data-v'));
    gsap.fromTo(s, { scale: .6, rotation: -30 }, { scale: 1, rotation: 0, duration: .4, ease: 'back.out(2)' });
  });
});

// 25. REVIEW SYSTEM
function buildReviewCard(r, animate) {
  var stars = ''; for (var i = 0; i < r.stars; i++) stars += '★';
  var ini = r.name.split(' ').map(function (w) { return w[0] || ''; }).join('').toUpperCase().slice(0, 2) || '?';
  var card = document.createElement('div'); card.className = 'review-card';
  card.innerHTML = '<div class="review-stars">' + stars + '</div>'
    + '<p class="review-text">&ldquo;' + r.text + '&rdquo;</p>'
    + '<div class="review-author"><div class="review-avatar">' + ini + '</div>'
    + '<div><p class="review-name">' + r.name + '</p><p class="review-role">' + (r.role || 'Client') + '</p></div></div>';
  document.getElementById('reviewsGrid').appendChild(card);
  document.getElementById('reviewsEmpty').style.display = 'none';
  if (animate) gsap.fromTo(card, { opacity: 0, y: 40, scale: .88 }, { opacity: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.4)' });
  else card.style.opacity = '1';
}
function loadSavedReviews() {
  try {
    var saved = JSON.parse(localStorage.getItem('lm_reviews') || '[]');
    var empty = document.getElementById('reviewsEmpty');
    if (saved.length === 0) { if (empty) empty.style.display = 'block'; }
    else { saved.forEach(function (r) { buildReviewCard(r, false); }); }
  } catch (e) { }
}
function submitReview() {
  var name = document.getElementById('rf-name').value.trim();
  var role = document.getElementById('rf-role').value.trim();
  var text = document.getElementById('rf-text').value.trim();
  if (!name || !text) {
    gsap.fromTo('.review-form-wrap', { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(3,.3)' });
    alert(currentLang === 'fr' ? 'Veuillez renseigner votre nom et votre avis.' : 'Please enter your name and review.');
    return;
  }
  if (sel < 1) {
    alert(currentLang === 'fr' ? 'Veuillez choisir une note.' : 'Please choose a star rating.');
    return;
  }
  var btn = document.querySelector('.rf-submit');
  btn.disabled = true;
  btn.textContent = currentLang === 'fr' ? 'Envoi en cours…' : 'Sending…';
  fetch('https://formspree.io/f/mnjwwopq', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, role: role || '—', rating: sel + ' ★', review: text, _subject: '⭐ New Review from ' + name + ' — Ludovic Monsorez Portfolio' })
  })
    .then(function (res) {
      if (res.ok) {
        var review = { name: name, role: role, text: text, stars: sel, date: new Date().toISOString() };
        buildReviewCard(review, true);
        document.getElementById('reviewForm').style.display = 'none';
        var su = document.getElementById('rfSuccess');
        su.style.display = 'block';
        gsap.fromTo(su, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' });
        var msg = su.querySelector('#rfSuccessMsg');
        if (msg) msg.innerHTML = msg.getAttribute('data-' + currentLang);
        if (window.burstConfetti) window.burstConfetti(window.innerWidth / 2, window.innerHeight * .4);
      } else {
        btn.disabled = false;
        btn.textContent = currentLang === 'fr' ? 'Envoyer l\'avis 🥐' : 'Submit Review 🍰';
        alert(currentLang === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.');
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = currentLang === 'fr' ? 'Envoyer l\'avis 🥐' : 'Submit Review 🍰';
      alert(currentLang === 'fr' ? 'Impossible d\'envoyer. Vérifiez votre connexion.' : 'Could not send. Please check your connection and try again.');
    });
}
window.submitReview = submitReview;
loadSavedReviews();

// 26. FOOTER
gsap.fromTo('footer', { opacity: 0, y: 30 }, {
  opacity: 1, y: 0, duration: 1, ease: 'power2.out',
  scrollTrigger: { trigger: 'footer', start: 'top 95%', once: true }
});

// 27. REFRESH ON RESIZE
window.addEventListener('resize', function () { ScrollTrigger.refresh(); });

// CATEGORY TAB SWITCHING
(function () {
  document.querySelectorAll('.cat-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = this.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.cat-panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.getElementById('cat-' + cat);
      if (!panel) return;
      panel.classList.add('active');
      if (window.loadGalleryPanelImages) window.loadGalleryPanelImages(panel);
      var slots = panel.querySelectorAll('.gallery-slot');
      slots.forEach(function (s, i) {
        s.style.transitionDelay = Math.min(i * 30, 300) + 'ms';
        s.classList.add('visible');
      });
      setTimeout(function () { slots.forEach(function (s) { s.style.transitionDelay = ''; }); }, 700);
    });
  });
  setTimeout(function () {
    var slots = document.querySelectorAll('#cat-bread .gallery-slot');
    slots.forEach(function (s, i) {
      s.style.transitionDelay = Math.min(i * 25, 250) + 'ms';
      s.classList.add('visible');
    });
    setTimeout(function () { slots.forEach(function (s) { s.style.transitionDelay = ''; }); }, 600);
  }, 200);
})();

// GALLERY LAZY LOADER
(function () {
  function loadImg(img) {
    if (!img.dataset.src) return;
    var slot = img.closest('.gallery-slot');
    img.onload  = function () { if (slot) slot.classList.add('img-ready'); };
    img.onerror = function () { if (slot) slot.style.display = 'none'; };
    img.src = img.dataset.src;
    delete img.dataset.src;
  }
  var rootMargin = window.matchMedia('(max-width: 768px)').matches ? '220px 0px' : '420px 0px';
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (!e.isIntersecting) return; loadImg(e.target); io.unobserve(e.target); });
  }, { rootMargin: rootMargin, threshold: 0 });
  function observePanelImages(panel) {
    if (!panel) return;
    panel.querySelectorAll('.gallery-slot img[data-src]').forEach(function (img) { io.observe(img); });
  }
  window.loadGalleryPanelImages = observePanelImages;
  observePanelImages(document.querySelector('.cat-panel.active'));
  var preloadAll = function () { document.querySelectorAll('.cat-panel').forEach(observePanelImages); };
  if (window.requestIdleCallback) requestIdleCallback(preloadAll, { timeout: 2500 });
  else setTimeout(preloadAll, 1800);
})();

// PASTRY ICON CLICK → GALLERY DEEP LINK
function goToGallery(cat, label) {
  var tab = document.querySelector('.cat-tab[data-cat="' + cat + '"]');
  if (tab) tab.click();

  var creations = document.getElementById('creations');

  if (!label) {
    if (lenis) lenis.scrollTo(creations, { duration: 1.4, offset: -80, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else creations.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // Find matching gallery slot by label text
  var panel = document.getElementById('cat-' + cat);
  var matched = null;
  if (panel) {
    panel.querySelectorAll('.g-label').forEach(function (el) {
      if (!matched && el.textContent.trim().toLowerCase().indexOf(label.toLowerCase()) !== -1) {
        matched = el.closest('.gallery-slot');
      }
    });
  }

  // Step 1: scroll to section
  if (lenis) lenis.scrollTo(creations, { duration: 1.0, offset: -80, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
  else creations.scrollIntoView({ behavior: 'smooth' });

  if (!matched) return;

  // Step 2: after section arrives, scroll to the specific slot and spotlight it
  setTimeout(function () {
    if (lenis) lenis.scrollTo(matched, { duration: 1.0, offset: -160 });
    else matched.scrollIntoView({ behavior: 'smooth', block: 'center' });
    matched.classList.add('g-spotlight');
    setTimeout(function () { matched.classList.remove('g-spotlight'); }, 2500);
  }, 1200);
}

document.querySelectorAll('.pastry-item').forEach(function (el) {
  var _tx = 0, _ty = 0;
  function trigger() {
    goToGallery(el.dataset.cat || 'pastries', el.dataset.label || '');
  }
  el.addEventListener('click', trigger);
  el.addEventListener('touchstart', function (e) { _tx = e.touches[0].clientX; _ty = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', function (e) {
    var dx = Math.abs(e.changedTouches[0].clientX - _tx);
    var dy = Math.abs(e.changedTouches[0].clientY - _ty);
    if (dx < 14 && dy < 14) { e.preventDefault(); trigger(); }
  });
  el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
});

// EXIT INTENT
(function () {
  if (sessionStorage.getItem('lm_exit_shown')) return;
  var triggered = false;
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY > 10 || triggered) return;
    triggered = true;
    sessionStorage.setItem('lm_exit_shown', '1');
    var ov = document.getElementById('exit-intent-overlay');
    ov.style.display = 'flex';
    gsap.fromTo('.exit-modal', { scale: 0.78, opacity: 0, y: 32 }, { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.9)' });
  });
  window.exitVote = function (choice) {
    var modal = document.querySelector('.exit-modal');
    if (choice === 'yes') {
      modal.innerHTML = '<span class="exit-deco d1">✨</span><span class="exit-deco d2">🎉</span><div class="exit-icon">🤝</div><h2 class="exit-title">Fantastic — let\'s make it happen!</h2><p class="exit-sub">Drop a message and Ludovic will get back to you swiftly.<br><em>Great things start with a simple hello.</em></p><a class="exit-btn yes" href="contact.html">✉️ Get in touch</a>';
      if (window.burstConfetti) window.burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      modal.innerHTML = '<span class="exit-deco d1">👋</span><span class="exit-deco d2">😊</span><div class="exit-icon">😊</div><h2 class="exit-title">No worries!</h2><p class="exit-sub">Feel free to come back whenever you\'re ready.<br>Ludovic\'s door is <em>always open</em>.</p><button class="exit-btn no" onclick="closeExitIntent()">👋 Take care!</button>';
    }
    gsap.fromTo('.exit-modal', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' });
  };
  window.closeExitIntent = function () {
    gsap.to('.exit-modal', {
      scale: 0.88, opacity: 0, y: 20, duration: 0.32, ease: 'power2.in',
      onComplete: function () {
        var ov = document.getElementById('exit-intent-overlay');
        ov.style.display = 'none';
        gsap.set('.exit-modal', { clearProps: 'all' });
      }
    });
  };
})();
