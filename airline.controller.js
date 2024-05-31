const bcrypt = require('bcryptjs');
const {Admin,Flight,Airport,Booking,Passenger} = require('./airline.model.js');

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
        const airport = await Airport.findOne({code:id});
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
        const airport = await Airport.findOneAndUpdate({code:req.params.id}, req.body, { new: true, runValidators: true });
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
        const airport = await Airport.findOneAndDelete({code:req.params.id});
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
    const { username, password } = req.query;
    try {
        // Check if the username already exists
        const existingPassenger = await Passenger.findOne({ username });
        if (existingPassenger) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create a new admin instance
        const passenger = new Passenger({ username, hashedPassword });
        // Save the new admin to the database
        await passenger.save();
        res.status(201).json({ message: 'Passenger created successfully' });
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

// 

const availableFlights = async (req, res) => {
    try {
        const { from, to, startDate, endDate } = req.query; // Get the airport codes and date range from query parameters

        // Find the airports based on the provided codes
        const departureAirport = await Airport.findOne({ code: from });
        const arrivalAirport = await Airport.findOne({ code: to });

        if (!departureAirport || !arrivalAirport) {
            return res.status(404).json({ error: 'Airport not found' });
        }

        // Parse the start and end dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to the end of the day

        // Query flights based on departure, arrival airports, and the date range
        const flights = await Flight.find({
            'departure.airportId': departureAirport._id,
            'arrival.airportId': arrivalAirport._id,
            'departure.scheduledTime': { $gte: start, $lte: end } // Check if the scheduled time is within the range
        });

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
        const { flightId, passengerId, seat, seatClass, price } = req.query;

        const flight = await Flight.findOne({flightNumber:flightId});
        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Check if the seat is available
        if (!flight.seatAvailability[seatClass.toLowerCase()].includes(seat)) {
            return res.status(400).send('Seat not available');
        }

        // Remove the seat from availability
        flight.seatAvailability[seatClass.toLowerCase()] = flight.seatAvailability[seatClass.toLowerCase()].filter(s => s !== seat);
        await flight.save();

        // Create the booking
        const booking = new Booking({ flightId, passengerId, seat, seatClass,bookingStatus: 'confirmed', // Set the initial status
        bookingDate: new Date(), // Set the booking date to current date
        price
        });
        await booking.save();

        // Update the passenger's bookings
        const passenger1 = await Passenger.findById(passengerId);
        if (passenger1) {
            // Create a booking object without the passengerId
            const passengerBooking = {
                bookingId: booking._id,
                flightId: booking.flightId,
                bookingStatus: booking.bookingStatus,
                bookingDate: booking.bookingDate,
                seat: booking.seat,
                seatClass: booking.seatClass,
                price: booking.price
            };
            passenger1.bookings.push(passengerBooking);
            await passenger1.save();
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

        const flight = await Flight.findOne(booking.flightId);
        
        // Release the seat
        flight.seatAvailability[booking.seatClass.toLowerCase()].push(booking.seat);
        await flight.save();
        // Remove the booking from the passenger's bookings
        const passenger = await Passenger.findOne({ bookings: { $elemMatch: { bookingId: booking._id } } });
        if (passenger) {
            passenger.bookings = passenger.bookings.filter(b => b.bookingId.toString() !== booking._id.toString());
            await passenger.save();
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.status(204).send('Booking deleted successfully');
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
      const passenger = await Passenger.findById(req.params.id);
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
      const passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
      const passenger = await Passenger.findByIdAndDelete(req.params.id);
      if (!passenger) {
        return res.status(404).send();
      }
      res.send({ message: 'Passenger deleted successfully!' });
    } catch (error) {
      res.status(500).send(error);
    }
  }

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
};