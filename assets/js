// Dummy wallet balance
let walletBalance = 500;

// Function to update the wallet balance display
function updateWalletDisplay() {
    const balanceEl = document.getElementById('wallet-balance');
    if (balanceEl) {
        balanceEl.innerText = `₹ ${walletBalance}`;
    }
}

// Function to handle dummy form submissions
function handleDummyFormSubmit(event, serviceType, amount) {
    event.preventDefault();
    
    if (amount) {
        if (walletBalance >= amount) {
            walletBalance -= amount;
            updateWalletDisplay();
            alert(`Payment of ₹${amount} for ${serviceType} was successful! Your new balance is ₹${walletBalance}.`);
        } else {
            alert("Insufficient balance. Please top up your wallet.");
        }
    } else {
        alert(`Dummy submission for ${serviceType} successful! We will process your request shortly.`);
    }
    
    // Redirect to dashboard after a successful transaction
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}

// Function to update the service form on the services page
function loadServiceForm() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('service');
    const formContainer = document.getElementById('service-form-container');
    
    if (!serviceType || !formContainer) {
        return;
    }

    let formContent = '';
    let formTitle = '';

    switch(serviceType) {
        case 'recharge':
            formTitle = 'Mobile Recharge';
            formContent = `
                <form onsubmit="handleDummyFormSubmit(event, 'Mobile Recharge', 199)">
                    <label>Mobile Number:</label>
                    <input type="tel" placeholder="Enter 10-digit mobile number" required>
                    <label>Amount:</label>
                    <input type="number" value="199" readonly>
                    <button type="submit">Pay ₹199</button>
                </form>`;
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
    if (document.body.id === 'dashboard-page') {
        updateWalletDisplay();
        const topupButton = document.getElementById('topup-button');
        if (topupButton) {
            topupButton.addEventListener('click', () => {
                const topupAmount = 500;
                walletBalance += topupAmount;
                updateWalletDisplay();
                alert(`₹${topupAmount} has been added to your wallet!`);
            });
        }
    }
    
    if (document.body.id === 'services-page') {
        loadServiceForm();
    }
});
