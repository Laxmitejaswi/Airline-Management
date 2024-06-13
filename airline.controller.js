const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {Admin,Flight,Airport,Booking,Passenger} = require('./airline.model.js');

// Set up your NodeMailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'airlinemanagment1234@gmail.com',
      pass: 'pbrstrnjaszuaewh'
    }
  });

// Function to send email notification
const sendNotification = async (flight,interval) => {
    // Ensure that bookings is an array and has elements
    if (!Array.isArray(flight.bookings) || flight.bookings.length === 0) {
      console.log('No bookings to send notifications to.');
      return;
    }
  
    // Iterate over each booking and send an email
    for (const booking of flight.bookings) {
      const mailOptions = {
        from: 'airlinemanagment1234@gmail.com',
        to: booking.email, // Use the email from the booking object
        subject: `Flight Reminder - ${interval} Notice`,
        text: `Reminder: Your flight ${flight.flightNumber} is scheduled to depart from ${flight.departure.airportCity} in ${interval}.
         Please check-in if you haven't already done so.Your Booking Id is ${booking.bookingId}.
         Click the following link to checkin using your Booking Id.`
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log('Notification sent to:', booking.email,'for',interval);
      } catch (error) {
        console.error('Error sending notification to', booking.email,'for',interval , error);
      }
    }
  };
  
  
  // Scheduled job to check for upcoming flights and send notifications
  cron.schedule('* * * * *', async () => { // This cron pattern runs every minute, adjust as needed
    const now = new Date(new Date().getTime() + (5 * 60 + 30) * 60000);
    const nextDay = new Date(new Date().getTime() + (29 * 60 + 30) * 60000);
    console.log(now);
    const flights = await Flight.find({
       'departure.scheduledTime': {
        $gte: now, // Greater than or equal to the current time
         $lt: nextDay // Less than 24 hours from now
      },
      // 'status': 'Scheduled' // Assuming you want to find flights that are scheduled
    });
    console.log(flights);
    flights.forEach(flight => {
      const timeDiff = flight.departure.scheduledTime - now;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
  
      // Check for 24-hour interval
      if (hoursDiff <= 24 && !flight.notificationsSent['24h']) {
        sendNotification(flight, '24h');
        flight.notificationsSent['24h'] = true;
        flight.save();
      }
  
      // Check for 12-hour interval
      if (hoursDiff <= 12 && !flight.notificationsSent['12h']) {
        sendNotification(flight, '12h');
        flight.notificationsSent['12h'] = true;
        flight.save();
      }
  
      // Check for 2-hour interval
      if (hoursDiff <= 2 && !flight.notificationsSent['2h']) {
        sendNotification(flight, '2h');
        flight.notificationsSent['2h'] = true;
        flight.save();
      }
    });
   });

const allAirports = async (req, res) => {
    try {
        const airports = await Airport.find({});
        res.status(200).json(airports);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const AirportbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const airport = await Airport.findOne({city:id});
        res.status(200).json(airport);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const newAirport = async (req, res) => {
    try {
        const airport = await Airport.create(req.body);
        res.status(200).json(airport);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const UpdateAirport = async (req, res) => {
    try {
        const airport = await Airport.findOneAndUpdate({city:req.params.id}, req.body, { new: true, runValidators: true });
        if (!airport) {
            return res.status(404).send('Airport not found');
        }
        res.json(airport);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteAirport = async (req, res) => {
    try {
        const airport = await Airport.findOneAndDelete({city:req.params.id});
        if (!airport) {
            return res.status(404).send('Airport not found');
        }
        res.status(204).send('Deleted Successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const allFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const FlightbyId = async (req, res) => {
    try {
        const flight = await Flight.findOne({flightNumber:req.params.id});
        if (!flight) {
            return res.status(404).send('Flight not found');
        }
        res.json(flight);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const newFlightbyId = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).send('Flight not found');
        }
        res.json(flight);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const newFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findOneAndUpdate({flightNumber:req.params.id}, req.body, { new: true, runValidators: true });
        if (!flight) {
            return res.status(404).send('Flight not found');
        }
        res.json(flight);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findOneAndDelete({flightNumber:req.params.id});
        if (!flight) {
            return res.status(404).send('Flight not found');
        }
        res.status(204).send('Deleted Successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createAdmin = async (req, res) => {
    const { username, password } = req.query;
    try {
        // Check if the username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create a new admin instance
        const admin = new Admin({ username, hashedPassword });
        // Save the new admin to the database
        await admin.save();
        res.status(201).send('message: Admin created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin' });
    }
};

const adminAuthentication = async (req, res) => {
    const { username, password } = req.query;
    try {
        // Find the admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Compare the hashed password
        const isAuthenticated = await bcrypt.compare(password, admin.hashedPassword);
        res.status(200).json({ isAuthenticated });
    } catch (error) {
        res.status(500).json({ error: 'Error authenticating admin' });
    }
};

const createPassenger = async (req, res) => {
    const { username, password,email,name,contact } = req.query;
    try {
        // Check if the username already exists
        const existingPassenger = await Passenger.findOne({ username });
        if (existingPassenger) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create a new passenger instance
        const passenger = new Passenger({ username, hashedPassword,email,name,contact });
        // Save the new passenger to the database
        await passenger.save();
        res.status(201).json({ passenger });
    } catch (error) {
        res.status(500).json({ error: 'Error creating passenger' });
    }
};

const passengerAuthentication = async (req, res) => {
    const { username, password } = req.query;
    try {
        // Find the passenger by username
        const passenger = await Passenger.findOne({ username });
        if (!passenger) {
            return res.status(404).json({ error: 'Passenger not found' });
        }

        // Compare the hashed password
        const isAuthenticated = await bcrypt.compare(password, passenger.hashedPassword);
        res.status(200).json({ isAuthenticated });
    } catch (error) {
        res.status(500).json({ error: 'Error authenticating passenger' });
    }
};


const availableFlights = async (req, res) => {
    try {
        const { from, to, startDate, endDate, tripType } = req.query;

        // Find the airports based on the provided codes
        const departureAirport = await Airport.findOne({ city: from });
        const arrivalAirport = await Airport.findOne({ city: to });

        if (!departureAirport || !arrivalAirport) {
            return res.status(404).json({ error: 'Airport not found' });
        }

        // Parse the start and end dates
        const start = new Date(startDate);
        const startDateString = start.toISOString().split('T')[0]; // Get the date part as a string

        let end;
        let endDateString;
        if (tripType === 'roundtrip') {
            end = new Date(endDate);
            endDateString = end.toISOString().split('T')[0]; // Get the date part as a string
        }

        // Query for one-way flights
        let flights = await Flight.find({
            'departure.airportCity': departureAirport.city,
            'arrival.airportCity': arrivalAirport.city,
            'departure.scheduledTime': {
                $gte: start,
                $lt: new Date(new Date(start).setDate(start.getDate() + 1)) // Ensure only flights on the same date are returned
            }
        });

        // If roundtrip, find return flights
        if (tripType === 'roundtrip' && end) {
            const returnFlights = await Flight.find({
                'departure.airportCity': arrivalAirport.city,
                'arrival.airportCity': departureAirport.city,
                'departure.scheduledTime': {
                    $gte: end,
                    $lt: new Date(new Date(end).setDate(end.getDate() + 1)) // Ensure only flights on the same date are returned
                }
            });
            // Array.prototype.push.apply(flights, returnFlights);
              flights = {outbound: flights,return:returnFlights };
        }

        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: 'Error finding flights' });
    }
};


const availableSeats = async (req, res) => {
    try {
        const flight = await Flight.findOne({flightNumber:req.params.id});
        if (!flight) {
            return res.status(404).send('Flight not found');
        }
        // Assuming seatAvailability is a field in the Flight model
        res.json(flight.seatAvailability);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const allBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const BookingbyId = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send('Booking not found');
        }
        res.json(booking);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const newBooking = async (req, res) => {
    try {
        const { flightId, username, seat, seatClass, price } = req.query;

        const flight = await Flight.findOne({flightNumber:flightId});
        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Check if the seat is available
        if (!flight.seatAvailability[seatClass.toLowerCase()].includes(seat)) {
            return res.status(400).json('Seat not available');
        }

        // Create the booking
        const booking = new Booking({ flightId:flight._id, username, seat, seatClass,bookingStatus: 'confirmed', 
        bookingDate: new Date(),price});
        await booking.save();

        // Update the passenger's bookings
        const passenger1 = await Passenger.findOne({username:username});
        if (passenger1) {
            // Update bookings of flight
            flight.bookings.push({
                bookingId: booking._id,
                email:passenger1.email
            });
            await flight.save();
            // Create a booking object without the passengerId
            passenger1.bookings.push({ bookingId: booking._id });
            await passenger1.save();
        }

        // Remove the seat from availability
        flight.seatAvailability[seatClass.toLowerCase()] = flight.seatAvailability[seatClass.toLowerCase()].filter(s => s !== seat);
        await flight.save();

        // Send booking confirmation notification to passenger's email
        const mailOptions = {
            from: 'airlinemanagment1234@gmail.com',
            to: passenger1.email, 
            subject: `Booking Confirmation`,
            text: `Dear ${passenger1.name},

Your booking for flight ${flight.flightNumber} has been confirmed.

Details:
- Booking Id: ${booking._id}
- Seat: ${seat}
- Class: ${seatClass}
- Price: ${price}

Thank you for choosing our airline!
Regards,
The Airline Team
            `};
      
          try {
            await transporter.sendMail(mailOptions);
            console.log('Notification sent to:',passenger1.email,'for booking confirmation');
          } catch (error) {
            console.error('Error sending notification to', passenger1.email,'for booking confirmation', error);
          }

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        const { seat, seatClass, bookingStatus, price } = req.query;

        if (seat) {
            const flight = await Flight.findById(booking.flightId);

            // Check if the new seat is available
            if (!flight.seatAvailability[seatClass.toLowerCase()].includes(seat)) {
                return res.status(400).send('Seat not available');
            }

            // Release the old seat and reserve the new seat
            flight.seatAvailability[booking.seatClass.toLowerCase()].push(booking.seat);
            flight.seatAvailability[seatClass.toLowerCase()] = flight.seatAvailability[seatClass.toLowerCase()].filter(s => s !== seat);
            await flight.save();
        }

        // Update the booking with new details
        Object.assign(booking, {
            seat,
            seatClass,
            bookingStatus, // Update the booking status
            price // Update the price if provided
        });
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send('Booking not found');
        }
        booking.bookingStatus = 'cancelled';
        await booking.save();

        const flight = await Flight.findOne(booking.flightId);
        
        // Release the seat
        flight.seatAvailability[booking.seatClass.toLowerCase()].push(booking.seat);
        await flight.save();
        // Remove the booking from the flight's bookings
        flight.bookings = flight.bookings.filter(b => b.bookingId.toString() !== booking._id.toString());
        await flight.save();
    
        res.status(204).send('Booking cancelled successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const allPassengers = async (req, res) => {
    try {
      const passengers = await Passenger.find({});
      res.send(passengers);
    } catch (error) {
      res.status(500).send(error);
    }
};

const pasengerbyId = async (req, res) => {
    try {
      const passenger = await Passenger.findOne({username:req.params.id});
      if (!passenger) {
        return res.status(404).send();
      }
      res.send(passenger);
    } catch (error) {
      res.status(500).send(error);
    }
  };

// const newPassenger = async (req, res) => {
//     try {
//       const passenger = new Passenger(req.body);
//       await passenger.save();
//       res.status(201).send(passenger);
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   };

const updatePassenger = async (req, res) => {
    try {
      const passenger = await Passenger.findOneAndUpdate({username:req.params.id}, req.body, { new: true, runValidators: true });
      if (!passenger) {
        return res.status(404).send();
      }
      res.send(passenger);
    } catch (error) {
      res.status(400).send(error);
    }
  };

const deletePassenger = async (req, res) => {
    try {
      const passenger = await Passenger.findOneAndDelete({username:req.params.id});
      if (!passenger) {
        return res.status(404).send();
      }
      res.send({ message: 'Passenger deleted successfully!' });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // Function to update check-in status
const updateCheckinStatus = async(req,res) =>{
    try {
        // Find the booking by ID
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            console.log('Booking not found');
            return; // Handle the case where the booking doesn't exist
        }

        // Update the check-in status
        booking.checkinStatus = 'checked-in';

        // Save the updated booking
        await booking.save();
        console.log('Check-in status updated successfully');
    } catch (error) {
        console.error('Error updating check-in status:', error.message);
    }
};

const addReview = async (req, res) => {
    const { username, flightId, rating, comment } = req.body;
        try {
       const flight = await Flight.findOne({flightNumber:flightId});
      if (!flight) {
        return res.status(404).json('Flight not found');
      }
  
       const now = new Date();
      const newReview = {
        username : username,
        rating : rating,
        comment:comment,
        createdAt: now,
      };
  
       flight.reviews.push(newReview);
  
      const totalRating = flight.reviews.reduce((acc, review) => acc + review.rating, 0);
      flight.ratings.count = flight.reviews.length;
      flight.ratings.average = totalRating / flight.ratings.count;
  
      await flight.save();
  
      res.status(201).json(newReview);
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      res.status(500).json('Error submitting review and updating flight');
    }
  };

module.exports = {
    allAirports,
    AirportbyId,
    newAirport,
    UpdateAirport,
    deleteAirport,
    allFlights,
    FlightbyId,
    newFlight,
    updateFlight,
    deleteFlight,
    createAdmin,
    adminAuthentication,
    createPassenger,
    passengerAuthentication,
    availableFlights,
    availableSeats,
    allBookings,
    BookingbyId,
    newBooking,
    deleteBooking,
    updateBooking,
    allPassengers,
    pasengerbyId,
    updatePassenger,
    deletePassenger,
    updateCheckinStatus,
    addReview,
    newFlightbyId

};
