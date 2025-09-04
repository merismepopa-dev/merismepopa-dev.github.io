document.addEventListener('DOMContentLoaded', function() {
    // Logique pour le menu Hamburger
    const hamburgerButton = document.getElementById('hamburger-button');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerButton && navLinks) {
        hamburgerButton.innerHTML = '<i class="fas fa-bars"></i><i class="fas fa-times"></i>';

        hamburgerButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Logique pour le header qui change au scroll (déplacée ici)
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
});