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
            messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
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
            const activity = activityInput.value.trim();
            if (activity && !activities.includes(activity)) {
                activities.push(activity);
                activityInput.value = '';
                renderActivities();
            }
        }
        
        // Remove activity
        function removeActivity(index) {
            activities.splice(index, 1);
            renderActivities();
        }
        
        // Render activities
        function renderActivities() {
            activitiesContainer.innerHTML = activities.map((activity, index) => 
                `<span class="activity-tag">${activity}<span class="remove-activity" onclick="removeActivity(${index})">×</span></span>`
            ).join('');
        }
        
        // Allow Enter key to add activity
        activityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addActivity();
            }
        });
        
        // Create trip card HTML
        function createTripCard(trip) {
            const imageUrl = trip.image?.trim() || 'https://via.placeholder.com/300x200?text=No+Image';
            return `
                <div class="tripCard">
                   <img src="${imageUrl}" alt="${trip.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found';">
                   <label class="heartcheckbox"><input type="checkbox"/><i class="fa-regular fa-heart unchecked"></i><i class="fa-solid fa-heart checked"></i></label>
                   <div class="tripdetails">
                   <h3>${trip.destination}</h3>
                   <div class="date">Planned for: ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)} </div>
                   <div class="thoughts">${trip.localTips}</div>
                   </div>
                </div>
            `;
        }
        
        // Fetch and display trips
        async function fetchTrips() {
            try {
                const response = await fetch(API_BASE);
                const result = await response.json();
                
                if (result.success) {
                    if (result.data.length === 0) {
                        tripsContainer.innerHTML = '<div class="no-trips">No trips found. Add your first trip above!</div>';
                    } else {
                        tripsContainer.innerHTML = result.data.map(createTripCard).join('');
                    }
                } else {
                    tripsContainer.innerHTML = '<div class="error">Error loading trips</div>';
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
                tripsContainer.innerHTML = '<div class="error">Error loading trips</div>';
            }
        }
        
        // Add new trip
        async function addTrip(tripData) {
            try {
                const response = await fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tripData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Trip added successfully!', 'success');
                    tripForm.reset();
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

    if (document.getElementById('tripForm')) {
        initializeTheme();
        fetchTrips();
        tripForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(tripForm);
            const tripData = {
                title: formData.get('title'),
                destination: formData.get('destination'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                budget: formData.get('budget') ? parseFloat(formData.get('budget')) : undefined,
                image: formData.get('image') || undefined,
                activities: activities,
                localTips: formData.get('localTips') || undefined
            };
            
            // Basic validation
            if (new Date(tripData.startDate) >= new Date(tripData.endDate)) {
                showMessage('End date must be after start date', 'error');
                return;
            }
            
            await addTrip(tripData);
        });
    };

    if (document.getElementById('tripsContainer')) {
        fetchTrips();
    };
        
        // Make functions available globally
        window.deleteTrip = deleteTrip;
        window.addActivity = addActivity;
        window.removeActivity = removeActivity;
        
        // Load trips when page loads
        document.addEventListener('DOMContentLoaded', fetchTrips);