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


//Save A Trip
const tripRoutes = require('./routes/trip.route');
app.use('/api', tripRoutes);

async function saveTrip() {
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const localTips = document.getElementById('local-tips').value;
    const image = document.getElementById('tripimg').value;

    const tripData = {
        destination,
        startDate,
        endDate,
        localTips,
        image
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });
        if (response.ok) {
            alert('Trip saved!');
            window.location.href = 'savedtrips.html';
        } else {
            alert('Failed to save trip');
        }
    } catch (err) {
        console.error('Error saving trip:', err);
    }
};

async function loadSavedTrips() {
    const container = document.getElementById('savedTrips');

    try {
        const response = await fetch('http://localhost:3000/api/trips');
        const trips = await response.json();

        trips.forEach(trip => {
            const tripCard = document.createElement('div');
            tripCard.className = 'tripCard';
            tripCard.innerHTML = `
              <img src="${trip.image || '#'}">
                <label class="heartcheckbox"><input type="checkbox"/><i class="fa-regular fa-heart unchecked"></i><i class="fa-solid fa-heart checked"></i></label>
                <div class="tripdetails">
                    <h3>${trip.destination}</h3>
                    <div class="date">Planned for: ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}</div>
                    <div class="thoughts">${trip.localTips}</div>
                </div>
            `;
            container.appendChild(tripCard);
        });
    } catch (err) {
        console.error('Failed to load trips:', err);
    }
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB');
}

