// Navigation functionality
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

// Close menu when clicking a link (but NOT dropdown parents)
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Only close menu if NOT a dropdown parent
            if (!link.parentElement.classList.contains("dropdown")) {
                const nav = document.getElementById("navLinks");
                if (nav) {
                    nav.classList.remove("active");
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", function(event) {
        const nav = document.querySelector("nav");
        const navLinks = document.getElementById("navLinks");
        const menuToggle = document.querySelector(".menu-toggle");
        
        if (nav && navLinks && menuToggle) {
            if (!nav.contains(event.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
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


// Dropdown toggle for all platforms (desktop and mobile)
document.addEventListener("DOMContentLoaded", function() {
    const dropdowns = document.querySelectorAll(".dropdown > a");
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const parent = this.parentElement;
            const wasActive = parent.classList.contains("active");
            
            // Close all other dropdowns
            document.querySelectorAll(".dropdown.active").forEach(d => {
                if (d !== parent) {
                    d.classList.remove("active");
                }
            });
            
            // Toggle current dropdown
            if (wasActive) {
                parent.classList.remove("active");
            } else {
                parent.classList.add("active");
            }
        });
    });
    
    // Close dropdowns when clicking outside (but not the parent nav)
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown.active").forEach(d => {
                d.classList.remove("active");
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
            }
            // Close mobile menu
            const nav = document.getElementById("navLinks");
            if (nav && window.innerWidth <= 968) {
                nav.classList.remove("active");
            }
        });
    });
});
