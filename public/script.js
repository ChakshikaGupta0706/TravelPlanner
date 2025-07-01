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

let expenses = [];

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('passform');
    const tableBody = document.getElementById('tableBody');
    const noExpensesSection = document.getElementById('no-expenses');

    const renderExpenses = (expenseList) => {
        tableBody.innerHTML = '';

        if (expenseList.length === 0) {
            noExpensesSection.style.display = 'block';
            return;
        }

        noExpensesSection.style.display = 'none';

        expenseList.forEach((exp, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
               <td>${exp.item}</td>
               <td>${exp.spenddate}</td>
               <td>${exp.category}</td>
               <td>${parseFloat(exp.price).toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const item = document.getElementById('item').value;
        const category = document.getElementById('category').value;
        const spenddate = document.getElementById('spenddate').value;
        const price = document.getElementById('price').value;

        expenses.push({item, category, spenddate, price});
        renderExpenses(expenses);
        expenseForm.reset();
    });
    renderExpenses(expenses);
});