// Dummy wallet balance
let walletBalance = 500;

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

// Function to update the service form on the services page
function loadServiceForm() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('service');
    const subServiceType = params.get('subservice');
    const formContainer = document.getElementById('service-form-container');
    
    if (!serviceType || !formContainer) {
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
                        <select name="operator" required>
                            <option value="">Select Operator</option>
                            <option value="Jio">Jio</option>
                            <option value="Airtel">Airtel</option>
                            <option value="Vi">Vi</option>
                        </select>
                        <label>Amount:</label>
                        <input type="number" name="amount" value="199" readonly>
                        <button type="submit">Pay ₹199</button>
                    </form>`;
            } else if (subServiceType === 'dth') {
                formTitle = 'DTH Recharge';
                formContent = `
                    <form onsubmit="handleDummyFormSubmit(event, 'DTH Recharge', 300, {'Operator ID': this.dth_id.value, 'Mobile No.': this.mobile_no.value})">
                        <label>Operator ID:</label>
                        <input type="text" name="dth_id" placeholder="Enter Operator ID" required>
                        <label>Mobile Number:</label>
                        <input type="tel" name="mobile_no" placeholder="Enter Mobile Number" required>
                        <label>Operator:</label>
                        <select name="operator" required>
                            <option value="">Select Operator</option>
                            <option value="Tata Play">Tata Play</option>
                            <option value="Airtel Digital TV">Airtel Digital TV</option>
                            <option value="Dish TV">Dish TV</option>
                        </select>
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
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'Bill Payments', 850)">
                    <label>Biller ID:</label>
                    <input type="text" placeholder="Enter Biller ID" required>
                    <label>Amount:</label>
                    <input type="number" value="850" readonly>
                    <button type="submit">Pay ₹850</button>
                </form>`;
            break;
        case 'dth':
            formTitle = 'DTH Recharge';
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'DTH Recharge', 300)">
                    <label>DTH ID:</label>
                    <input type="text" placeholder="Enter DTH ID" required>
                    <label>Amount:</label>
                    <input type="number" value="300" readonly>
                    <button type="submit">Pay ₹300</button>
                </form>`;
            break;
        case 'aeps':
            formTitle = 'AEPS (Aadhaar Enabled Payment System)';
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'AEPS')">
                    <h3>Sub-services: Cash Withdrawal, Balance Enquiry</h3>
                    <label>Aadhaar Number:</label>
                    <input type="text" placeholder="Enter Aadhaar Number" required>
                    <button type="submit">Proceed with Biometrics</button>
                </form>
                <p class="warning-text">This is a dummy service. A real AEPS service requires a secure system and biometric device.</p>`;
            break;
        case 'banking':
            formTitle = 'Banking Services';
            if (subServiceType === 'newaccount') {
                formTitle = 'New Account';
                formContent = `
                    <h3>New Account</h3>
                    <form onsubmit="handleDummyFormSubmit(event, 'New Account')">
                        <label>Full Name:</label>
                        <input type="text" placeholder="Enter Full Name" required>
                        <label>Mobile Number:</label>
                        <input type="tel" placeholder="Enter Mobile Number" required>
                        <label>Email Address:</label>
                        <input type="email" placeholder="Enter Email" required>
                        <button type="submit">Open New Account</button>
                    </form>
                `;
            } else if (subServiceType === 'loan') {
                formTitle = 'Loan Application';
                formContent = `
                    <h3>Loan Application</h3>
                    <form onsubmit="handleDummyFormSubmit(event, 'Loan Application')">
                        <label>Loan Amount:</label>
                        <input type="number" placeholder="Enter Desired Loan Amount" required>
                        <label>Purpose:</label>
                        <input type="text" placeholder="Loan Purpose" required>
                        <button type="submit">Apply for Loan</button>
                    </form>
                `;
            } else {
                formContent = `
                    <div class="sub-service-buttons">
                        <a href="services.html?service=banking&subservice=newaccount" class="sub-service-btn">New Account</a>
                        <a href="services.html?service=banking&subservice=loan" class="sub-service-btn">Loan Application</a>
                    </div>
                `;
            }
            break;
        case 'pancard':
            formTitle = 'PAN Card Application';
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'PAN Card Application')">
                    <h3>Sub-services: New PAN, Correction, Reprint</h3>
                    <label>Full Name:</label>
                    <input type="text" placeholder="Enter Full Name" required>
                    <label>Date of Birth:</label>
                    <input type="date" required>
                    <button type="submit">Submit Application</button>
                </form>`;
            break;
        case 'passport':
            formTitle = 'Passport Application';
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'Passport Application')">
                    <h3>Sub-services: New Passport, Renewal</h3>
                    <label>Full Name:</label>
                    <input type="text" placeholder="Enter Full Name" required>
                    <label>Address:</label>
                    <input type="text" placeholder="Enter Address" required>
                    <button type="submit">Submit Application</button>
                </form>`;
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
