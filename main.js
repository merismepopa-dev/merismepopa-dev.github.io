document.addEventListener('DOMContentLoaded', function() {
    // Logique pour le menu Hamburger
    const hamburgerButton = document.getElementById('hamburger-button');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerButton && navLinks) {
        // Ajoute les icônes seulement si elles n'existent pas
        if (!hamburgerButton.querySelector('.fas')) {
            hamburgerButton.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i><i class="fas fa-times" aria-hidden="true"></i>';
        }

        hamburgerButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            // Accessibilité : mise à jour de aria-expanded
            const expanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });

        // Accessibilité : navigation clavier (touche Entrée ou Espace)
        hamburgerButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Logique pour les animations au scroll
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .product-card');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
});
// =======================================
// === LOGIQUE DU BOUTON SCROLL-TO-TOP ===
// =======================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        // Fait apparaître le bouton quand on descend
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };

        // Accessibilité : focus sur le haut de page après scroll
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
            document.body.tabIndex = -1;
            document.body.focus();
        });
    }
});