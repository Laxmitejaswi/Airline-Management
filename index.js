const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {Flight} = require('./airline.model.js');
const AirlineRoute = require('./airline.route.js');
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api",AirlineRoute);

mongoose.connect("mongodb+srv://devikareddi0512:Devika2005@cluster0.h1r6yyq.mongodb.net/Airline?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connected to database!");
    app.listen(3000,() => {
        console.log('Server is running on port 3000');
    });
})
.catch(()=>{
    console.log("Connection failed!");
});


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
      text: `Reminder: Your flight ${flight.flightNumber} is scheduled to depart from ${flight.departure.airportCity} in ${interval}. Please check-in if you haven't already done so.`
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









