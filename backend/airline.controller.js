const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {Admin,Flight,Airport,Booking,Passenger,Airline} = require('../backend/airline.model.js');

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
        Your Booking Id is ${booking.bookingId}. Use this Booking Id to check-in in our website if you haven't already done so.

        Thank you,
        The Airline Team.
`
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log('Notification sent to:', booking.email,'for',interval);
      } catch (error) {
        console.error('Error sending notification to', booking.email,'for',interval , error);
      }
    }
  };

  const reviewNotification = async (flight) => {
    // Ensure that bookings is an array and has elements
    if (!Array.isArray(flight.bookings) || flight.bookings.length === 0) {
      console.log('No bookings to send review notifications to.');
      return;
    }
  
    // Iterate over each booking and send an email
    for (const booking of flight.bookings) {

      const mailOptions = {
        from: 'airlinemanagment1234@gmail.com',
        to: booking.email, // Use the email from the booking object
        subject: `Your Flight ${flight.flightNumber} Review`,
        text: `Dear Passenger,
We'd love your feedback on your recent flight ${flight.flightNumber} from ${flight.departure.airportCity}.
Please give your valuable feedback in feedback page of our website.

Thank you!
The Airline Team`
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log('Review Notification sent to:', booking.email);
      } catch (error) {
        console.error('Error sending notification to', booking.email , error);
      }

      const completedbooking = await Booking.findById(booking.bookingId);
        completedbooking.bookingStatus = 'completed';
        await completedbooking.save();

    }
  };
  
  // Scheduled job to check for upcoming flights and send notifications
  cron.schedule('* * * * *', async () => { // This cron pattern runs every minute
    const now = new Date();
    const nextDay = new Date(new Date().getTime() + (24 * 60) * 60000);
    const yesterday = new Date(new Date().getTime() - (24 * 60) * 60000); 
    console.log(now);
    const startedflights = await Flight.find({
        'departure.scheduledTime': {
          $lte: now 
       },
       'arrival.scheduledTime': {
            $gt: now
       }
     });
     startedflights.forEach(startedflight => {
        startedflight.status = `departed ${startedflight.departure.airportCity} at ${startedflight.departure.scheduledTime}`;
        startedflight.save();
     });
    const completedflights = await Flight.find({
        'arrival.scheduledTime': {
          $lt: now // Less than 24 hours from now
       },
        'reviewNotification': 'false' 
     });
     completedflights.forEach(completedflight => {
        reviewNotification(completedflight);
        completedflight.reviewNotification = 'true';
        completedflight.status = `reached ${completedflight.arrival.airportCity} at ${completedflight.arrival.scheduledTime}`;
        completedflight.save();
     });

    const tobedeletedflights = await Flight.deleteMany({
        'arrival.scheduledTime': {
          $lt: yesterday // Less than 24 hours from now
       },
        'reviewNotification': 'true' 
     });

      const flights = await Flight.find({
       'departure.scheduledTime': {
        $gte: now, // Greater than or equal to the current time
         $lt: nextDay // Less than 24 hours from now
      }
    });
    // console.log(flights);
    flights.forEach(flight => {
      const timeDiff = flight.departure.scheduledTime - now;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
  
      // Check for 24-hour interval
      if (hoursDiff <= 24 && hoursDiff > 12&& !flight.notificationsSent['24h']) {
        sendNotification(flight, '24h');
        flight.notificationsSent['24h'] = true;
        flight.save();
      }
  
      // Check for 12-hour interval
      else if (hoursDiff <= 12 && hoursDiff > 2 && !flight.notificationsSent['12h']) {
        sendNotification(flight, '12h');
        flight.notificationsSent['12h'] = true;
        flight.save();
      }
  
      // Check for 2-hour interval
      else if (hoursDiff <= 2 && !flight.notificationsSent['2h']) {
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

const AirportsbyCountry = async(req,res) => {
    try {
        const airports = await Airport.find({country:req.params.id});
        res.status(200).json(airports);
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
            return res.status(404).json('Airport not found');
        }
        res.status(204).json('Deleted Successfully!');
    } catch (error) {
        res.status(500).json(error.message);
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

const FlightbyDate = async(req,res) => {
    try {
        const {startDate } = req.query;
        // Parse the start and end dates
        const start = new Date(startDate);

        // Query for one-way flights
        let flights = await Flight.find({
            'departure.scheduledTime': {
                $gte: start,
                $lt: new Date(new Date(start).setDate(start.getDate() + 1)) // Ensure only flights on the same date are returned
            }
        });

        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: 'Error finding flights' });
    }
};
// to get flight by flight number
const FlightbyId = async (req, res) => {
    try {
        const flight = await Flight.findOne({flightNumber:req.params.id});
        if (!flight) {
            return res.status(404).json('Flight not found');
        }
        return res.json(flight);
    } catch (error) {
        res.status(500).json(error.message);
    }
};
// to get flight by id
const newFlightbyId = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json('Flight not found');
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json(error.message);
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

const dailyFlight = async (req, res) => {
    try {
        const {count} = req.query;
        let depTime = new Date(req.body.departure.scheduledTime);
        let arrTime = new Date(req.body.arrival.scheduledTime);
        for(let i =0;i<count;i++){
            const flight = new Flight(req.body);
            flight.flightNumber = flight.flightNumber + i;
            flight.departure.scheduledTime = depTime;
            flight.arrival.scheduledTime = arrTime;
            flight.departure.actualTime = depTime;
            flight.arrival.actualTime = arrTime;
            await flight.save();
            depTime = new Date(depTime.getTime() + (24*60*60)*1000);
            arrTime = new Date(arrTime.getTime() + (24*60*60)*1000);
        }
        
        res.status(200).json('Flights added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const weeklyFlight = async (req, res) => {
    
        try {
            const {count} = req.query;
            let depTime = new Date(req.body.departure.scheduledTime);
            let arrTime = new Date(req.body.arrival.scheduledTime);
            for(let i =0;i<count;i++){
                const flight = new Flight(req.body);
                flight.flightNumber = flight.flightNumber + i;
                flight.departure.scheduledTime = depTime;
                flight.arrival.scheduledTime = arrTime;
                flight.departure.actualTime = depTime;
                flight.arrival.actualTime = arrTime;
                await flight.save();
                depTime = new Date(depTime.getTime() + (7*24*60*60)*1000);
                arrTime = new Date(arrTime.getTime() + (7*24*60*60)*1000);
            }
            
            res.status(200).json('Flights added successfully');
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

        // Check if the flight timings have changed 
        if (req.body.departure.scheduledTime !== flight.departure.scheduledTime ){
            // Send email notifications to all passengers booked on this flight
            for (const booking of flight.bookings) {
                const mailOptions = {
                    from: `airlinemanagment1234@gmail.com`,
                    to: booking.email,
                    subject: `Flight Update - ${flight.flightNumber}`,
                    text: `Dear Passenger,

We regret to inform you that there has been a change to your flight schedule.

Flight Number: ${flight.flightNumber}
Actual Departure Time: ${flight.departure.actualTime}
New Departure Time: ${flight.departure.scheduledTime}
Actual Arrival Time: ${flight.arrival.actualTime}
New Arrival Time: ${flight.arrival.scheduledTime}

Please contact our customer service for further assistance.

Thank you for your understanding,
The Airline Team`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Notification sent to:', booking.email);
                } catch (error) {
                    console.error('Error sending notification to', booking.email, error);
                }
                const passengerbookings = await Booking.findById(booking.bookingId);
                passengerbookings.departure.scheduledTime = flight.departure.scheduledTime;
                passengerbookings.arrival.scheduledTime = flight.arrival.scheduledTime;
                await passengerbookings.save();
            }
        }

        return res.status(200).json(flight);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const cancelFlight = async (req, res) => {
    try {
        // Find the flight and update its status to 'cancelled'
        const flight = await Flight.findOneAndUpdate(
            { flightNumber: req.params.id },
            { status: 'cancelled' },
            { new: true }
        );

        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Send cancellation email notifications to all passengers booked on this flight
        for (const booking of flight.bookings) {
            const passengerBooking = await Booking.findById(booking.bookingId);
            passengerBooking.bookingStatus = 'cancelled';
            await passengerBooking.save();

            const mailOptions = {
                from: `airlinemanagment1234@gmail.com`,
                to: booking.email,
                subject: `Flight Cancellation - ${flight.flightNumber}`,
                text: `Dear Passenger,

We regret to inform you that your flight has been cancelled.

Flight Number: ${flight.flightNumber}

Please contact our customer service for rebooking options or further assistance.

Thank you for your understanding,
The Airline Team`
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('Cancellation notification sent to:', booking.email);
            } catch (error) {
                console.error('Error sending cancellation notification to', booking.email, error);
            }
        }

        // delete the flight for that day
         await Flight.deleteOne({ flightNumber: req.params.id });

        return res.status(200).send('Flight cancelled and notifications sent');
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
        res.status(500).json({error: 'Error authenticating passenger'});
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
                $gt : new Date(),
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
        if(flight.departure.scheduledTime <= new Date() ) {
            return res.status(400).json('Sorry, this flight has already departed and cannot be booked');
        }
        // Check if the seat is available
        if (!flight.seatAvailability[seatClass.toLowerCase()].includes(seat)) {
            return res.status(400).json('Seat not available');
        }

        // Create the booking
        const booking = new Booking({ flightId:flight._id, username, seat, seatClass,bookingStatus: 'confirmed', 
        bookingDate: new Date(),price,flightNumber:flight.flightNumber,
        departure:flight.departure ,
        arrival:flight.arrival,
        duration:flight.duration});
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
            passenger1.bookings.push({ bookingId: booking._id,bookingStatus:'confirmed' });
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

- Seat: ${seat}
- Class: ${seatClass}
- Price: ${price}
- Booking Id: ${booking._id}

You can find the complete details of your booking in the profile page of our website. 

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
        const passenger = await Passenger.findOne({username:booking.username});
        if (!booking) {
            return res.status(404).send('Booking not found');
        }
        booking.bookingStatus = 'cancelled';
        await booking.save();
        passenger.bookings = passenger.bookings.filter(b => b.bookingId.toString() !== booking._id.toString());
        passenger.bookings.push({
            bookingId:booking._id,
            bookingStatus:'cancelled'
        })
    
        await passenger.save();

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


const updateCheckinStatus = async (req, res) => {
    try {
        // Find the booking by ID
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(400).json('Booking not found');
        }
        else if(booking.bookingStatus === 'cancelled'){
            return res.status(400).json('Booking is cancelled');
        }
        else if(booking.bookingStatus === 'completed' || booking.departure.scheduledTime <= new Date()){
            return res.status(400).json('Sorry, this flight has already departed');
        }
        else if(booking.checkinStatus === 'checked-in'){
            return res.status(400).json('Already checked in');
        }

        // Get the scheduled arrival time
        const scheduledTime = new Date(booking.departure.scheduledTime);

        // Get the current date
        const currentDate = new Date();

        // Get tomorrow's date
        const tomorrowDate = new Date();
        tomorrowDate.setDate(currentDate.getDate() + 1);

        // Check if scheduledTime is greater than today and less than tomorrow
        if (scheduledTime > currentDate && scheduledTime < tomorrowDate) {
            booking.checkinStatus = 'checked-in';
            await booking.save();
            return res.status(201).json('Check-in status updated successfully');
        } else {
            return res.status(400).json('You can check in only before 24 hours of the flight scheduled time');
        }
    } catch (error) {
        res.status(500).json('Booking Id is invalid');
    }
};


const addReview = async (req, res) => {
    const { username, flightNumber, rating, comment } = req.body;

    try {
        // Find the airline by flightId
        const airline = await Airline.findOne({code:req.params.id});

        if (!airline) {
            // If no existing airline, create a new one
            const newAirline = new Airline({
                code:'newairline',
                reviews: [{
                    username,
                    flightNumber,
                    rating,
                    comment,
                    createdAt: new Date(),
                }],
                ratings: {
                    average: rating,
                    count: 1,
                },
            });

            await newAirline.save();
            return res.status(201).json(newAirline);
        } else {
            // Update existing airline
            airline.reviews.push({
                username,
                flightNumber,
                rating,
                comment,
                createdAt: new Date(),
            });

            const totalRating = airline.reviews.reduce((acc, review) => acc + review.rating, 0);
            airline.ratings.count = airline.reviews.length;
            airline.ratings.average = totalRating / airline.ratings.count;

            await airline.save();
            return res.status(201).json(airline);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Error submitting review and updating flight');
    }
};

const allReviews = async(req,res)=>{
    try {
        const reviews = await Airline.find({});
        res.send(reviews);
      } catch (error) {
        res.status(500).send(error);
      }
};

const confirmedBookings = async(req,res)=>{
    try {
        const passenger = await Passenger.findOne({username:req.params.id});
        if (!passenger) {
          return res.status(404).send();
        }
        // Get the confirmed bookings with arrival times before today
       const confirmedBookingIds = await Booking.find({
        _id: { $in: passenger.bookings.map(booking => booking.bookingId) },
        bookingStatus: 'confirmed',
        'arrival.scheduledTime': { $gt: new Date() }, // Arrival time not before today
        });

        // Retrieve the full booking details for the confirmed bookings
        const confirmedBookings = await Booking.find({ _id: { $in: confirmedBookingIds } });

        res.status(200).json(confirmedBookings);
      } catch (error) {
        res.status(500).send(error);
      }
};

const completedBookings = async(req,res)=>{
    try {
        const passenger = await Passenger.findOne({username:req.params.id});
        if (!passenger) {
          return res.status(404).send();
        }
        const completedBookingIds = await Booking.find({
            _id: { $in: passenger.bookings.map(booking => booking.bookingId) },
            bookingStatus: 'confirmed',
             'arrival.scheduledTime': { $lte: new Date() }, // Arrival time before today
        });
        completedBookingIds.forEach(completedBookingId => {
            completedBookingId.bookingStatus = 'completed';
            completedBookingId.save();
         });


       // Get the confirmed bookings with arrival times before today
       const confirmedBookingIds = await Booking.find({
        _id: { $in: passenger.bookings.map(booking => booking.bookingId) },
        bookingStatus: 'completed',
        // 'arrival.scheduledTime': { $lt: new Date() }, // Arrival time before today
        });

        // Retrieve the full booking details for the confirmed bookings
        const confirmedBookings = await Booking.find({ _id: { $in: confirmedBookingIds } });

        res.status(200).json(confirmedBookings);
      } catch (error) {
        res.status(500).send(error);
      }
};

const cancelledBookings = async(req,res)=>{
    try {
        const passenger = await Passenger.findOne({username:req.params.id});
        if (!passenger) {
          return res.status(404).send();
        }
        // Get the booking IDs for cancelled bookings
        const cancelledBookingIds = passenger.bookings
            .filter(booking => booking.bookingStatus === 'cancelled')
            .map(booking => booking.bookingId);

        // Retrieve the full booking details for the cancelled bookings
        const cancelledBookings = await Booking.find({ _id: { $in: cancelledBookingIds } });

        res.status(200).json(cancelledBookings);
      } catch (error) {
        res.status(500).send(error);
      }
};

module.exports = {
    allAirports,
    AirportbyId,
    AirportsbyCountry,
    newAirport,
    UpdateAirport,
    deleteAirport,
    allFlights,
    FlightbyId,
    newFlight,
    updateFlight,
    cancelFlight,
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
    newFlightbyId,
    allReviews,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    dailyFlight,
    weeklyFlight,
    FlightbyDate

};
