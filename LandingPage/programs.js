// ============================================================
// LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('fade-out');
    }, 500);
});

// ============================================================
// MOBILE MENU
// ============================================================
const menuButton = document.getElementById('menuButton');
const sidebarMenu = document.getElementById('sidebarMenu');

menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('active');
    sidebarMenu.classList.toggle('active');
});

// Close sidebar when clicking a link
document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuButton.classList.remove('active');
        sidebarMenu.classList.remove('active');
    });
});

// ============================================================
// PROGRAM FILTER & SEARCH
// ============================================================
const programsGrid = document.getElementById('programsGrid');
const filterChips = document.querySelectorAll('.filter-chip');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const programCount = document.getElementById('programCount');

let activeFilter = 'all';

// Filter function
function filterPrograms() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const cards = programsGrid.querySelectorAll('.program-card-modern');
    let visibleCount = 0;

    cards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;
        
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        const matchesSearch = name.includes(searchTerm) || 
                             card.querySelector('h3').textContent.toLowerCase().includes(searchTerm) ||
                             card.querySelector('p').textContent.toLowerCase().includes(searchTerm);

        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results
    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }

    // Update count
    programCount.textContent = visibleCount;

    // Re-trigger animation for visible cards
    cards.forEach(card => {
        if (card.style.display !== 'none') {
            card.classList.remove('visible');
            setTimeout(() => card.classList.add('visible'), 50);
        }
    });
}

// Filter chip click
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.filter;
        filterPrograms();
    });
});

// Search input
searchInput.addEventListener('input', filterPrograms);

// ============================================================
// STICKY FILTER BAR
// ============================================================
const filterBar = document.getElementById('filterBar');
const heroHeight = document.querySelector('.programs-hero').offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > heroHeight - 70) {
        filterBar.style.top = '0';
    } else {
        filterBar.style.top = '70px';
    }
});

// ============================================================
// SCROLL ANIMATION FOR CARDS
// ============================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.program-card-modern').forEach(card => {
    observer.observe(card);
});

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll down/up
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    lastScroll = currentScroll;
});