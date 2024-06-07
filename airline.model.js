const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true }
});

const FlightsSchema = new mongoose.Schema(
    {
        flightNumber: { type: String, required: [true,"Please enter flight number"] ,unique: true},
        departure: {
            airportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
            scheduledTime: { type: Date, required: true },
            actualTime: { type: Date }
        },
        arrival: {
            airportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
            scheduledTime: { type: Date, required: true },
            actualTime: { type: Date }
        },
        capacity: {
            economySeats: { type: Number, required: true },
        },
        seatAvailability: {
             economy: { type: [String], required: true },
        },
        price: {
             economy: { type: Number, required: true },
        },
        status: { type: String, required: true },
        duration: { type: Number, required: true },
        reviews: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
            comment: { type: String, required: true },
            rating: { type: Number, required: true, min: 0, max: 5 },
            createdAt: { type: Date, default: Date.now }
        }],
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        }
    }
);

const AirportSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true,unique: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    }
);

const BookingSchema = new mongoose.Schema(
    {
        flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
        passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
        bookingStatus: {
            type: String,
            enum: ['confirmed', 'pending','cancelled'],
            default: 'pending'
        },
        bookingDate: {
            type: Date,
            default: Date.now
        },
        seat: { type: String, required: true },
        seatClass: { type: String, required: true },
        price: { type: Number, required: true },
        checkinStatus: {
            type: String,
            enum: ['checked-in', 'not-checked-in'],
            default: 'not-checked-in'
        },
    }
);

const PassengerSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        hashedPassword: { type: String, required: true },
        email: { type: String, required: true },
        bookings: [
            {
                bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
            }
        ]
    }
);

const Flight = mongoose.model("Flight", FlightsSchema);
const Airport = mongoose.model("Airport", AirportSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const Passenger = mongoose.model("Passenger", PassengerSchema);
const Admin = mongoose.model("Admin",AdminSchema);

module.exports = 
{
    Admin,
    Flight,
    Airport,
    Booking,
    Passenger
};
