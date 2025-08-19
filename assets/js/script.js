document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const dashboard = document.getElementById('dashboard');
    const walletBalanceElement = document.getElementById('wallet-balance');
    const transactionHistoryList = document.getElementById('transaction-history-list');
    const topupForm = document.getElementById('topup-form');
    const serviceContainer = document.getElementById('service-form-container');
    const servicesList = document.getElementById('services-list');
    
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        fetchUserData(storedUsername);
    } else {
        // Redirect to login if on a protected page
        const protectedPages = ['dashboard.html', 'services.html'];
        if (protectedPages.includes(window.location.pathname.split('/').pop())) {
            window.location.href = 'login.html';
        }
    }
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('username', username);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Server error. Please try again later.');
            }
        });
    }

    // Registration form handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = registerForm.username.value;
            const password = registerForm.password.value;
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    window.location.href = 'login.html';
                }
            } catch (error) {
                alert('Server error. Please try again later.');
            }
        });
    }

    // Fetch user data from the server
    async function fetchUserData(username) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: '' }) // Password not needed for data fetch
            });
            
            if (response.ok) {
                const data = await response.json();
                updateUI(data);
            } else {
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        }
    }
    
    // Update dashboard UI
    function updateUI(data) {
        if (walletBalanceElement) {
            walletBalanceElement.textContent = `₹ ${data.balance.toFixed(2)}`;
        }
        if (transactionHistoryList) {
            displayTransactionHistory(data.history);
        }
    }
    
    // Display transaction history
    function displayTransactionHistory(history) {
        if (transactionHistoryList) {
            transactionHistoryList.innerHTML = '';
            history.forEach(transaction => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Service:</strong> ${transaction.service}<br>
                    <strong>Amount:</strong> ₹${transaction.amount.toFixed(2)}<br>
                    <strong>Date:</strong> ${transaction.date}<br>
                    <strong>Status:</strong> ${transaction.status}
                `;
                transactionHistoryList.appendChild(li);
            });
        }
    }

    // Top-up form handler
    if (topupForm) {
        topupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = localStorage.getItem('username');
            const amount = parseFloat(topupForm.amount.value);
            
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
            
            try {
                const response = await fetch('/api/topup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, amount })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert('Top-up successful!');
                    walletBalanceElement.textContent = `₹ ${data.newBalance.toFixed(2)}`;
                    topupForm.reset();
                    fetchUserData(username); // Refresh history
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Server error. Please try again later.');
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }

    // Render service forms dynamically
    if (servicesList && serviceContainer) {
        servicesList.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const service = e.target.textContent;
                renderServiceForm(service);
            }
        });
    }

    function renderServiceForm(service) {
        const form = document.createElement('form');
        form.id = 'service-form';
        let formContent = '';
        
        // Define form fields for different services
        switch (service) {
            case 'Mobile Recharge':
                formContent = `
                    <h2>${service}</h2>
                    <label for="mobile-number">Mobile Number:</label>
                    <input type="tel" id="mobile-number" placeholder="Enter 10-digit mobile number" required>
                    <label for="operator">Operator:</label>
                    <select id="operator" required>
                        <option value="">Select operator</option>
                        <option value="Jio">Jio</option>
                        <option value="Airtel">Airtel</option>
                        <option value="Vodafone Idea">Vodafone Idea</option>
                        <option value="BSNL">BSNL</option>
                    </select>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" required>
                    <button type="submit">Pay</button>
                `;
                break;
            case 'DTH Recharge':
                formContent = `
                    <h2>${service}</h2>
                    <label for="dth-number">DTH Number:</label>
                    <input type="text" id="dth-number" placeholder="Enter DTH number" required>
                    <label for="dth-provider">Provider:</label>
                    <select id="dth-provider" required>
                        <option value="">Select provider</option>
                        <option value="Tata Sky">Tata Sky</option>
                        <option value="Airtel Digital TV">Airtel Digital TV</option>
                        <option value="Dish TV">Dish TV</option>
                        <option value="Sun Direct">Sun Direct</option>
                    </select>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" required>
                    <button type="submit">Pay</button>
                `;
                break;
            case 'Electricity Bill Payment':
            case 'Water Bill Payment':
            case 'Gas Bill Payment':
            case 'Broadband Bill Payment':
                formContent = `
                    <h2>${service}</h2>
                    <label for="bill-number">Bill Number:</label>
                    <input type="text" id="bill-number" placeholder="Enter bill number" required>
                    <label for="provider">Provider:</label>
                    <input type="text" id="provider" placeholder="Enter provider name" required>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" required>
                    <button type="submit">Pay</button>
                `;
                break;
            case 'AEPS Cash Withdrawal':
            case 'AEPS Cash Deposit':
                formContent = `
                    <h2>${service}</h2>
                    <label for="aadhaar">Aadhaar Number:</label>
                    <input type="tel" id="aadhaar" pattern="[0-9]{12}" placeholder="Enter 12-digit Aadhaar" required>
                    <label for="bank">Bank Name:</label>
                    <input type="text" id="bank" placeholder="Enter bank name" required>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" required>
                    <button type="submit">Proceed</button>
                `;
                break;
            case 'AEPS Balance Inquiry':
            case 'AEPS Mini Statement':
                formContent = `
                    <h2>${service}</h2>
                    <label for="aadhaar">Aadhaar Number:</label>
                    <input type="tel" id="aadhaar" pattern="[0-9]{12}" placeholder="Enter 12-digit Aadhaar" required>
                    <label for="bank">Bank Name:</label>
                    <input type="text" id="bank" placeholder="Enter bank name" required>
                    <button type="submit">Proceed</button>
                `;
                break;
            case 'New PAN Card':
            case 'Correction PAN':
                formContent = `
                    <h2>${service}</h2>
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" placeholder="Enter full name" required>
                    <label for="amount">Fees:</label>
                    <input type="number" id="amount" value="${service === 'New PAN Card' ? 25 : 15}" readonly>
                    <button type="submit">Apply</button>
                `;
                break;
            case 'New Passport':
            case 'Passport Renewal':
                formContent = `
                    <h2>${service}</h2>
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" placeholder="Enter full name" required>
                    <label for="amount">Fees:</label>
                    <input type="number" id="amount" value="${service === 'New Passport' ? 50 : 30}" readonly>
                    <button type="submit">Apply</button>
                `;
                break;
            case 'Bike Insurance':
            case 'Car Insurance':
            case 'Commercial Vehicle Insurance':
                formContent = `
                    <h2>${service}</h2>
                    <label for="vehicle-number">Vehicle Number:</label>
                    <input type="text" id="vehicle-number" placeholder="Enter vehicle number" required>
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" required>
                    <button type="submit">Pay</button>
                `;
                break;
            case 'Savings Account Opening':
            case 'Current Account Opening':
                formContent = `
                    <h2>${service}</h2>
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" placeholder="Enter full name" required>
                    <label for="amount">Fees:</label>
                    <input type="number" id="amount" value="${service === 'Savings Account Opening' ? 10 : 20}" readonly>
                    <button type="submit">Apply</button>
                `;
                break;
            default:
                formContent = `<h2>Service Not Found</h2>`;
                break;
        }

        serviceContainer.innerHTML = formContent;
        const serviceForm = document.getElementById('service-form');
        
        if (serviceForm) {
            serviceForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = localStorage.getItem('username');
                const amountInput = document.getElementById('amount');
                const amount = amountInput ? parseFloat(amountInput.value) : 0;
                
                const transactionDetails = {};
                const inputs = serviceForm.querySelectorAll('input, select');
                inputs.forEach(input => {
                    transactionDetails[input.id] = input.value;
                });
                
                try {
                    const response = await fetch('/api/transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, service, amount, transactionDetails })
                    });
                    
                    const data = await response.json();
                    if (response.ok) {
                        alert(data.message);
                        fetchUserData(username); // Refresh balance and history
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    alert('Transaction failed. Server error.');
                }
            });
        }
    }
});
