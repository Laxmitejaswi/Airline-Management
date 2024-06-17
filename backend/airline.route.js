const express = require("express");
const router = express.Router();
const {allAirports,AirportbyId,newAirport,UpdateAirport,deleteAirport,allFlights,FlightbyId,
    newFlight,updateFlight,cancelFlight,createAdmin,adminAuthentication,createPassenger,passengerAuthentication,
    availableFlights,availableSeats,allBookings,BookingbyId,newBooking,deleteBooking,updateBooking,allPassengers,
    pasengerbyId,updatePassenger,deletePassenger,updateCheckinStatus,addReview,newFlightbyId,allReviews,confirmedBookings,completedBookings,
    cancelledBookings,AirportsbyCountry,dailyFlight,weeklyFlight,FlightbyDate
} = require('./airline.controller.js');

// GET all airports
router.get('/airports',allAirports );
// GET airports of particular country
router.get('/airports/country/:id',AirportsbyCountry );
// GET airports by id
router.get('/airports/:id',AirportbyId );
// POST create a new airport
router.post('/airports',newAirport);
// PUT update an existing airport
router.put('/airports/:id', UpdateAirport);
// DELETE a airport
router.delete('/airports/:id', deleteAirport);

// GET all flights
router.get('/flights', allFlights);
// GET a single flight by ID
router.get('/flight/id/:id', newFlightbyId);
// GET a single flight by number
router.get('/flights/:id', FlightbyId);
// GET a single flight by date
router.get('/flightsbyDate', FlightbyDate);
// POST create a new flight
router.post('/flights', newFlight);
// POST create daily flights
router.post('/flights/daily',dailyFlight);
// POST create weekly flights
router.post('/flights/weekly', weeklyFlight);
// PUT update an existing flight
router.put('/flights/:id', updateFlight);
// DELETE a flight
router.delete('/flights/cancel/:id',cancelFlight );

// add a new admin
router.post('/admin/register', createAdmin);
// admin authentication
router.get('/admin/authenticate', adminAuthentication);
// add a new passenger
router.post('/passenger/register', createPassenger);
// passenger authentication
router.get('/passenger/authenticate', passengerAuthentication);

// find available flights between two airports
router.get('/flightsavailable', availableFlights);
// GET all available seats for a specific flight
router.get('/flights/:id/seats', availableSeats);

// GET all bookings
router.get('/bookings',allBookings );
// GET a single bookings by ID
router.get('/bookings/:id', BookingbyId);
// POST create a new booking with seat selection
router.post('/bookings',newBooking );
// PUT update a booking (e.g., change seat or status)
router.put('/bookings/:id', updateBooking);
// DELETE a booking
router.delete('/bookings/:id', deleteBooking);

//Create (POST) - Add a New Passenger
// router.post('/passengers', ); 
//Read (GET) - Get All Passengers
router.get('/passengers', allPassengers);
// Get a Single Passenger by ID
router.get('/passengers/:id', pasengerbyId);
//Update (PUT) - Update a Passenger
router.put('/passengers/:id', updatePassenger);
//Delete (DELETE) - Remove a Passenger
router.delete('/passengers/:id', deletePassenger);

// GET confirmed bookings of a passenger
router.get('/bookings/confirmed/:id',confirmedBookings);
// GET completed bookings of a passenger
router.get('/bookings/completed/:id',completedBookings);
// GET cancelled bookings of a passenger
router.get('/bookings/cancelled/:id',cancelledBookings);


//update checkin status
router.put('/checkin/:id', updateCheckinStatus);
// GET all reviews
router.get('/reviews',allReviews);
// POST endpoint to submit a review
router.put('/addreviews/:id', addReview); 

module.exports = router;

