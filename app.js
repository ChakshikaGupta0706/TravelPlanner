// Theme Toggle
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Load saved theme
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            const themeIcon = document.getElementById('theme-icon');
            
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-sun';
            }
        }

        // Navigation
        function showDashboard() { 
            document.getElementById('dashboard-view').style.display = 'block';
            document.getElementById('newtrip-view').style.display = 'none';
            updateActiveNav(0);
        }

        function showNewTrip() {
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('newtrip-view').style.display = 'block';
            updateActiveNav(2);
        }

        function updateActiveNav(index) {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {