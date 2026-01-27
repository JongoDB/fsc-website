// Generate header navigation
function generateHeader() {
    return `
    <header>
        <nav class="container">
            <div>
                <a href="/" class="logo">Fighting Smart Cyber</a>
                <div class="tagline">Operator-Led Offensive & Defensive Cyber</div>
            </div>
            <button class="menu-toggle" onclick="toggleMenu()" aria-label="Toggle menu">☰</button>
            <ul class="nav-links" id="navLinks">
                <li><a href="/about/who-we-are.html">About</a></li>
                <li><a href="/solutions/index.html">Solutions</a></li>
                <li><a href="/training/index.html">Training</a></li>
                <li><a href="/platforms/index.html">Platforms</a></li>
                <li><a href="/bundles/index.html">Bundles</a></li>
                <li><a href="/resources/index.html">Resources</a></li>
                <li><a href="/contact.html" class="nav-cta">Contact</a></li>
            </ul>
        </nav>
    </header>
    `;
}

// Generate footer
function generateFooter() {
    return `
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Fighting Smart Cyber</h4>
                    <p>Defend smarter by thinking like an operator. Operator-led cybersecurity solutions from proven leaders.</p>
                </div>
                <div class="footer-section">
                    <h4>Solutions</h4>
                    <ul>
                        <li><a href="/solutions/consulting.html">Cybersecurity Consulting</a></li>
                        <li><a href="/solutions/training.html">Operator-Led Training</a></li>
                        <li><a href="/platforms/soc-in-a-box.html">SOC-in-a-Box Platform</a></li>
                        <li><a href="/platforms/secure-kubernetes.html">Secure Kubernetes Core</a></li>
                        <li><a href="/bundles/index.html">App Bundles & Catalog</a></li>
                        <li><a href="/solutions/consulting.html">Consulting & Advisory</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/about/who-we-are.html">Who We Are</a></li>
                        <li><a href="/about/leadership.html">Leadership</a></li>
                        <li><a href="/resources/index.html">Resources</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: info@fightingsmartcyber.com<br>
                    Ready to discuss your mission?<br>
                    Let's talk.</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Fighting Smart Cyber. All rights reserved. | Operator-Led Offensive and Defensive Cyber Solutions</p>
            </div>
        </div>
    </footer>
    `;
}

