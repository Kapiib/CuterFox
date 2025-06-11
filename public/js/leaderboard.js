document.addEventListener('DOMContentLoaded', function() {
    // Page size selector functionality
    const pageSizeSelect = document.getElementById('page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            const limit = this.value;
            window.location.href = `/leaderboard?page=1&limit=${limit}`;
        });
    }

    // Lightbox functionality
    const foxImages = document.querySelectorAll('.leaderboard-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Add click event to each image
    foxImages.forEach(image => {
        image.addEventListener('click', function() {
            lightboxImage.src = this.src;
            lightbox.classList.add('active');
        });
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImage) {
            lightbox.classList.remove('active');
        }
    });
});