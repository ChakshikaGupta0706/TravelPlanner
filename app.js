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


//Saving Planned Trips
function saveTrip() {
    const destination = document.getElementById("destination").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const thoughts = document.getElementById("local-tips").value;

    const tripCard = document.createElement("div");
    tripCard.classList.add("tripCard");
    tripCard.innerHTML = `
      <img src="#" alt="${destination} Image">
      <label class="heartcheckbox"><input type="checkbox"/><i class="fa-regular fa-heart unchecked"></i><i class="fa-solid fa-heart checked"></i></label>
      <div class="tripdetails">
        <h3>${destination}</h3>
        <div class="date">Planned for: ${startDate} to ${endDate}</div>
        <div class="thoughts">${thoughts}</div>
      </div>
    `;

    document.getElementById("savedTrips").appendChild(tripCard);
}