const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true }
});

const AirlineSchema = new mongoose.Schema({
    code:{type: String, required:true},
    reviews: [{
        username: { type: String, required: true },
        flightNumber:{type:String,required:true},
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now }
    }],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }
});


const FlightsSchema = new mongoose.Schema(
    {
        flightNumber: { type: String, required: [true,"Please enter flight number"] ,unique: true},
        departure: {
            airportCity: { type:String, required: true },
            scheduledTime: { type: Date, required: true },
            actualTime: { type: Date }
        },
        arrival: {
            airportCity: { type: String, required: true },
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
        bookings: [
            {
                bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: false },
                email: { type: String, required: false },
            }
        ],
        notificationsSent: {
            '24h': { type: Boolean, default: false },
            '12h': { type: Boolean, default: false },
            '2h': { type: Boolean, default: false }
          },
        reviewNotification:{ type: Boolean, default: false }
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
        username: { type: String, required: true },
         bookingStatus: {
            type: String,
            enum: ['confirmed','cancelled','completed'],
            default: 'confirmed'
        },
        bookingDate: {
            type: Date,
            default: Date.now
        },
        flightNumber: { type: String, required: true },
        departure: {
            airportCity: { type:String, required: true },
            scheduledTime: { type: Date, required: true },
            actualTime: { type: Date }
        },
        arrival: {
            airportCity: { type: String, required: true },
            scheduledTime: { type: Date, required: true },
            actualTime: { type: Date }
        },
        duration: { type: Number, required: true },
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
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
        bookings: [
            {
                bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
                bookingStatus:{
                    type: String,
                    enum: ['confirmed','cancelled','completed'],
                    default: 'confirmed'
                }
            }
        ]
    }
);

const Flight = mongoose.model("Flight", FlightsSchema);
const Airport = mongoose.model("Airport", AirportSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const Passenger = mongoose.model("Passenger", PassengerSchema);
const Admin = mongoose.model("Admin",AdminSchema);
const Airline = mongoose.model("Airline",AirlineSchema);

module.exports = 
{
    Admin,
    Flight,
    Airport,
    Booking,
    Passenger,
    Airline
};
