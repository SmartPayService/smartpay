// Dummy wallet balance
let walletBalance = 500;

// Dummy data for dropdowns (as if fetched from a database)
const mobileOperators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
const dthOperators = ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'];
const billerCategories = ['Electricity', 'Water', 'Gas', 'Broadband'];
const bankNames = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'];

// Function to update the wallet balance display
function updateWalletDisplay() {
    const balanceEl = document.getElementById('wallet-balance');
    if (balanceEl) {
        balanceEl.innerText = `₹ ${walletBalance}`;
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

// Function to show a success message and receipt
function showSuccessMessageAndReceipt(details) {
    const formContainer = document.getElementById('service-form-container');
    const today = new Date().toLocaleDateString('en-IN');
    const receiptContent = `
        <div class="receipt-print-area">
            <h3>Receipt</h3>
            <p><strong>Transaction ID:</strong> ${Math.floor(Math.random() * 1000000)}</p>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Service:</strong> ${details.serviceType}</p>
            <p><strong>Amount:</strong> ₹ ${details.amount || 'N/A'}</p>
            <p><strong>Status:</strong> Successful</p>
            ${details.fields ? Object.keys(details.fields).map(key => `<p><strong>${key}:</strong> ${details.fields[key]}</p>`).join('') : ''}
        </div>
    `;

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
    
    if (amount) {
        if (walletBalance >= amount) {
            walletBalance -= amount;
            updateWalletDisplay();
            showSuccessMessageAndReceipt({serviceType, amount, fields});
        } else {
            alert("Insufficient balance. Please top up your wallet.");
        }
    } else {
        showSuccessMessageAndReceipt({serviceType, amount: 'N/A', fields});
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
    
    if (!serviceType || !formContainer) {
        // If no service is selected, show the main service grid
        formContainer.innerHTML = `
            <h2>All Services</h2>
            <div class="services-grid">
                <a href="services.html?service=recharge" class="service-item">
                    <i class="fas fa-mobile-alt"></i>
                    <p>Recharge</p>
                </a>
                <a href="services.html?service=billpay" class="service-item">
                    <i class="fas fa-bolt"></i>
                    <p>Bill Payments</p>
                </a>
                <a href="services.html?service=banking" class="service-item">
                    <i class="fas fa-university"></i>
                    <p>Banking</p>
                </a>
                <a href="services.html?service=pancard" class="service-item">
                    <i class="fas fa-id-card"></i>
                    <p>PAN Card</p>
                </a>
                <a href="services.html?service=passport" class="service-item">
                    <i class="fas fa-passport"></i>
                    <p>Passport</p>
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
                    <form onsubmit="handleDummyFormSubmit(event, '${subServiceType} Bill Payment', 850, {'Customer ID': this.customer_id.value, 'Biller Type': '${subServiceType}'})">
                        <label>Customer ID:</label>
                        <input type="text" name="customer_id" placeholder="Enter Customer/Bill ID" required>
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
        case 'banking':
            formTitle = 'Banking Services';
            if (subServiceType === 'newaccount') {
                formTitle = 'New Account Application';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'New Account', null, {'Full Name': this.full_name.value, 'Mobile No.': this.mobile_no.value})">
                        <label>Full Name:</label>
                        <input type="text" name="full_name" placeholder="Enter Full Name" required>
                        <label>Mobile Number:</label>
                        <input type="tel" name="mobile_no" placeholder="Enter Mobile Number" required>
                        <label>Email Address:</label>
                        <input type="email" placeholder="Enter Email" required>
                        <button type="submit">Open New Account</button>
                    </form>
                `;
            } else if (subServiceType === 'ministatement') {
                formTitle = 'Mini Statement';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'Mini Statement', null, {'Aadhaar Number': this.aadhaar_no.value, 'Bank': this.bank_name.value})">
                        <label>Aadhaar Number:</label>
                        <input type="text" name="aadhaar_no" placeholder="Enter Aadhaar Number" required>
                        <label>Bank Name:</label>
                        ${createDropdown('bank_name', bankNames)}
                        <button type="submit">Get Mini Statement</button>
                    </form>
                `;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=banking&subservice=newaccount" class="sub-service-btn">New Account</a>
                        <a href="services.html?service=banking&subservice=ministatement" class="sub-service-btn">Mini Statement</a>
                        <a href="services.html?service=banking&subservice=deposit" class="sub-service-btn">Cash Deposit</a>
                        <a href="services.html?service=banking&subservice=withdrawal" class="sub-service-btn">Cash Withdrawal</a>
                    </div>
                `;
            }
            break;
        case 'pancard':
            formTitle = 'PAN Card Application';
            if (subServiceType === 'newpan') {
                formTitle = 'New PAN Card';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'New PAN Card', null)">
                        <label>Full Name:</label>
                        <input type="text" placeholder="Enter Full Name" required>
                        <label>Date of Birth:</label>
                        <input type="date" required>
                        <button type="submit">Submit Application</button>
                    </form>`;
            } else if (subServiceType === 'correction') {
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
                        <a href="services.html?service=pancard&subservice=newpan" class="sub-service-btn">New PAN Card</a>
                        <a href="services.html?service=pancard&subservice=correction" class="sub-service-btn">Correction</a>
                    </div>
                `;
            }
            break;
        case 'passport':
            formTitle = 'Passport Application';
            if (subServiceType === 'newpassport') {
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
                        <a href="services.html?service=passport&subservice=newpassport" class="sub-service-btn">New Passport</a>
                        <a href="services.html?service=passport&subservice=renewal" class="sub-service-btn">Renewal</a>
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

// Event listeners for different pages
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'login-page') {
        document.querySelector('.form-container form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (document.body.id === 'dashboard-page') {
        const username = localStorage.getItem('loggedInUser') || 'User';
        const welcomeEl = document.getElementById('welcome-user-name');
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, ${username}!`;
        }

        updateWalletDisplay();
        const topupButton = document.getElementById('topup-button');
        if (topupButton) {
            topupButton.addEventListener('click', () => {
                const topupAmount = prompt("Enter amount to top up:");
                const amount = parseInt(topupAmount);
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
    }
    
    if (document.body.id === 'services-page') {
        loadServiceForm();
    }
});
