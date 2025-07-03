//Toggle theme updates, initializes and switches the theme
const themeSwitch = document.getElementById('theme-icon');

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    // Note: Removed localStorage usage as it's not supported in artifacts
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
    // Default to light theme since localStorage is not available
    const savedTheme = 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
});

if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
}

const API_BASE = '/api/trips';
let activities = [];

// DOM elements
const tripForm = document.getElementById('tripForm');
const tripsContainer = document.getElementById('tripsContainer');
const messageDiv = document.getElementById('message');
const activitiesContainer = document.getElementById('activitiesContainer');
const activityInput = document.getElementById('activityInput');

// Show message
function showMessage(message, type = 'success') {
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add activity
function addActivity() {
    if (activityInput) {
        const activity = activityInput.value.trim();
        if (activity && !activities.includes(activity)) {
            activities.push(activity);
            activityInput.value = '';
            renderActivities();
        }
    }
}

// Remove activity
function removeActivity(index) {
    activities.splice(index, 1);
    renderActivities();
}

// Render activities
function renderActivities() {
    if (activitiesContainer) {
        activitiesContainer.innerHTML = activities.map((activity, index) => 
            `<span class="activity-tag">${activity}<span class="remove-activity" onclick="removeActivity(${index})">×</span></span>`
        ).join('');
    }
}

// Allow Enter key to add activity
if (activityInput) {
    activityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addActivity();
        }
    });
}

// Create trip card HTML
function createTripCard(trip) {
    const imageUrl = trip.image?.trim() || 'https://via.placeholder.com/300x200?text=No+Image';
    return `
        <div class="trip-card" data-tripid="${trip._id}">
           <img src="${imageUrl}" alt="${trip.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found';">
           <label class="heartcheckbox"><input type="checkbox"/><i class="fa-regular fa-heart unchecked"></i><i class="fa-solid fa-heart checked"></i></label>
           <div class="trip-card-content">
           <h3>${trip.destination}</h3>
           <p class="time">Planned for: ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)} </p>
           <p class="description">${trip.localTips || 'No additional notes'}</p>
           </div>
        </div>
    `;
}

// Fetch and display trips
async function fetchTrips() {
    if (!tripsContainer) return;
    
    try {
        const response = await fetch(API_BASE);
        const result = await response.json();
        
        if (result.success) {
            if (result.data.length === 0) {
                tripsContainer.innerHTML = '<div class="no-trips">No trips found. Add your first trip above!</div>';
            } else {
                tripsContainer.innerHTML = result.data.map(createTripCard).join('');
                document.querySelectorAll('.trip-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const tripId = card.getAttribute('data-tripid');
                        window.location.href = `trip.html?tripId=${tripId}`;
                    });
                });
            }
        } else {
            tripsContainer.innerHTML = '<div class="error">Error loading trips</div>';
        }
    } catch (error) {
        console.error('Error fetching trips:', error);
        if (tripsContainer) {
            tripsContainer.innerHTML = '<div class="error">Error loading trips</div>';
        }
    }
}

// Add new trip with file upload support
async function addTrip(formData) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            body: formData // Send FormData directly, don't set Content-Type header
        });
        
        const result = await response.json();
        
        if (result.success) {
            const newTripId = result.data._id;
            window.location.href = `trip.html?tripId=${newTripId}`;
            showMessage('Trip added successfully!', 'success');
            if (tripForm) {
                tripForm.reset();
            }
            activities = [];
            renderActivities();
            fetchTrips(); // Refresh the trips list
        } else {
            showMessage(result.message || 'Error adding trip', 'error');
        }
    } catch (error) {
        console.error('Error adding trip:', error);
        showMessage('Error adding trip', 'error');
    }
}

// Delete trip
async function deleteTrip(tripId) {
    if (!confirm('Are you sure you want to delete this trip?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${tripId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Trip deleted successfully!', 'success');
            fetchTrips(); // Refresh the trips list
        } else {
            showMessage(result.message || 'Error deleting trip', 'error');
        }
    } catch (error) {
        console.error('Error deleting trip:', error);
        showMessage('Error deleting trip', 'error');
    }
}

// Form submission handler
if (tripForm) {
    fetchTrips();
    tripForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(tripForm);
        
        // Add activities to form data
        formData.append('activities', JSON.stringify(activities));
        
        // Basic validation
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        
        if (new Date(startDate) >= new Date(endDate)) {
            showMessage('End date must be after start date', 'error');
            return;
        }
        
        await addTrip(formData);
    });
}

// Initialize trips on pages that have the container
if (tripsContainer) {
    fetchTrips();
}

// Make functions available globally
window.deleteTrip = deleteTrip;
window.addActivity = addActivity;
window.removeActivity = removeActivity;

// Load trips when page loads
document.addEventListener('DOMContentLoaded', fetchTrips);



//Explore trip locations via map
const map = L.map('map').setView([28.6139, 77.2090], 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            let places = [];
            let searchTimeout;
            let currentSearchMarker = null;

            // Initialize with some sample data that will persist
            function initializePlaces() {
                // This simulates persistent data - in a real app you'd use localStorage
                if (!window.persistentPlaces) {
                    window.persistentPlaces = [
                        { name: "Delhi", status: "Visited", lat: 28.6139, lng: 77.2090 },
                        { name: "Mumbai", status: "Future", lat: 19.0760, lng: 72.8777 },
                        { name: "Udaipur", status: "Visited", lat: 24.5854, lng: 73.7125 }
                    ];
                }
                loadPlaces();
            }

            // Search functionality
            async function searchPlaces(query) {
                if (query.length < 3) {
                    hideSearchResults();
                    return;
                }

                showLoading();

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
                    const results = await response.json();
                    displaySearchResults(results);
                } catch (error) {
                    console.error('Search error:', error);
                    hideSearchResults();
                }
            }

            function showLoading() {
                const resultsDiv = document.getElementById('searchResults');
                resultsDiv.innerHTML = '<div class="loading">Searching...</div>';
                resultsDiv.style.display = 'block';
            }

            function hideSearchResults() {
                const resultsDiv = document.getElementById('searchResults');
                resultsDiv.style.display = 'none';
            }

            function displaySearchResults(results) {
                const resultsDiv = document.getElementById('searchResults');
                
                if (results.length === 0) {
                    resultsDiv.innerHTML = '<div class="loading">No results found</div>';
                    return;
                }

                resultsDiv.innerHTML = '';
                
                results.forEach(result => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `<strong>${result.display_name}</strong>`;
                    
                    item.onclick = () => {
                        selectSearchResult(result);
                    };
                    
                    resultsDiv.appendChild(item);
                });
                
                resultsDiv.style.display = 'block';
            }

            function selectSearchResult(result) {
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                
                // Remove previous search marker if exists
                if (currentSearchMarker) {
                    map.removeLayer(currentSearchMarker);
                }
                
                // Add temporary search marker
                currentSearchMarker = L.marker([lat, lng], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(map);
                
                // Add popup with option to save
                currentSearchMarker.bindPopup(`
                    <div>
                        <strong>${result.display_name}</strong><br>
                        <button onclick="saveSearchedPlace('${result.display_name.replace(/'/g, "\\'")}', ${lat}, ${lng})" 
                                style="margin-top: 8px; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Save this place
                        </button>
                    </div>
                `).openPopup();
                
                // Zoom to location
                map.setView([lat, lng], 13);
                
                // Hide search results
                hideSearchResults();
                document.getElementById('searchInput').value = '';
            }

            function saveSearchedPlace(name, lat, lng) {
                const status = prompt("Enter status (e.g., 'Visited', 'Future', 'Planning'):", "Future");
                if (!status) return;

                // Remove search marker
                if (currentSearchMarker) {
                    map.removeLayer(currentSearchMarker);
                    currentSearchMarker = null;
                }

                // Add permanent marker
                const marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<strong>${name}</strong><br>Status: ${status}<br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);

                places.push({ name, status, lat, lng, marker });
                updatePlacesList();
                savePlaces();
            }

            // Load places from persistent storage
            function loadPlaces() {
                places = [...window.persistentPlaces];
                places.forEach(place => {
                    const marker = L.marker([place.lat, place.lng]).addTo(map)
                        .bindPopup(`<strong>${place.name}</strong><br>Status: ${place.status}<br>Lat: ${place.lat.toFixed(4)}, Lng: ${place.lng.toFixed(4)}`);
                    place.marker = marker;
                });
                updatePlacesList();
            }

            // Save places to persistent storage
            function savePlaces() {
                window.persistentPlaces = places.map(place => ({
                    name: place.name,
                    status: place.status,
                    lat: place.lat,
                    lng: place.lng
                }));
            }

            function updatePlacesList() {
                const list = document.getElementById('placeItems');
                list.innerHTML = '';
                places.forEach((place, index) => {
                    const li = document.createElement('li');
                    const info = document.createElement('div');
                    info.className = 'place-info';
                    info.innerHTML = `<strong>${place.name}</strong><br>
                                      Status: ${place.status}<br>
                                      Lat: ${place.lat.toFixed(4)}, Lng: ${place.lng.toFixed(4)}`;

                    const btn = document.createElement('button');
                    btn.innerText = 'Remove';
                    btn.className = 'remove-btn';
                    btn.onclick = () => {
                        map.removeLayer(place.marker);
                        places.splice(index, 1);
                        updatePlacesList();
                        savePlaces();
                    };

                    li.appendChild(info);
                    li.appendChild(btn);
                    list.appendChild(li);
                });
            }

            function clearAllPlaces() {
                if (confirm('Are you sure you want to remove all places?')) {
                    places.forEach(place => {
                        map.removeLayer(place.marker);
                    });
                    places = [];
                    window.persistentPlaces = [];
                    updatePlacesList();
                }
            }

            map.on('click', function(e) {
                // Hide search results if clicking on map
                hideSearchResults();
                
                const { lat, lng } = e.latlng;
                const name = prompt("Enter place name:");
                if (!name) return;

                const status = prompt("Enter status (e.g., 'Visited', 'Future', 'Planning'):");
                if (!status) return;

                const marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<strong>${name}</strong><br>Status: ${status}<br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);

                places.push({ name, status, lat, lng, marker });
                updatePlacesList();
                savePlaces();
            });

            // Search input event listeners
            document.getElementById('searchInput').addEventListener('input', function(e) {
                const query = e.target.value.trim();
                
                // Clear previous timeout
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                
                // Set new timeout for search (debounce)
                searchTimeout = setTimeout(() => {
                    searchPlaces(query);
                }, 300);
            });

            // Hide search results when clicking outside
            document.addEventListener('click', function(e) {
                const searchContainer = document.querySelector('.search-container');
                if (!searchContainer.contains(e.target)) {
                    hideSearchResults();
                }
            });

            // Expose saveSearchedPlace to global scope for onclick
            window.saveSearchedPlace = saveSearchedPlace;

            // Load places when page loads
            initializePlaces();



// Expenses Tracker
//Currency Converter
const apiKey = '98c0c25b199a6cab58f3e536'; // 🔁 Replace with your key

async function loadCurrencies() {
  try {
    const response = await fetch('https://api.apilayer.com/exchangerates_data/latest?base=USD', {
      headers: {
        'apikey': apiKey
      }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const currencies = Object.keys(data.rates);

    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');

    currencies.forEach(currency => {
      const option1 = new Option(currency, currency);
      const option2 = new Option(currency, currency);
      fromSelect.add(option1);
      toSelect.add(option2);
    });

    fromSelect.value = 'USD';
    toSelect.value = 'INR';
  } catch (error) {
    console.error('Failed to load currencies:', error);
    document.getElementById('result').textContent = 'Failed to load currencies';
  }
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('from-currency').value;
  const to = document.getElementById('to-currency').value;

  if (!amount || isNaN(amount)) {
    alert("Enter a valid amount.");
    return;
  }

  try {
    const url = `https://api.apilayer.com/exchangerates_data/latest?base=${from}`;
    const response = await fetch(url, {
      headers: {
        'apikey': apiKey
      }
    });

    const data = await response.json();
    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);

    document.getElementById('result').textContent = `${amount} ${from} = ${converted} ${to}`;
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCurrencies);

