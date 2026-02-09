// Get DOM elements
const navbar = document.getElementById('navbar');
const sidebarMenu = document.getElementById('sidebarMenu');
const menuButton = document.getElementById('menuButton');
const navLinks = document.querySelectorAll('.nav-links a, .sidebar-links a');
const contentSections = document.querySelectorAll('.content-section');
const programCards = document.querySelectorAll('.program-card');

// Track scroll position and direction
let lastScrollTop = 0;
let scrollTimeout;
let isScrollingDown = false;

// Function to handle scroll events
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbarHeight = navbar.offsetHeight;
    
    // Determine scroll direction
    isScrollingDown = scrollTop > lastScrollTop;
    
    // When scrolled down past 100px
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
        
        if (isScrollingDown && scrollTop > 150) {
            // Scrolling down - hide navbar completely
            navbar.classList.add('hidden');
            
            // Show menu button when navbar is hidden (mobile)
            if (window.innerWidth <= 992) {
                menuButton.style.display = 'flex';
                setTimeout(() => {
                    menuButton.classList.add('visible');
                }, 10);
            }
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
            
            // Hide menu button when navbar is shown (mobile)
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
        // At the top of the page
        navbar.classList.remove('scrolled');
        navbar.classList.remove('hidden');
        
        // Hide menu button at the top
        menuButton.classList.remove('visible');
        menuButton.style.display = 'none';
    }
    
    // Close sidebar if it's open and user starts scrolling down
    if (sidebarMenu.classList.contains('active') && scrollTop > lastScrollTop && scrollTop > 400) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }
    
    lastScrollTop = scrollTop;
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    
    // Optional: Auto-hide menu button after stopping scroll
    scrollTimeout = setTimeout(() => {
        if (isScrollingDown && scrollTop > 400 && !sidebarMenu.classList.contains('active') && window.innerWidth <= 992) {
            menuButton.style.display = 'flex';
            menuButton.classList.add('visible');
        }
    }, 150);
    
    // Trigger animations for content sections when they come into view
    contentSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollTop > sectionTop - window.innerHeight + 100) {
            section.classList.add('visible');
            
            // Trigger animations for program cards with delay
            if (section.id === 'about' || section.id === 'programs') {
                const cards = section.querySelectorAll('.program-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }
        }
    });
}

// Toggle sidebar menu on menu button click
menuButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event bubbling
    
    const isOpening = !sidebarMenu.classList.contains('active');
    sidebarMenu.classList.toggle('active');
    menuButton.classList.toggle('active');
    
    // If opening sidebar, ensure button is visible
    if (isOpening) {
        menuButton.style.display = 'flex';
        menuButton.classList.add('visible');
    }
});

// Close sidebar when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    });
});

// Close sidebar when clicking outside of it
document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebarMenu.contains(event.target);
    const isClickOnMenuButton = menuButton.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnMenuButton && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Don't prevent default for logo link to homepage
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add hover effect to menu button
menuButton.addEventListener('mouseenter', function() {
    if (!this.classList.contains('active')) {
        this.style.transform = 'scale(1.1)';
    }
});

menuButton.addEventListener('mouseleave', function() {
    if (!this.classList.contains('active')) {
        this.style.transform = 'scale(1)';
    }
});

// Add keyboard support for closing sidebar with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
        menuButton.classList.remove('active');
    }
});

// Initialize everything
window.addEventListener('load', function() {
    // Initialize scroll position
    handleScroll();
});

// Initialize scroll event listener
window.addEventListener('scroll', handleScroll);

// Handle window resize
window.addEventListener('resize', function() {
    // Hide menu button on desktop
    if (window.innerWidth > 992) {
        menuButton.style.display = 'none';
        menuButton.classList.remove('visible');
    }
});