// theme toggle
const themeSwitch = document.getElementById('theme-icon');

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
    localStorage.setItem('theme', newTheme);
};

const updateThemeIcon = (theme) => {
    const icon = themeSwitch.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

document.addEventListener('DOMContentLoaded', initializeTheme);
if (themeSwitch) themeSwitch.addEventListener('click', toggleTheme);

// Utilities
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-IN');
}

//authentication forms
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

// Handle Signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Signup successful! Please login.");
      signupForm.style.display = "none";
      signupError.textContent = "";
    } else {
      signupError.textContent = result.message || "Signup failed.";
    }
  } catch (err) {
    signupError.textContent = "Server error. Try again.";
  }
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Login successful!");
      localStorage.setItem("token", result.token); // optional
      window.location.href = "/index.html";   // redirect after login
    } else {
      loginError.textContent = result.message || "Login failed.";
    }
  } catch (err) {
    loginError.textContent = "Server error. Try again.";
  }
});

function toggleForms(showSignup) {
    signupForm.style.display = showSignup ? "block" : "none";
    loginForm.style.display = showSignup ? "none" : "block";
};

function logout() {
    localStorage.removeItem("token");
    window.location.replace("/auth.html");
}
const currentPage = window.location.pathname;
if (
  ['/savedtrips.html', '/trip.html', '/profile.html', '/index.html'].includes(currentPage) &&
  !localStorage.getItem("token")
) {
  window.location.href = "/auth.html";
}

// Global variables
const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get('tripId');
let expenses = [];
let dayCount = 0;
let days = [];

async function loadTripDetails(tripId) {
    try {
        const response = await fetch(`/api/tripDetails/combined/${tripId}`);
        const result = await response.json();
        if (!result.success) throw new Error('Trip fetch failed');

        const {trip, tripDetails} = result.data;

        document.getElementById('title').textContent = trip.title || 'Trip';
        document.getElementById('destination').textContent = trip.destination || 'Trip';
        document.getElementById('time').textContent = `Date: ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}`;
        document.getElementById('travelers').textContent = `Travelling with: ${trip.travelers|| 'N/A'}`;
        document.querySelector('#info img').src = trip.image || 'https://via.placeholder.com/400x200?text=No+Image';

        const listContainer = document.querySelector('#files ul');
        listContainer.innerHTML = (tripDetails.packingList || []).map(item => `<li>${item}</li><br>`).join('');

        document.getElementById('hotelname').value = tripDetails.hotelName || '';
        document.getElementById('review').value = tripDetails.stayReview || '';

        const attractionList = document.getElementById('attraction-list');
        attractionList.innerHTML = '';
        (tripDetails.attractions || []).forEach(addAttractionToDOM);

        expenses = tripDetails.expenses || [];
        renderExpenses(expenses);

        days = [];
        dayCount = 0;
        (tripDetails.itinerary || []).forEach(dayObj => {
            dayCount++;
            days.push({ id: dayCount, activities: dayObj.activities });
        });
        renderDays();
        toggleDay(1);

    } catch (error) {
        console.error('Error loading trip:', error);
    }
}

if (tripId) {loadTripDetails(tripId)};

function addAttraction() {
    const input = document.getElementById('attraction-input');
    if (input.value.trim()) {
        addAttractionToDOM(input.value.trim());
        input.value = '';
    }
}

function addAttractionToDOM(name) {
    const ul = document.getElementById('attraction-list');
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
}

// Save trip details
const saveBtn = document.getElementById('savetripdetails');
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        const data = {
            hotelName: document.getElementById('hotelname').value,
            stayReview: document.getElementById('review').value,
            packingList: Array.from(document.querySelectorAll('#files ul li')).map(li => li.textContent.trim()),
            attractions: Array.from(document.querySelectorAll('#attraction-list li')).map(li => li.textContent.trim()),
            expenses: collectExpenses(),
            itinerary: collectItinerary()
        };

        try {
            const response = await fetch(`/api/tripDetails/${tripId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.success ? 'Trip details saved!' : 'Error saving trip.');
        } catch (err) {
            console.error('Save error:', err);
        }
    });
}

function collectExpenses() {
    return Array.from(document.querySelectorAll('#table tbody tr')).map(row => ({
        item: row.cells[0].textContent,
        date: new Date(row.cells[1].textContent),
        category: row.cells[2].textContent,
        amount: row.cells[3].textContent
    }));
}

function collectItinerary() {
    return days.map((day, index) => ({
        day: index + 1,
        activities: [...day.activities]
    }));
}

// Expense tracker
const expenseForm = document.getElementById('passform');
const tableBody = document.getElementById('tableBody');
const noExpensesSection = document.getElementById('no-expenses');

function renderExpenses(list) {
    tableBody.innerHTML = '';
    if (list.length === 0) {
        noExpensesSection.style.display = 'block';
        return;
    }
    noExpensesSection.style.display = 'none';
    list.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exp.item}</td>
            <td>${exp.spenddate || exp.date}</td>
            <td>${exp.category}</td>
            <td>${parseFloat(exp.price || exp.amount).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

if (expenseForm) {
    expenseForm.addEventListener('submit', e => {
        e.preventDefault();
        const item = document.getElementById('item').value;
        const category = document.getElementById('category').value;
        const spenddate = document.getElementById('spenddate').value;
        const price = document.getElementById('price').value;
        expenses.push({ item, category, date: spenddate, amount: parseFloat(price) });
        renderExpenses(expenses);
        expenseForm.reset();
    });
}

// Itinerary logic
function addDay(dayNum = null, activities = []) {
    dayCount++;
    const dayData = { id: dayNum || dayCount, activities };
    days.push(dayData);
    renderDays();
}

function toggleDay(dayId) {
    days.forEach(day => {
        const content = document.getElementById(`day-content-${day.id}`);
        const header = document.getElementById(`day-header-${day.id}`);
        const icon = document.getElementById(`toggle-icon-${day.id}`);
        if (day.id === dayId) {
            content.classList.toggle('active');
            header.classList.toggle('active');
            icon.classList.toggle('rotated');
        } else {
            content?.classList.remove('active');
            header?.classList.remove('active');
            icon?.classList.remove('rotated');
        }
    });
}

function addActivity(dayId) {
    const input = document.getElementById(`activity-input-${dayId}`);
    const activity = input.value.trim();
    if (activity) {
        const day = days.find(d => d.id === dayId);
        day.activities.push(activity);
        input.value = '';
        renderDay(dayId);
    }
}

function deleteActivity(dayId, activityIndex) {
    const day = days.find(d => d.id === dayId);
    day.activities.splice(activityIndex, 1);
    renderDay(dayId);
}

function renderDay(dayId) {
    const day = days.find(d => d.id === dayId);
    const dayInner = document.getElementById(`day-inner-${dayId}`);
    let html = '';
    if (day.activities.length === 0) {
        html = '<div class="empty-state">No activities planned yet. Add some activities below!</div>';
    } else {
        html = '<ul class="activity-list">';
        day.activities.forEach((activity, index) => {
            html += `
                <li class="activity-item">
                    <span class="activity-text">${activity}</span>
                    <button class="delete-btn" onclick="deleteActivity(${dayId}, ${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `;
        });
        html += '</ul>';
    }
    dayInner.innerHTML = html + `
        <div class="add-activity">
            <input type="text" id="activity-input-${dayId}" placeholder="Add new activity..." onkeypress="if(event.key==='Enter') addActivity(${dayId})">
            <button onclick="addActivity(${dayId})">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    `;
}

function renderDays() {
    const container = document.getElementById('days-container');
    container.innerHTML = '';
    days.forEach(day => {
        container.innerHTML += `
            <div class="day-section">
                <div class="day-header" id="day-header-${day.id}" onclick="toggleDay(${day.id})">
                    <div class="day-number">
                        <i class="fas fa-calendar-day"></i>
                        Day ${day.id}
                    </div>
                    <i class="fas fa-chevron-down toggle-icon" id="toggle-icon-${day.id}"></i>
                </div>
                <div class="day-content" id="day-content-${day.id}">
                    <div class="day-inner" id="day-inner-${day.id}"></div>
                </div>
            </div>
        `;
        renderDay(day.id);
    });
}

// Initialize Day 1 UI
addDay();
toggleDay(1);
