// Get DOM elements
const navbar = document.getElementById('navbar');
const sidebarMenu = document.getElementById('sidebarMenu');
const menuButton = document.getElementById('menuButton');
const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');

// Track scroll position and direction
let lastScrollTop = 0;
let scrollTimeout;
let isScrollingDown = false;

// Function to handle scroll events
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Determine scroll direction 
    isScrollingDown = scrollTop > lastScrollTop;

    // When scrolled down past 100px
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');

        if (isScrollingDown && scrollTop > 150) {
            navbar.classList.add('hidden');

            if (window.innerWidth <= 992) {
                menuButton.style.display = 'flex';
                setTimeout(() => menuButton.classList.add('visible'), 10);
            }
        } else {
            navbar.classList.remove('hidden');

            if (window.innerWidth <= 992) {
                menuButton.classList.remove('visible');
                setTimeout(() => {
                    if (!menuButton.classList.contains('visible')) {
                        menuButton.style.display = 'none';
                    }
                }, 300);
            }
        }
    } else {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('hidden');
        menuButton.classList.remove('visible');
        menuButton.style.display = 'none';
    }

    // Close sidebar if open and user scrolls down
    if (sidebarMenu.classList.contains('active') && scrollTop > lastScrollTop && scrollTop > 400) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }

    lastScrollTop = scrollTop;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (isScrollingDown && scrollTop > 400 && !sidebarMenu.classList.contains('active') && window.innerWidth <= 992) {
            menuButton.style.display = 'flex';
            menuButton.classList.add('visible');
        }
    }, 150);
}

// ── SCROLL ANIMATIONS (IntersectionObserver) ──────────────────────────────

// Observe .content-section — fades up, reverses on scroll up
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.content-section').forEach(section => {
    sectionObserver.observe(section);
});

// Observe each .program-card individually — staggered by sibling index
const cardObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.program-card').forEach((card, index) => {
    // Stagger each card by its position among siblings
    const siblings = Array.from(card.parentElement.children);
    const siblingIndex = siblings.indexOf(card);
    card.style.transitionDelay = `${siblingIndex * 0.12}s`;
    cardObserver.observe(card);
});

// Observe .card-item (carousel cards)
const carouselCardObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll('.card-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    carouselCardObserver.observe(item);
});

// Observe .section-title — slides up with a slight delay
const titleObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    },
    { threshold: 0.5, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.section-title').forEach(title => {
    titleObserver.observe(title);
});

// ── SIDEBAR & MENU ────────────────────────────────────────────────────────

menuButton.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpening = !sidebarMenu.classList.contains('active');
    sidebarMenu.classList.toggle('active');
    menuButton.classList.toggle('active');
    if (isOpening) {
        menuButton.style.display = 'flex';
        menuButton.classList.add('visible');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    });
});

document.addEventListener('click', function (event) {
    const isClickInsideSidebar = sidebarMenu.contains(event.target);
    const isClickOnMenuButton = menuButton.contains(event.target);
    if (!isClickInsideSidebar && !isClickOnMenuButton && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

menuButton.addEventListener('mouseenter', function () {
    if (!this.classList.contains('active')) this.style.transform = 'scale(1.1)';
});
menuButton.addEventListener('mouseleave', function () {
    if (!this.classList.contains('active')) this.style.transform = 'scale(1)';
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }
});

// Always start at the top on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

window.addEventListener('load', handleScroll);
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', function () {
    if (window.innerWidth > 992) {
        menuButton.style.display = 'none';
        menuButton.classList.remove('visible');
    }
});

// ── CARD CAROUSEL ─────────────────────────────────────────────────────────

function initializeCardCarousel() {
    const carousel = document.getElementById('cardCarousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!carousel) return;

    let currentPosition = 0;
    let isAnimating = false;
    let autoScrollInterval;

    function getCardWidth() {
        const card = carousel.querySelector('.card-item');
        if (!card) return 330;
        return card.offsetWidth + (parseInt(getComputedStyle(carousel).gap) || 30);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const cardCount = carousel.children.length;
        const visibleCards = Math.floor(carousel.parentElement.offsetWidth / getCardWidth());

        for (let i = 0; i < Math.max(1, cardCount - visibleCards + 1); i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => goToSlide(i));
        }
    }

    function updateCarousel(instant = false) {
        if (isAnimating) return;
        isAnimating = true;

        const cardWidth = getCardWidth();
        const maxPosition = (carousel.children.length - 1) * cardWidth;

        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;

        carousel.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${currentPosition}px)`;

        const dotIndex = Math.round(currentPosition / cardWidth);
        document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));

        prevBtn.disabled = currentPosition <= 0;
        nextBtn.disabled = currentPosition >= maxPosition;

        setTimeout(() => { isAnimating = false; }, instant ? 0 : 500);
    }

    function nextSlide() { currentPosition += getCardWidth(); updateCarousel(); }
    function prevSlide() { currentPosition -= getCardWidth(); updateCarousel(); }
    function goToSlide(index) { currentPosition = index * getCardWidth(); updateCarousel(); }

    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            const maxPosition = (carousel.children.length - 1) * getCardWidth();
            if (currentPosition >= maxPosition) {
                currentPosition = 0;
                updateCarousel(true);
                setTimeout(updateCarousel, 50);
            } else {
                nextSlide();
            }
        }, 4000);
    }

    function stopAutoScroll() { clearInterval(autoScrollInterval); }

    nextBtn.addEventListener('click', () => { stopAutoScroll(); nextSlide(); startAutoScroll(); });
    prevBtn.addEventListener('click', () => { stopAutoScroll(); prevSlide(); startAutoScroll(); });

    carousel.parentElement.addEventListener('mouseenter', stopAutoScroll);
    carousel.parentElement.addEventListener('mouseleave', startAutoScroll);

    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; stopAutoScroll(); });
    carousel.addEventListener('touchmove', (e) => { if (isDragging) e.preventDefault(); });
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        isDragging = false;
        startAutoScroll();
    });

    createDots();
    updateCarousel(true);
    startAutoScroll();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => { createDots(); updateCarousel(true); }, 250);
    });
}

document.addEventListener('DOMContentLoaded', initializeCardCarousel);

// ── LOADING SCREEN ────────────────────────────────────────────────────────

(function () {
    const screen = document.getElementById('loading-screen');
    setTimeout(function () {
        screen.classList.add('fade-out');
        screen.addEventListener('transitionend', function () { screen.remove(); }, { once: true });
    }, 3500);
})();