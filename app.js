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


//To add the attractions to the list
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('attraction-input');
  const button = document.getElementById('add-attraction-btn');
  const list = document.getElementById('attraction-list');

  const addAttraction = () => {
    const value = input.value.trim();
    if (value !== '') {
      const li = document.createElement('li');
      li.textContent = value;
      list.appendChild(li);
      input.value = '';
    }
  };

  button.addEventListener('click', addAttraction);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addAttraction();
    }
  });
});
