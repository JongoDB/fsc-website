// Navigation functionality
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.querySelector(".menu-toggle");
    const header = document.querySelector("header");
    const isOpening = !navLinks.classList.contains("active");

    if (isOpening) {
        // Position nav below header
        if (header) {
            navLinks.style.top = header.offsetHeight + "px";
        }
        // Save scroll position and lock body
        document.body.dataset.scrollY = window.scrollY;
        document.body.style.top = "-" + window.scrollY + "px";
        navLinks.classList.add("active");
        document.body.classList.add("nav-open");
    } else {
        navLinks.classList.remove("active");
        document.body.classList.remove("nav-open");
        document.body.style.top = "";
        navLinks.style.top = "";
        window.scrollTo(0, parseInt(document.body.dataset.scrollY || "0"));
    }

    // Note: .active class on menuToggle is handled by tooltips.js wrapper
    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", isOpening ? "true" : "false");
    }
}

// Helper to close mobile nav and restore scroll
function closeMobileNav() {
    const nav = document.getElementById("navLinks");
    if (nav && nav.classList.contains("active")) {
        nav.classList.remove("active");
        document.body.classList.remove("nav-open");
        document.body.style.top = "";
        nav.style.top = "";
        window.scrollTo(0, parseInt(document.body.dataset.scrollY || "0"));
        const toggle = document.querySelector(".menu-toggle");
        if (toggle) {
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        }
    }
}

// Close menu when clicking any nav link (all links navigate now)
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 968) {
                closeMobileNav();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function(event) {
        const nav = document.querySelector("nav");
        const navLinksEl = document.getElementById("navLinks");

        if (nav && navLinksEl && navLinksEl.classList.contains("active")) {
            if (!nav.contains(event.target)) {
                closeMobileNav();
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href !== "#" && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});


// Dropdown toggle for mobile only (desktop uses CSS hover with JS delay)
document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll(".dropdown-toggle");
    const dropdownContainers = document.querySelectorAll(".dropdown");

    // Desktop: Add hover delay to prevent menu from closing too quickly
    const HOVER_DELAY = 150; // milliseconds before menu closes

    dropdownContainers.forEach(dropdown => {
        let closeTimeout = null;

        dropdown.addEventListener("mouseenter", function() {
            // Cancel any pending close
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            // Add hover class for desktop
            if (window.innerWidth > 968) {
                this.classList.add("hover-active");
            }
        });

        dropdown.addEventListener("mouseleave", function() {
            const self = this;
            // Delay closing on desktop
            if (window.innerWidth > 968) {
                closeTimeout = setTimeout(function() {
                    self.classList.remove("hover-active");
                }, HOVER_DELAY);
            }
        });
    });

    // Mobile: toggle button opens/closes the submenu
    toggleButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.closest(".dropdown");
            const wasActive = parent.classList.contains("active");

            // Close all other dropdowns and reset their toggle buttons
            document.querySelectorAll(".dropdown.active").forEach(d => {
                if (d !== parent) {
                    d.classList.remove("active");
                    const otherBtn = d.querySelector(".dropdown-toggle");
                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                }
            });

            // Toggle current dropdown
            if (wasActive) {
                parent.classList.remove("active");
                this.setAttribute("aria-expanded", "false");
            } else {
                parent.classList.add("active");
                this.setAttribute("aria-expanded", "true");
            }
        });
    });

    // Close dropdowns when clicking outside (mobile only)
    document.addEventListener("click", function(e) {
        if (window.innerWidth <= 968 && !e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown.active").forEach(d => {
                d.classList.remove("active");
                const btn = d.querySelector(".dropdown-toggle");
                if (btn) btn.setAttribute("aria-expanded", "false");
            });
        }
    });

    // Close dropdown when clicking a dropdown menu item (actual navigation)
    document.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", function() {
            // Close the dropdown
            const dropdown = this.closest(".dropdown");
            if (dropdown) {
                dropdown.classList.remove("active");
                const btn = dropdown.querySelector(".dropdown-toggle");
                if (btn) btn.setAttribute("aria-expanded", "false");
            }
            // Close mobile menu
            if (window.innerWidth <= 968) {
                closeMobileNav();
            }
        });
    });
});
