# Airline-Management

## Live Demo

Check out the deployed version of the project: [Airline Management Live Demo](https://airlinemanagement.onrender.com)


## Technologies Used

- **Frontend**: HTML, CSS, React.js
- **Backend**: Express, Node.js, MongoDB

## Installation Commands to Run the App

### Step-by-Step Instructions

1. **Install Node.js and npm**
   - If not already installed, download and install Node.js and npm from [Node.js official website](https://nodejs.org/).

2. **Clone the Repository**
   - Replace `<repository-url>` with your repository's URL and run the following command:

     ```bash
     git clone <repository-url>
     ```

3. **Navigate to the Project Directory**
   - Replace `<project-directory>` with the name of your cloned repository and run the following command:
   
     ```bash
     cd <project-directory>
     ```

4. **Install Project Dependencies**
   - Run the following commands to install all the dependencies listed in the `package.json` file:

    ### Backend Dependencies
    ```bash
    npm install bcrypt@^5.1.1
    npm install bcryptjs@^2.4.3
    npm install cors@^2.8.5
    npm install express@^4.19.2
    npm install mongodb@^6.6.2
    npm install mongoose@^8.4.0
    npm install node-cron@^3.0.3
    npm install nodemailer@^6.9.13
    npm install nodemon@^3.1.2
    ```

    ### Frontend Dependencies
    ```bash
    npm install react@^18.3.1
    npm install react-dom@^18.3.1
    npm install react-router-dom@^6.23.1
    npm install react-scripts@5.0.1
    npm install web-vitals@^2.1.4
    ```

### To Start the App

Run the following commands in a terminal:
```bash
cd frontend
npm start
```
### To Modify Flights and Airport Data 
Log in as an Admin using the following credentials:

Username: Admin12

password: 1335555

### Features

1. Flight Search and Booking: Allowing users to search for flights based on their destination and travel date.

2. User Profiles: Enabling users to create profiles where they can store their personal information and view current, completed, and  cancelled bookings for a seamless booking experience.

3. Reviews and Ratings: Allowing users to leave reviews and ratings for airlines they have booked, helping others make informed decisions based on past experiences.

4. Notification System: Implementing a notification system to send alerts and reminders to users about check-in deadlines, updates on booked flights, and other important travel-related information.
