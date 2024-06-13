document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewList = document.getElementById('reviewList');
    const stars = document.querySelectorAll('.rating input');

    stars.forEach(star => {
        star.addEventListener('change', () => {
            highlightStars(star.value);
        });
    });

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(reviewForm);
        const rating = formData.get('stars');
        const reviewText = formData.get('review');

        if (!rating) {
            alert('Please select a rating');
            return;
        }
        reviewForm.reset();
        highlightStars(0);  // Reset stars highlighting
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            if (star.value <= rating) {
                star.nextElementSibling.style.color = '#ffd700';
            } else {
                star.nextElementSibling.style.color = '#ddd';
            }
        });
    }
});
