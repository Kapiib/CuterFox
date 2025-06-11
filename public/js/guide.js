document.addEventListener('DOMContentLoaded', function() {

    
    // Optional: You could add this code if you want a small animation on page load
    setTimeout(function() {
        const openSection = document.querySelector('details[open]');
        if (openSection) {
            // Force a repaint to trigger the CSS transition
            openSection.classList.add('initialized');
        }
    }, 100);
});