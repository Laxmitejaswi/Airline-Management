document.addEventListener('DOMContentLoaded', () => {
    const viewFlightsSection = document.getElementById('view-flights-section');
    const manageFlightsSection = document.getElementById('manage-flights-section');
    const flightForm = document.getElementById('flight-form');
    const deleteForm = document.getElementById('delete-form');
    const flightsTableBody = document.querySelector('#flights-table tbody');
    let editingFlightNumber = null;

    document.getElementById('view-flights-btn').addEventListener('click', () => {
        viewFlightsSection.classList.remove('hidden_4');
        manageFlightsSection.classList.add('hidden_4');
    });

    document.getElementById('manage-flights-btn').addEventListener('click', () => {
        manageFlightsSection.classList.remove('hidden_4');
        viewFlightsSection.classList.add('hidden_4');
    });

    document.getElementById('view-flights-submit-btn').addEventListener('click', handleViewFlights);

    document.getElementById('add-flight-btn').addEventListener('click', () => {
        flightForm.classList.remove('hidden_4');
        deleteForm.classList.add('hidden_4');
        document.getElementById('submit-flight-btn').innerText = 'Add Flight';
        editingFlightNumber = null;
    });

    document.getElementById('delete-flight-btn').addEventListener('click', () => {
        deleteForm.classList.remove('hidden_4');
        flightForm.classList.add('hidden_4');
    });

    flightForm.addEventListener('submit', handleAddUpdateFlight);
    deleteForm.addEventListener('submit', handleDeleteFlight);

    function handleAddUpdateFlight(event) {
        event.preventDefault();

        const flightNumber = document.getElementById('flight-number').value;
        const dep_airport = document.getElementById('dep_airport').value;
        const arr_airport = document.getElementById('arr_airport').value;
        const dep_sched_time = document.getElementById('dep_sched_time').value;
        const dep_actual_time = document.getElementById('dep_actual_time').value;
        const arr_sched_time = document.getElementById('arr_sched_time').value;
        const arr_actual_time = document.getElementById('arr_actual_time').value;
        const capacity = document.getElementById('capacity').value;
        const available_seats = document.getElementById('available_seats').value;
        const cost = document.getElementById('cost').value;

        const flightData = { flightNumber,
                            dep_airport,
                            arr_airport,
                            dep_sched_time,
                            dep_actual_time,
                            arr_sched_time,
                            arr_actual_time,
                            capacity,
                            available_seats,
                            cost};


        let flights = JSON.parse(localStorage.getItem('flights')) || [];

        if (editingFlightNumber) {
            const existingFlightIndex = flights.findIndex(flight => flight.flightNumber === editingFlightNumber);
            flights[existingFlightIndex] = flightData;
            editingFlightNumber = null;
            document.getElementById('submit-flight-btn').innerText = 'Add Flight';
        } else {
            flights.push(flightData);
        }

        localStorage.setItem('flights', JSON.stringify(flights));
        alert('Flight added/updated successfully!');
        flightForm.reset();
        handleViewFlights();
    }

    function handleDeleteFlight(event) {
        event.preventDefault();

        const flightNumber = document.getElementById('delete-flight-number').value;

        let flights = JSON.parse(localStorage.getItem('flights')) || [];
        flights = flights.filter(flight => flight.flightNumber !== flightNumber);

        localStorage.setItem('flights', JSON.stringify(flights));
        alert('Flight deleted successfully!');
        deleteForm.reset();
        handleViewFlights();
    }

    function handleViewFlights() {
        const viewDate = document.getElementById('view-date').value;
        const flights = JSON.parse(localStorage.getItem('flights')) || [];

        const flightsOnSelectedDate = flights.filter(flight => (flight.dep_sched_time).split('T')[0] === viewDate);

        flightsTableBody.innerHTML = '';

        flightsOnSelectedDate.forEach(flight => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${flight.flightNumber}</td>
                <td>${flight.dep_airport}</td>
                <td>${flight.arr_airport}</td>
                <td>${flight.dep_sched_time}</td>
                <td>${flight.dep_actual_time}</td>
                <td>${flight.arr_sched_time}</td>
                <td>${flight.arr_actual_time}</td>
                <td>${flight.cost}</td>
                <td>
                    <button class="edit-btn" onclick="handleEditFlight('${flight.flightNumber}')">Edit</button>
                    <button class="delete-btn" onclick="handleDeleteFlight('${flight.flightNumber}')">Delete</button>
                </td>
            `;

            flightsTableBody.appendChild(row);
        });
    }

    window.handleEditFlight = function(flightNumber) {
        manageFlightsSection.classList.remove('hidden_4');
        viewFlightsSection.classList.add('hidden_4');
        const flights = JSON.parse(localStorage.getItem('flights')) || [];
        const flight = flights.find(flight => flight.flightNumber === flightNumber);

        if (flight) {
            document.getElementById('flight-number').value = flight.flightNumber;
            document.getElementById('dep_airport').value = flight.dep_airport;
            document.getElementById('arr_airport').value =flight.arr_airport ;
            document.getElementById('dep_sched_time').value = flight.dep_sched_time;
            document.getElementById('dep_actual_time').value = flight.dep_actual_time;
            document.getElementById('arr_sched_time').value = flight.arr_sched_time;
            document.getElementById('arr_actual_time').value = flight.arr_actual_time;
            document.getElementById('capacity').value = flight.capacity;
            document.getElementById('available_seats').value = flight.available_seats;
            document.getElementById('cost').value = flight.cost;
            editingFlightNumber = flight.flightNumber;
            document.getElementById('submit-flight-btn').innerText = 'Update Flight';
            flightForm.classList.remove('hidden_4');
        }
    };

    window.handleDeleteFlight = function(flightNumber) {
        let flights = JSON.parse(localStorage.getItem('flights')) || [];
        flights = flights.filter(flight => flight.flightNumber !== flightNumber);

        localStorage.setItem('flights', JSON.stringify(flights));
        alert('Flight deleted successfully!');
        handleViewFlights();
    };
});