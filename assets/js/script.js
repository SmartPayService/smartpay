// Function to save wallet data to localStorage
function saveWalletData() {
    localStorage.setItem('walletBalance', JSON.stringify(walletBalance));
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
}

// Function to load wallet data from localStorage or set initial values
function loadWalletData() {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedHistory = localStorage.getItem('transactionHistory');

    if (savedBalance !== null) {
        walletBalance = JSON.parse(savedBalance);
    } else {
        walletBalance = 500; // Initial dummy balance
    }

    if (savedHistory !== null) {
        transactionHistory = JSON.parse(savedHistory);
    } else {
        transactionHistory = []; // Initial empty history
    }
}

// Dummy data for dropdowns (as if fetched from a database)
const mobileOperators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
const dthOperators = ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'];
const billerCategories = ['Electricity', 'Water', 'Gas', 'Broadband'];
const bankNames = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

// Function to update the wallet balance display
function updateWalletDisplay() {
    const balanceEl = document.getElementById('wallet-balance');
    if (balanceEl) {
        balanceEl.innerText = `₹ ${walletBalance.toFixed(2)}`;
    }
}

// Function to handle login with a dummy user
function handleLogin() {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    
    // Simple front-end validation (Not secure for real-world use)
    if (username && password) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter both a username and a password.");
    }
}

// Function to add a transaction to the history
function addTransactionToHistory(details) {
    transactionHistory.push({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN'),
        service: details.serviceType,
        amount: details.amount || 'N/A',
        status: 'Successful',
        fields: details.fields || {}
    });
    saveWalletData(); // Save data after every transaction
    console.log("Transaction Added:", transactionHistory);
}

// Function to show a success message and receipt
function showSuccessMessageAndReceipt(details) {
    const formContainer = document.getElementById('service-form-container');
    const today = new Date().toLocaleDateString('en-IN');

    // Dynamically generate receipt content based on transaction details
    let receiptContent = `
        <div class="receipt-print-area">
            <h3>Receipt</h3>
            <p><strong>Transaction ID:</strong> ${details.id}</p>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Service:</strong> ${details.serviceType}</p>
            <p><strong>Amount:</strong> ₹ ${details.amount !== 'N/A' ? parseFloat(details.amount).toFixed(2) : 'N/A'}</p>
            <p><strong>Status:</strong> Successful</p>
    `;

    // Add specific fields based on the service
    for (const key in details.fields) {
        if (details.fields.hasOwnProperty(key)) {
            receiptContent += `<p><strong>${key}:</strong> ${details.fields[key]}</p>`;
        }
    }

    receiptContent += `</div>`;

    formContainer.innerHTML = `
        <div class="success-message-container">
            <h3>Transaction Successful!</h3>
            <p>Your request has been processed successfully.</p>
            <div class="receipt">
                ${receiptContent}
            </div>
            <button onclick="window.print()" class="cta-btn" style="margin-top: 20px;">Print Receipt</button>
            <a href="dashboard.html" class="cta-btn" style="margin-top: 20px;">Go to Dashboard</a>
        </div>
    `;
}

// Function to handle dummy form submissions
function handleDummyFormSubmit(event, serviceType, amount, fields = {}) {
    event.preventDefault();
    
    const amountNum = parseFloat(amount);

    // Check if the service is a Cash Withdrawal.
    const isCashWithdrawal = serviceType === 'AEPS Cash Withdrawal';
    
    if (amountNum) {
        if (isCashWithdrawal) {
            // For Cash Withdrawal, money is added to the wallet.
            // (Assuming you have enough cash to give the customer)
            walletBalance += amountNum;
            alert(`Rs.${amountNum} has been added to your wallet (via Cash Withdrawal).`);
        } else if (walletBalance >= amountNum) {
            // For all other transactions (like recharge, bill payment), money is deducted.
            walletBalance -= amountNum;
        } else {
            // If it's a normal transaction and balance is insufficient.
            alert("Insufficient balance. Please top up your wallet.");
            return; // Stop the function here
        }

        updateWalletDisplay();
        saveWalletData(); // Save the updated balance
        
        const transactionDetails = {
            id: Math.floor(Math.random() * 1000000),
            serviceType,
            amount: amountNum,
            fields
        };
        addTransactionToHistory(transactionDetails);
        showSuccessMessageAndReceipt(transactionDetails);

    } else {
        // For services with no amount (like balance inquiry)
        const transactionDetails = {
            id: Math.floor(Math.random() * 1000000),
            serviceType,
            amount: 'N/A',
            fields
        };
        addTransactionToHistory(transactionDetails);
        showSuccessMessageAndReceipt(transactionDetails);
    }
}

// Helper function to create a dropdown menu from an array
function createDropdown(name, options) {
    let selectHtml = `<select name="${name}" required><option value="">Select ${name.replace('_', ' ')}</option>`;
    options.forEach(option => {
            selectHtml += `<option value="${option}">${option}</option>`;
        });
    selectHtml += `</select>`;
    return selectHtml;
}

// Function to update the service form on the services page
function loadServiceForm() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('service');
    const subServiceType = params.get('subservice');
    const formContainer = document.getElementById('service-form-container');
    
    // Check for user login
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("Please log in to access services.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    if (!serviceType || !formContainer) {
        // If no service is selected, show the main service grid
        formContainer.innerHTML = `
            <h2>All Services</h2>
            <div class="services-grid">
                <a href="services.html?service=recharge&subservice=mobile" class="service-item">
                    <i class="fas fa-mobile-alt"></i>
                    <p>Mobile Recharge</p>
                </a>
                <a href="services.html?service=billpay" class="service-item">
                    <i class="fas fa-bolt"></i>
                    <p>Bill Payments</p>
                </a>
                <a href="services.html?service=recharge&subservice=dth" class="service-item">
                    <i class="fas fa-tv"></i>
                    <p>DTH Recharge</p>
                </a>
                <a href="services.html?service=aeps" class="service-item">
                    <i class="fas fa-fingerprint"></i>
                    <p>AEPS</p>
                </a>
                <a href="services.html?service=pancard" class="service-item">
                    <i class="fas fa-id-card"></i>
                    <p>PAN Card</p>
                </a>
                <a href="services.html?service=passport" class="service-item">
                    <i class="fas fa-passport"></i>
                    <p>Passport</p>
                </a>
                <a href="services.html?service=insurance" class="service-item">
                    <i class="fas fa-car-crash"></i>
                    <p>Insurance</p>
                </a>
                <a href="services.html?service=account-opening" class="service-item">
                    <i class="fas fa-user-plus"></i>
                    <p>Account Opening</p>
                </a>
            </div>
        `;
        return;
    }

    let formContent = '';
    let formTitle = '';

    switch(serviceType) {
        case 'recharge':
            formTitle = 'Recharge Services';
            if (subServiceType === 'mobile') {
                formTitle = 'Mobile Recharge';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Mobile Recharge', 199, {'Mobile No.': this.mobile_no.value, 'Operator': this.operator.value})">
                        <label>Mobile Number:</label>
                        <input type="tel" name="mobile_no" placeholder="Enter 10-digit mobile number" required>
                        <label>Operator:</label>
                        ${createDropdown('operator', mobileOperators)}
                        <label>Amount:</label>
                        <input type="number" name="amount" value="199" readonly>
                        <button type="submit">Pay ₹199</button>
                    </form>`;
            } else if (subServiceType === 'dth') {
                formTitle = 'DTH Recharge';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'DTH Recharge', 300, {'Operator ID': this.dth_id.value, 'Operator': this.operator.value})">
                        <label>Operator ID:</label>
                        <input type="text" name="dth_id" placeholder="Enter Operator ID" required>
                        <label>Operator:</label>
                        ${createDropdown('operator', dthOperators)}
                        <label>Amount:</label>
                        <input type="number" name="amount" value="300" readonly>
                        <button type="submit">Pay ₹300</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=recharge&subservice=mobile" class="sub-service-btn">Mobile</a>
                        <a href="services.html?service=recharge&subservice=dth" class="sub-service-btn">DTH</a>
                    </div>
                `;
            }
            break;
        case 'billpay':
            formTitle = 'Bill Payments';
            if (subServiceType) {
                formTitle = `${subServiceType} Bill Payment`;
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, '${subServiceType} Bill Payment', 850, {'Customer ID': this.customer_id.value, 'State': this.state.value, 'Biller Type': '${subServiceType}'})">
                        <label>Customer ID:</label>
                        <input type="text" name="customer_id" placeholder="Enter Customer/Bill ID" required>
                        <label>State:</label>
                        ${createDropdown('state', states)}
                        <label>Amount:</label>
                        <input type="number" name="amount" value="850" readonly>
                        <button type="submit">Pay ₹850</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        ${billerCategories.map(cat => `<a href="services.html?service=billpay&subservice=${cat}" class="sub-service-btn">${cat}</a>`).join('')}
                    </div>
                `;
            }
            break;
        case 'aeps':
            formTitle = 'AEPS (Aadhaar Enabled Payment System)';
            if (subServiceType === 'cash-withdrawal') {
                formTitle = 'Cash Withdrawal';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'AEPS Cash Withdrawal', this.amount.value, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})">
                        <label>Aadhaar Number:</label>
                        <input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required>
                        <label>Bank Name:</label>
                        ${createDropdown('bank_name', bankNames)}
                        <label>Amount:</label>
                        <input type="number" name="amount" placeholder="Enter amount to withdraw" required>
                        <button type="submit">Withdraw Cash</button>
                    </form>`;
            } else if (subServiceType === 'balance-inquiry') {
                formTitle = 'Balance Inquiry';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'AEPS Balance Inquiry', null, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})">
                        <label>Aadhaar Number:</label>
                        <input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required>
                        <label>Bank Name:</label>
                        ${createDropdown('bank_name', bankNames)}
                        <button type="submit">Check Balance</button>
                    </form>`;
            } else if (subServiceType === 'deposit') {
                formTitle = 'Cash Deposit';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'AEPS Cash Deposit', this.amount.value, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})">
                        <label>Aadhaar Number:</label>
                        <input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required>
                        <label>Bank Name:</label>
                        ${createDropdown('bank_name', bankNames)}
                        <label>Amount:</label>
                        <input type="number" name="amount" placeholder="Enter amount to deposit" required>
                        <button type="submit">Deposit Cash</button>
                    </form>`;
            } else if (subServiceType === 'ministatement') {
                formTitle = 'Mini Statement';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'AEPS Mini Statement', null, {'Aadhaar No.': this.aadhaar_no.value, 'Bank': this.bank_name.value})">
                        <label>Aadhaar Number:</label>
                        <input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required>
                        <label>Bank Name:</label>
                        ${createDropdown('bank_name', bankNames)}
                        <button type="submit">Get Mini Statement</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=aeps&subservice=cash-withdrawal" class="sub-service-btn">Cash Withdrawal</a>
                        <a href="services.html?service=aeps&subservice=balance-inquiry" class="sub-service-btn">Balance Inquiry</a>
                        <a href="services.html?service=aeps&subservice=deposit" class="sub-service-btn">Cash Deposit</a>
                        <a href="services.html?service=aeps&subservice=ministatement" class="sub-service-btn">Mini Statement</a>
                    </div>
                `;
            }
            break;
        case 'pancard':
            formTitle = 'PAN Card Service';
            if (subServiceType === 'new-pan') {
                formTitle = 'New PAN Card Application';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'New PAN Card', null)">
                        <label>Full Name:</label>
                        <input type="text" placeholder="Enter Full Name" required>
                        <label>Date of Birth:</label>
                        <input type="date" required>
                        <button type="submit">Submit Application</button>
                    </form>`;
            } else if (subServiceType === 'correction-pan') {
                formTitle = 'PAN Card Correction';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'PAN Card Correction', null)">
                        <label>Current PAN No.:</label>
                        <input type="text" placeholder="Enter existing PAN number" required>
                        <label>Field to correct:</label>
                        <input type="text" placeholder="e.g., Name, DOB" required>
                        <button type="submit">Submit Correction</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=pancard&subservice=new-pan" class="sub-service-btn">New PAN Card</a>
                        <a href="services.html?service=pancard&subservice=correction-pan" class="sub-service-btn">Correction PAN</a>
                    </div>
                `;
            }
            break;
        case 'passport':
            formTitle = 'Passport Service';
            if (subServiceType === 'new-passport') {
                formTitle = 'New Passport';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'New Passport', null)">
                        <label>Full Name:</label>
                        <input type="text" placeholder="Enter Full Name" required>
                        <label>Address:</label>
                        <input type="text" placeholder="Enter Address" required>
                        <button type="submit">Submit Application</button>
                    </form>`;
            } else if (subServiceType === 'renewal') {
                formTitle = 'Passport Renewal';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Passport Renewal', null)">
                        <label>Current Passport No.:</label>
                        <input type="text" placeholder="Enter current Passport No." required>
                        <label>Date of Expiry:</label>
                        <input type="date" required>
                        <button type="submit">Submit Renewal</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=passport&subservice=new-passport" class="sub-service-btn">New Passport</a>
                        <a href="services.html?service=passport&subservice=renewal" class="sub-service-btn">Renewal</a>
                    </div>
                `;
            }
            break;
        case 'insurance':
            formTitle = 'Insurance Service';
            if (subServiceType === 'bike') {
                formTitle = 'Bike Insurance';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Bike Insurance', null)">
                        <label>Vehicle Number:</label>
                        <input type="text" placeholder="Enter bike number" required>
                        <label>Policy Type:</label>
                        <select required>
                            <option value="">Select Type</option>
                            <option value="Third-Party">Third-Party</option>
                            <option value="Comprehensive">Comprehensive</option>
                        </select>
                        <button type="submit">Get a Quote</button>
                    </form>`;
            } else if (subServiceType === 'car') {
                formTitle = 'Car Insurance';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Car Insurance', null)">
                        <label>Vehicle Number:</label>
                        <input type="text" placeholder="Enter car number" required>
                        <label>Policy Type:</label>
                        <select required>
                            <option value="">Select Type</option>
                            <option value="Third-Party">Third-Party</option>
                            <option value="Comprehensive">Comprehensive</option>
                        </select>
                        <button type="submit">Get a Quote</button>
                    </form>`;
            } else if (subServiceType === 'commercial-vehicle') {
                formTitle = 'Commercial Vehicle Insurance';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Commercial Vehicle Insurance', null)">
                        <label>Vehicle Number:</label>
                        <input type="text" placeholder="Enter vehicle number" required>
                        <label>Vehicle Type:</label>
                        <input type="text" placeholder="e.g., Truck, Bus" required>
                        <button type="submit">Get a Quote</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=insurance&subservice=bike" class="sub-service-btn">Bike</a>
                        <a href="services.html?service=insurance&subservice=car" class="sub-service-btn">Car</a>
                        <a href="services.html?service=insurance&subservice=commercial-vehicle" class="sub-service-btn">Commercial Vehicle</a>
                    </div>
                `;
            }
            break;
        case 'account-opening':
            formTitle = 'Account Opening Service';
            if (subServiceType === 'savings') {
                formTitle = 'Savings Account';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Savings Account Opening', null)">
                        <label>Full Name:</label>
                        <input type="text" placeholder="Enter your full name" required>
                        <label>Mobile Number:</label>
                        <input type="tel" placeholder="Enter mobile number" required>
                        <button type="submit">Open Account</button>
                    </form>`;
            } else if (subServiceType === 'current') {
                formTitle = 'Current Account';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Current Account Opening', null)">
                        <label>Business Name:</label>
                        <input type="text" placeholder="Enter business name" required>
                        <label>Contact Person:</label>
                        <input type="text" placeholder="Enter your name" required>
                        <button type="submit">Open Account</button>
                    </form>`;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=account-opening&subservice=savings" class="sub-service-btn">Savings Account</a>
                        <a href="services.html?service=account-opening&subservice=current" class="sub-service-btn">Current Account</a>
                    </div>
                `;
            }
            break;
        default:
            formTitle = 'Select a Service';
            formContent = '<p>Please select a service from the list to view its details and form.</p>';
    }

    formContainer.innerHTML = `
        <h2>${formTitle}</h2>
        <div class="form-content">${formContent}</div>
    `;
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
    transactionHistory.slice().reverse().forEach(transaction => { // Show most recent first
        historyHtml += `
            <li class="history-item">
                <span class="history-service">${transaction.service}</span>
                <span class="history-amount">₹ ${parseFloat(transaction.amount).toFixed(2) || 'N/A'}</span>
                <span class="history-date">${transaction.date}</span>
            </li>
        `;
    });
    historyHtml += '</ul>';
    historyContainer.innerHTML = historyHtml;
}

// Event listeners for different pages
document.addEventListener('DOMContentLoaded', () => {
    loadWalletData(); // Load data from localStorage on every page load
    
    if (document.body.id === 'login-page') {
        document.querySelector('.form-container form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (document.body.id === 'dashboard-page') {
        const username = localStorage.getItem('loggedInUser');
        if (!username) {
            window.location.href = "login.html"; // Redirect if not logged in
            return;
        }
        const welcomeEl = document.getElementById('welcome-user-name');
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, ${username}!`;
        }
        
        // Load wallet balance and transaction history on dashboard page
        updateWalletDisplay();
        loadTransactionHistory();

        const topupButton = document.getElementById('topup-button');
        if (topupButton) {
            topupButton.addEventListener('click', () => {
                const topupAmount = prompt("Enter amount to top up:");
                const amount = parseFloat(topupAmount);
                if (!isNaN(amount) && amount > 0) {
                    walletBalance += amount;
                    updateWalletDisplay();
                    saveWalletData(); // Save data after top-up
                    alert(`₹${amount} has been added to your wallet!`);
                } else if (amount <= 0) {
                    alert("Please enter a valid amount greater than 0.");
                } else {
                    alert("Top-up cancelled.");
                }
            });
        }
    }
    
    if (document.body.id === 'services-page') {
        loadServiceForm();
    }
});
