// Global variables to store wallet balance and transaction history
let walletBalance;
let transactionHistory;
let currentUser;
const API_URL = 'http://localhost:3000/api'; // Our new backend API URL

// Function to handle login with a dummy user
async function handleLogin() {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    
    if (username && password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('loggedInUser', username);
                window.location.href = "dashboard.html";
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Could not connect to the server.");
        }
    } else {
        alert("Please enter both a username and a password.");
    }
}

// Function to handle registration
async function handleRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert("Could not connect to the server.");
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Function to load wallet data from the API
async function loadWalletData() {
    currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) {
        walletBalance = 0;
        transactionHistory = [];
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser, password: 'dummy_password' }) // Use a dummy password for this example
        });
        
        if (response.ok) {
            const userData = await response.json();
            walletBalance = userData.balance;
            transactionHistory = userData.history;
            updateWalletDisplay();
            loadTransactionHistory();
        } else {
            console.error("Failed to load user data from API.");
        }
    } catch (error) {
        console.error("Error connecting to API:", error);
    }
}

// Function to update the wallet balance display
function updateWalletDisplay() {
    const balanceEl = document.getElementById('wallet-balance');
    if (balanceEl) {
        balanceEl.innerText = `₹ ${walletBalance.toFixed(2)}`;
    }
}

// Function to handle dummy form submissions
async function handleDummyFormSubmit(event, serviceType, amount, fields = {}) {
    event.preventDefault();

    const username = localStorage.getItem('loggedInUser');
    if (!username) {
        alert("Please log in to make a transaction.");
        return;
    }

    const amountNum = parseFloat(amount);
    
    try {
        const response = await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                service: serviceType,
                amount: amountNum,
                transactionDetails: fields
            })
        });

        const result = await response.json();

        if (response.ok) {
            walletBalance = result.newBalance;
            loadWalletData();
            showSuccessMessageAndReceipt({ serviceType, amount: amountNum, fields, id: 'API_TXN_' + Math.floor(Math.random() * 100000) });
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Transaction error:', error);
        alert("Could not complete the transaction. Server error.");
    }
}

// Helper function to show a success message and receipt
function showSuccessMessageAndReceipt(details) {
    const formContainer = document.getElementById('service-form-container');
    const today = new Date().toLocaleDateString('en-IN');
    let receiptContent = `<div class="receipt-print-area"><h3>Receipt</h3><p><strong>Transaction ID:</strong> ${details.id}</p><p><strong>Date:</strong> ${today}</p><p><strong>Service:</strong> ${details.serviceType}</p><p><strong>Amount:</strong> ₹ ${details.amount !== 'N/A' ? parseFloat(details.amount).toFixed(2) : 'N/A'}</p><p><strong>Status:</strong> Successful</p>`;
    for (const key in details.fields) {
        if (details.fields.hasOwnProperty(key)) {
            receiptContent += `<p><strong>${key}:</strong> ${details.fields[key]}</p>`;
        }
    }
    receiptContent += `</div>`;
    formContainer.innerHTML = `<div class="success-message-container"><h3>Transaction Successful!</h3><p>Your request has been processed successfully.</p><div class="receipt">${receiptContent}</div><button onclick="window.print()" class="cta-btn" style="margin-top: 20px;">Print Receipt</button><a href="dashboard.html" class="cta-btn" style="margin-top: 20px;">Go to Dashboard</a></div>`;
}

// Helper function to create a dropdown menu from an array
const mobileOperators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
const dthOperators = ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'];
const billerCategories = ['Electricity', 'Water', 'Gas', 'Broadband'];
const bankNames = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

function createDropdown(name, options) {
    let selectHtml = `<select name="${name}" required><option value="">Select ${name.replace('_', ' ')}</option>`;
    options.forEach(option => { selectHtml += `<option value="${option}">${option}</option>`; });
    selectHtml += `</select>`;
    return selectHtml;
}

// Function to update the service form on the services page
function loadServiceForm() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('service');
    const subServiceType = params.get('subservice');
    const formContainer = document.getElementById('service-form-container');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("Please log in to access services.");
        window.location.href = "login.html";
        return;
    }
    
    let formContent = '';
    let formTitle = '';

    switch(serviceType) {
        case 'recharge':
            formTitle = 'Recharge Services';
            if (subServiceType === 'mobile') {
                formTitle = 'Mobile Recharge';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Mobile Recharge', 199, {'Mobile No.': this.mobile_no.value, 'Operator': this.operator.value})"><label>Mobile Number:</label><input type="tel" name="mobile_no" placeholder="Enter 10-digit mobile number" required><label>Operator:</label>${createDropdown('operator', mobileOperators)}<label>Amount:</label><input type="number" name="amount" value="199" readonly><button type="submit">Pay ₹199</button></form>`;
            } else if (subServiceType === 'dth') {
                formTitle = 'DTH Recharge';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'DTH Recharge', 300, {'Operator ID': this.dth_id.value, 'Operator': this.operator.value})"><label>Operator ID:</label><input type="text" name="dth_id" placeholder="Enter Operator ID" required><label>Operator:</label>${createDropdown('operator', dthOperators)}<label>Amount:</label><input type="number" name="amount" value="300" readonly><button type="submit">Pay ₹300</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=recharge&subservice=mobile" class="sub-service-btn">Mobile</a><a href="services.html?service=recharge&subservice=dth" class="sub-service-btn">DTH</a></div>`; }
            break;
        case 'billpay':
            formTitle = 'Bill Payments';
            if (subServiceType) {
                formTitle = `${subServiceType} Bill Payment`;
                formContent = `<form onsubmit="handleDummyFormSubmit(event, '${subServiceType} Bill Payment', 850, {'Customer ID': this.customer_id.value, 'State': this.state.value, 'Biller Type': '${subServiceType}'})"><label>Customer ID:</label><input type="text" name="customer_id" placeholder="Enter Customer/Bill ID" required><label>State:</label>${createDropdown('state', states)}<label>Amount:</label><input type="number" name="amount" value="850" readonly><button type="submit">Pay ₹850</button></form>`;
            } else { formContent = `<div class="sub-service-buttons">${billerCategories.map(cat => `<a href="services.html?service=billpay&subservice=${cat}" class="sub-service-btn">${cat}</a>`).join('')}</div>`; }
            break;
        case 'aeps':
            formTitle = 'AEPS (Aadhaar Enabled Payment System)';
            if (subServiceType === 'cash-withdrawal') {
                formTitle = 'Cash Withdrawal';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'AEPS Cash Withdrawal', this.amount.value, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})"><label>Aadhaar Number:</label><input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required><label>Bank Name:</label>${createDropdown('bank_name', bankNames)}<label>Amount:</label><input type="number" name="amount" placeholder="Enter amount to withdraw" required><button type="submit">Withdraw Cash</button></form>`;
            } else if (subServiceType === 'balance-inquiry') {
                formTitle = 'Balance Inquiry';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'AEPS Balance Inquiry', null, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})"><label>Aadhaar Number:</label><input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required><label>Bank Name:</label>${createDropdown('bank_name', bankNames)}<button type="submit">Check Balance</button></form>`;
            } else if (subServiceType === 'deposit') {
                formTitle = 'Cash Deposit';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'AEPS Cash Deposit', this.amount.value, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})"><label>Aadhaar Number:</label><input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required><label>Bank Name:</label>${createDropdown('bank_name', bankNames)}<label>Amount:</label><input type="number" name="amount" placeholder="Enter amount to deposit" required><button type="submit">Deposit Cash</button></form>`;
            } else if (subServiceType === 'ministatement') {
                formTitle = 'Mini Statement';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'AEPS Mini Statement', null, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})"><label>Aadhaar Number:</label><input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required><label>Bank Name:</label>${createDropdown('bank_name', bankNames)}<button type="submit">Get Mini Statement</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=aeps&subservice=cash-withdrawal" class="sub-service-btn">Cash Withdrawal</a><a href="services.html?service=aeps&subservice=balance-inquiry" class="sub-service-btn">Balance Inquiry</a><a href="services.html?service=aeps&subservice=deposit" class="sub-service-btn">Cash Deposit</a><a href="services.html?service=aeps&subservice=ministatement" class="sub-service-btn">Mini Statement</a></div>`; }
            break;
        case 'pancard':
            formTitle = 'PAN Card Service';
            if (subServiceType === 'new-pan') {
                formTitle = 'New PAN Card Application';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'New PAN Card', null)"><label>Full Name:</label><input type="text" placeholder="Enter Full Name" required><label>Date of Birth:</label><input type="date" required><button type="submit">Submit Application</button></form>`;
            } else if (subServiceType === 'correction-pan') {
                formTitle = 'PAN Card Correction';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'PAN Card Correction', null)"><label>Current PAN No.:</label><input type="text" placeholder="Enter existing PAN number" required><label>Field to correct:</label><input type="text" placeholder="e.g., Name, DOB" required><button type="submit">Submit Correction</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=pancard&subservice=new-pan" class="sub-service-btn">New PAN Card</a><a href="services.html?service=pancard&subservice=correction-pan" class="sub-service-btn">Correction PAN</a></div>`; }
            break;
        case 'passport':
            formTitle = 'Passport Service';
            if (subServiceType === 'new-passport') {
                formTitle = 'New Passport';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'New Passport', null)"><label>Full Name:</label><input type="text" placeholder="Enter Full Name" required><label>Address:</label><input type="text" placeholder="Enter Address" required><button type="submit">Submit Application</button></form>`;
            } else if (subServiceType === 'renewal') {
                formTitle = 'Passport Renewal';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Passport Renewal', null)"><label>Current Passport No.:</label><input type="text" placeholder="Enter current Passport No." required><label>Date of Expiry:</label><input type="date" required><button type="submit">Submit Renewal</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=passport&subservice=new-passport" class="sub-service-btn">New Passport</a><a href="services.html?service=passport&subservice=renewal" class="sub-service-btn">Renewal</a></div>`; }
            break;
        case 'insurance':
            formTitle = 'Insurance Service';
            if (subServiceType === 'bike') {
                formTitle = 'Bike Insurance';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Bike Insurance', null)"><label>Vehicle Number:</label><input type="text" placeholder="Enter bike number" required><label>Policy Type:</label><select required><option value="">Select Type</option><option value="Third-Party">Third-Party</option><option value="Comprehensive">Comprehensive</option></select><button type="submit">Get a Quote</button></form>`;
            } else if (subServiceType === 'car') {
                formTitle = 'Car Insurance';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Car Insurance', null)"><label>Vehicle Number:</label><input type="text" placeholder="Enter car number" required><label>Policy Type:</label><select required><option value="">Select Type</option><option value="Third-Party">Third-Party</option><option value="Comprehensive">Comprehensive</option></select><button type="submit">Get a Quote</button></form>`;
            } else if (subServiceType === 'commercial-vehicle') {
                formTitle = 'Commercial Vehicle Insurance';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Commercial Vehicle Insurance', null)"><label>Vehicle Number:</label><input type="text" placeholder="Enter vehicle number" required><label>Vehicle Type:</label><input type="text" placeholder="e.g., Truck, Bus" required><button type="submit">Get a Quote</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=insurance&subservice=bike" class="sub-service-btn">Bike</a><a href="services.html?service=insurance&subservice=car" class="sub-service-btn">Car</a><a href="services.html?service=insurance&subservice=commercial-vehicle" class="sub-service-btn">Commercial Vehicle</a></div>`; }
            break;
        case 'account-opening':
            formTitle = 'Account Opening Service';
            if (subServiceType === 'savings') {
                formTitle = 'Savings Account';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Savings Account Opening', null)"><label>Full Name:</label><input type="text" placeholder="Enter your full name" required><label>Mobile Number:</label><input type="tel" placeholder="Enter mobile number" required><button type="submit">Open Account</button></form>`;
            } else if (subServiceType === 'current') {
                formTitle = 'Current Account';
                formContent = `<form onsubmit="handleDummyFormSubmit(event, 'Current Account Opening', null)"><label>Business Name:</label><input type="text" placeholder="Enter business name" required><label>Contact Person:</label><input type="text" placeholder="Enter your name" required><button type="submit">Open Account</button></form>`;
            } else { formContent = `<div class="sub-service-buttons"><a href="services.html?service=account-opening&subservice=savings" class="sub-service-btn">Savings Account</a><a href="services.html?service=account-opening&subservice=current" class="sub-service-btn">Current Account</a></div>`; }
            break;
        default:
            formTitle = 'Select a Service';
            formContent = '<p>Please select a service from the list to view its details and form.</p>';
    }
    formContainer.innerHTML = `<h2>${formTitle}</h2><div class="form-content">${formContent}</div>`;
    updateWalletDisplay();
}

// Function to load transaction history on dashboard
function loadTransactionHistory() {
    const historyContainer = document.getElementById('transaction-history-list');
    if (!historyContainer) return;

    if (transactionHistory.length === 0) {
        historyContainer.innerHTML = '<p>No transactions found.</p>';
        return;
    }

    let historyHtml = '<ul class="history-list">';
    transactionHistory.slice().reverse().forEach(transaction => {
        const amountDisplay = (transaction.amount === 'N/A') ? 'N/A' : `₹ ${parseFloat(transaction.amount).toFixed(2)}`;
        historyHtml += `
            <li class="history-item">
                <span class="history-service">${transaction.service}</span>
                <span class="history-amount">${amountDisplay}</span>
                <span class="history-date">${transaction.date}</span>
            </li>
        `;
    });
    historyHtml += '</ul>';
    historyContainer.innerHTML = historyHtml;
}

// Event listeners for different pages
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'login-page') {
        document.querySelector('.form-container form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (document.body.id === 'register-page') {
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegistration();
        });
    }

    if (document.body.id === 'dashboard-page') {
        const username = localStorage.getItem('loggedInUser');
        if (!username) {
            window.location.href = "login.html";
            return;
        }
        const welcomeEl = document.getElementById('welcome-user-name');
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, ${username}!`;
        }
        
        loadWalletData();
        
        const topupButton = document.getElementById('topup-button');
        if (topupButton) {
            topupButton.addEventListener('click', () => {
                const topupAmount = prompt("Enter amount to top up:");
                const amount = parseFloat(topupAmount);
                if (!isNaN(amount) && amount > 0) {
                    walletBalance += amount;
                    updateWalletDisplay();
                    alert(`₹${amount} has been added to your wallet!`);
                } else if (amount <= 0) {
                    alert("Please enter a valid amount greater than 0.");
                } else {
                    alert("Top-up cancelled.");
                }
            });
        }
        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    }
    
    if (document.body.id === 'services-page') {
        loadWalletData();
        loadServiceForm();
    }
});