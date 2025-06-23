//Toggle theme updates, initializes and switches the theme

const themeSwitch = document.getElementById('theme-icon');

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

const updateThemeIcon = (theme) => {
    const icon = document.getElementById('theme-icon').querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun'; 
    } else {
        icon.className = 'fas fa-moon'; 
    }
};

const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
});
themeSwitch.addEventListener('click', toggleTheme);


//Connecting to mongodb database
const { connectToDatabase } = require('./config/db');
const { saveTrip, getAllTrips } = require('./services/tripService');

connectToDatabase();

async function handleSaveTrip(tripData) {
    try {
        const savedTrip = await saveTrip(tripData);
        console.log('Trip Saved Successfully;', savedTrip);

        displayTrips();
    } catch (error) {
        console.error('Failed to save trip:', error);
    }
}

async function displayTrips() {
    try {
        const trips = await getAllTrips();

        const tripsContainer = document.getElementById('saved-trips');
        tripsContainer.innerHTML = trips.map(trip => `
            <div class="trip-card">
            <h3>${trip.title}</h3>
            <p>Destination: ${trip.destination}</p>
            <p>Dates: ${trip.startDate} - ${trip.endDate}</p>
            </div>
            `).join('');
    } catch (error) {
        console.error('Failed to load trips:', error);
    }
}