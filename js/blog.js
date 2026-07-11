/* ============================================================
   blog.js — renders the Latest Articles cards from BLOG_POSTS
   so adding an article means adding one object here, not a
   full copy-pasted card block in index.html.
   ============================================================ */

const BLOG_POSTS = [
    {
        image: 'img/services/web.webp',
        category: 'Web Development',
        date: 'June 15, 2025',
        readTime: '5 min read',
        title: 'Why Your Business Needs a Performance-First Website in 2025',
        url: 'https://web.dev/learn/performance/'
    },
    {
        image: 'img/services/seo.webp',
        category: 'SEO',
        date: 'May 28, 2025',
        readTime: '4 min read',
        title: 'The Complete Guide to Technical SEO for App Development',
        url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'
    },
    {
        image: 'img/services/ui.webp',
        category: 'UI/UX Design',
        date: 'May 10, 2025',
        readTime: '6 min read',
        title: 'Easy and Most Powerful Design Principles for Modern Platforms',
        url: 'https://www.nngroup.com/articles/ten-usability-heuristics/'
    }
];

(function () {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = BLOG_POSTS.map((post, i) => `
        <div class="blog-card reveal-up"${i ? ` style="--delay:${i * .1}s"` : ''}>
            <div class="blog-img">
                <img src="${post.image}" alt="${post.title}">
                <span class="blog-cat">${post.category}</span>
            </div>
            <div class="blog-body">
                <div class="blog-meta"><span>${post.date}</span><span>${post.readTime}</span></div>
                <h3>${post.title}</h3>
                <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="read-more">Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
        </div>
    `).join('');
})();
