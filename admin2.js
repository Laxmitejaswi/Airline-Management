document.addEventListener('DOMContentLoaded', () => {
    const viewAirportsSection = document.getElementById('view-airports-section');
    const manageAirportsSection = document.getElementById('manage-airports-section');
    const airportForm = document.getElementById('airport-form');
    const deleteAirportForm = document.getElementById('delete-airport-form');
    const airportsTableBody = document.querySelector('#airports-table tbody');
    let editingAirportNumber = null;

    document.getElementById('view-airports-btn').addEventListener('click', () => {
        viewAirportsSection.classList.remove('hidden');
        manageAirportsSection.classList.add('hidden');
    });

    document.getElementById('manage-airports-btn').addEventListener('click', () => {
        manageAirportsSection.classList.remove('hidden');
        viewAirportsSection.classList.add('hidden');
    });

    document.getElementById('view-airports-submit-btn').addEventListener('click', handleViewAirports);

    document.getElementById('add-airport-btn').addEventListener('click', () => {
        airportForm.classList.remove('hidden');
        deleteAirportForm.classList.add('hidden');
        document.getElementById('submit-airport-btn').innerText = 'Add Airport';
        editingAirportNumber = null;
    });

    document.getElementById('delete-airport-btn').addEventListener('click', () => {
        deleteAirportForm.classList.remove('hidden');
        airportForm.classList.add('hidden');
    });

    airportForm.addEventListener('submit', handleAddUpdateAirport);
    deleteAirportForm.addEventListener('submit', handleDeleteAirport);

    function handleAddUpdateAirport(event) {
        event.preventDefault();

        const airport_name = document.getElementById('airport_name').value;
        const airport_code = document.getElementById('airport_code').value;
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;

        const airportData = {
            airport_name,
            airport_code,
            city,
            country
        };

        let airports = JSON.parse(localStorage.getItem('airports')) || [];

        if (editingAirportNumber) {
            const existingAirportIndex = airports.findIndex(airport => airport.airport_code === editingAirportNumber);
            airports[existingAirportIndex] = airportData;
            editingAirportNumber = null;
            document.getElementById('submit-airport-btn').innerText = 'Add Airport';
        } else {
            airports.push(airportData);
        }

        localStorage.setItem('airports', JSON.stringify(airports));
        alert('Airport added/updated successfully!');
        airportForm.reset();
        handleViewAirports();
    }

    function handleDeleteAirport(event) {
        event.preventDefault();

        const airport_code = document.getElementById('delete-airport').value;

        let airports = JSON.parse(localStorage.getItem('airports')) || [];
        airports = airports.filter(airport => airport.airport_code !== airport_code);

        localStorage.setItem('airports', JSON.stringify(airports));
        alert('Airport deleted successfully!');
        deleteAirportForm.reset();
        handleViewAirports();
    }

    function handleViewAirports() {
        const viewCountry = document.getElementById('view-country').value;
        const airports = JSON.parse(localStorage.getItem('airports')) || [];

        const airportsInCountry = airports.filter(airport => airport.country === viewCountry);

        airportsTableBody.innerHTML = '';

        airportsInCountry.forEach(airport => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${airport.airport_name}</td>
                <td>${airport.airport_code}</td>
                <td>${airport.city}</td>
                <td>${airport.country}</td>
                <td>
                    <button class="edit-btn" onclick="handleEditAirport('${airport.airport_code}')">Edit</button>
                    <button class="delete-btn" onclick="handleDeleteAirportDirect('${airport.airport_code}')">Delete</button>
                </td>
            `;

            airportsTableBody.appendChild(row);
        });
    }

    window.handleEditAirport = function(airportCode) {
        manageAirportsSection.classList.remove('hidden');
        viewAirportsSection.classList.add('hidden');
        const airports = JSON.parse(localStorage.getItem('airports')) || [];
        const airport = airports.find(airport => airport.airport_code === airportCode);

        if (airport) {
            document.getElementById('airport_name').value = airport.airport_name;
            document.getElementById('airport_code').value = airport.airport_code;
            document.getElementById('city').value = airport.city;
            document.getElementById('country').value = airport.country;
            editingAirportNumber = airport.airport_code;
            document.getElementById('submit-airport-btn').innerText = 'Update Airport';
            airportForm.classList.remove('hidden');
        }
    };

    window.handleDeleteAirportDirect = function(airportCode) {
        let airports = JSON.parse(localStorage.getItem('airports')) || [];
        airports = airports.filter(airport => airport.airport_code !== airportCode);

        localStorage.setItem('airports', JSON.stringify(airports));
        alert('Airport deleted successfully!');
        handleViewAirports();
    };
});
