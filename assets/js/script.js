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
