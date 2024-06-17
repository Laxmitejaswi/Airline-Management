const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
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











