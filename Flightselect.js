document.addEventListener('DOMContentLoaded', () => {
    const flights = document.querySelectorAll('.flightdeatils_review');

    flights.forEach(flight =>{
        flight.addEventListener('click',() => {
            const reviews = flight.querySelector('.reviews');

            document.querySelectorAll('.reviews').forEach(review =>{
                if(review !== reviews){
                    review.style.display = 'none';
                }
            });

            if(reviews.style.display === 'none' || reviews.style.display === ''){
                reviews.style.display = 'block';
            }
        });
    });

    const bookNow = document.querySelectorAll('.book_now');
    console.log(bookNow);
    bookNow.forEach(booking =>{
        booking.addEventListener('click',()=>{
            console.log("Redirect for booking");
        });
    });
});