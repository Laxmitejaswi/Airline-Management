const salutation = document.querySelector('.salutation');
const selectOption = document.querySelector('.select-option');
const title = document.querySelector('#title');
const options = document.querySelector('.options');
const optionList = document.querySelectorAll('.options li');
const heading = document.querySelector('.heading');
selectOption.addEventListener('click',function(){
    salutation.classList.toggle('active');
});

optionList.forEach(function(optionListsingle){
    optionListsingle.addEventListener('click',function(){
        text = this.innerText;
        title.value = text;
        salutation.classList.remove('active');
    });
});
const passengerForm = document.getElementById('passengerForm');
const confirmBookingButton = document.getElementById('confirmBooking');

const flightDetailsSection = document.getElementById('flightdetails');
const passengerDetailsSection = document.getElementById('passengerDetails');
const seatSelectionSection = document.getElementById('seatSelection');
const confirmationSection = document.getElementById('confirmation');

passengerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    flightDetailsSection.classList.add('hidden');
    passengerDetailsSection.classList.add('hidden');
    seatSelectionSection.classList.remove('hidden');
    heading.textContent = 'Select Your Seat';
    generateSeatMap();
});
            
confirmBookingButton.addEventListener('click', function() {
    seatSelectionSection.classList.add('hidden');
    confirmationSection.classList.remove('hidden');
    heading.textContent = 'Booking Details';
    displayConfirmation();
});
            
function generateSeatMap() {
    const seatMap = document.getElementById('seatMap');
    seatMap.innerHTML = ''; // Clear previous seats if any
    const rows = 30;
    const cols = 6;
    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = `${row}${String.fromCharCode(64 + col)}`;
            seat.addEventListener('click', () => selectSeat(seat));
            seatMap.appendChild(seat);
        }
    }
}
    
function selectSeat(seat) {
    const previousSelection = document.querySelector('.seat.selected');
    if (previousSelection) {
        previousSelection.classList.remove('selected');
    }
    seat.classList.add('selected');
}
function displayConfirmation() {
    const title = document.getElementById('title').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('emailId').value;
    const phone = document.getElementById('phoneNum').value;
    const selectedSeat = document.querySelector('.seat.selected').textContent;

    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <p>Name: ${title}${firstName}${lastName}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Seat: ${selectedSeat}</p>
        <p>Booking ID: </p>
    `;
}