// Tooltip functionality for Fighting Smart Cyber
// Handles acronym explanations and ARIA attributes

document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA attributes to tooltip triggers
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');

    tooltipTriggers.forEach(trigger => {
        // Make tooltip triggers focusable
        if (!trigger.hasAttribute('tabindex')) {
            trigger.setAttribute('tabindex', '0');
        }

        // Add ARIA description
        trigger.setAttribute('aria-describedby', 'tooltip-' + Math.random().toString(36).substr(2, 9));

        // Handle keyboard events
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('tooltip-active');
            }

            if (e.key === 'Escape') {
                this.classList.remove('tooltip-active');
            }
        });

        // Handle touch events for mobile
        trigger.addEventListener('touchstart', function(e) {
            // Prevent double-tap zoom on tooltip triggers
            if (this.classList.contains('tooltip-active')) {
                return;
            }

            // Close other active tooltips
            document.querySelectorAll('.tooltip-trigger.tooltip-active').forEach(t => {
                if (t !== this) {
                    t.classList.remove('tooltip-active');
                }
            });

            this.classList.add('tooltip-active');
        });
    });

    // Close tooltips when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tooltip-trigger')) {
            document.querySelectorAll('.tooltip-trigger.tooltip-active').forEach(trigger => {
                trigger.classList.remove('tooltip-active');
            });
        }
    });

    // Update hamburger menu toggle to animate icon
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        const originalToggle = window.toggleMenu;

        window.toggleMenu = function() {
            menuToggle.classList.toggle('active');
            if (originalToggle) {
                originalToggle();
            }
        };
    }
});
