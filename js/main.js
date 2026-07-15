/* ============================================================
   main.js — Webify
   ============================================================ */

/* ---- Promo banner ---- */
/* Set to true when you have an active promotion, false to hide it */
const PROMO_ACTIVE = false;

(function () {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;
    if (PROMO_ACTIVE && !sessionStorage.getItem('promoDismissed')) {
        banner.removeAttribute('hidden');
    }
    document.getElementById('promoClose')?.addEventListener('click', () => {
        banner.setAttribute('hidden', '');
        sessionStorage.setItem('promoDismissed', '1');
    });
})();

/* ---- Tech stack marquee auto-fill ---- */
window.addEventListener('load', () => {
    document.querySelectorAll('.stack-marquee').forEach(marquee => {
        const needed = window.innerWidth * 2.5;
        while (marquee.scrollWidth < needed) {
            [...marquee.children].forEach(child => {
                marquee.appendChild(child.cloneNode(true));
            });
        }
    });
});

/* ---- Sticky header shadow ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header && header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');
const io_nav = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
            });
        }
    });
}, { threshold: 0.35 });
sections.forEach(s => io_nav.observe(s));

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const spans     = navToggle ? navToggle.querySelectorAll('span') : [];

function openNav() {
    navMenu.classList.add('open');
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
}
function closeNav() {
    navMenu.classList.remove('open');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
}
if (navToggle) {
    navToggle.addEventListener('click', () =>
        navMenu.classList.contains('open') ? closeNav() : openNav()
    );
}
if (navMenu) {
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
}

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 168;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ---- Scroll reveal ---- */
const io_reveal = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right')
        .forEach(el => io_reveal.observe(el));

/* ---- Animated counters ---- */
function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const t0       = performance.now();
    function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        el.textContent = v;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    }
    requestAnimationFrame(tick);
}
const io_count = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); io_count.unobserve(e.target); }
    });
}, { threshold: 0.6 });
document.querySelectorAll('.count').forEach(el => io_count.observe(el));

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
    });
});

/* ---- Contact form (Resend) ---- */
const contactForm = document.getElementById('contactForm');
const formOk      = document.getElementById('formOk');
if (contactForm && formOk) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btnTxt = contactForm.querySelector('.btn-txt');
        if (btnTxt) btnTxt.textContent = 'Sending…';
        try {
            const data = Object.fromEntries(new FormData(contactForm));
            const res = await fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                if (btnTxt) btnTxt.textContent = 'Send Message';
                formOk.style.display = 'block';
                contactForm.reset();
                setTimeout(() => { formOk.style.display = 'none'; }, 6000);
            } else {
                if (btnTxt) btnTxt.textContent = 'Try Again';
            }
        } catch {
            if (btnTxt) btnTxt.textContent = 'Try Again';
        }
    });
}

/* ---- Newsletter form ---- */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn   = newsletterForm.querySelector('button');
        if (btn) btn.innerHTML = '✓';
        setTimeout(() => {
            if (btn) btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
            newsletterForm.reset();
        }, 2500);
    });
}

/* ---- Copyright year ---- */
const yearEl = document.getElementById('copyrightYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Client logo lightbox ---- */
(function () {
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightboxImg');
    const lbClose   = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    if (!lightbox) return;

    function openLightbox(src, alt) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    document.querySelectorAll('.client-logo[data-logo]').forEach(el => {
        el.addEventListener('click', () => openLightbox(el.dataset.logo, el.dataset.alt));
    });
    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();
