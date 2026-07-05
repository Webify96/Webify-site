/* ============================================================
   portfolio.js — loads partials/portfolio.html into #portfolio-mount
   ============================================================ */

(function () {
    const mount = document.getElementById('portfolio-mount');
    if (!mount) return;

    fetch('partials/portfolio.html')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load portfolio');
            return res.text();
        })
        .then(html => {
            mount.innerHTML = html;

            // Force all reveal elements visible immediately after inject
            mount.querySelectorAll('.reveal-up,.reveal-left,.reveal-right')
                 .forEach(el => el.classList.add('visible'));
        })
        .catch(err => console.warn('Portfolio load error:', err));
})();
