const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

let users = {};

// Function to load users from the JSON file
function loadUsers() {
    try {
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading users file:", error);
        users = {};
    }
}

// Function to save users to the JSON file
function saveUsers() {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error("Error saving users file:", error);
    }
}

// Load users when the server starts
loadUsers();

// Commission rates for different services
const commissionRates = {
    'Mobile Recharge': 0.02,
    'DTH Recharge': 0.015,
    'Electricity Bill Payment': 0.005,
    'Water Bill Payment': 0.005,
    'Gas Bill Payment': 0.005,
    'Broadband Bill Payment': 0.005,
    'AEPS Cash Withdrawal': 0.01,
    'AEPS Cash Deposit': 0.01,
    'New PAN Card': 25,
    'Correction PAN': 15,
    'New Passport': 50,
    'Passport Renewal': 30,
    'Bike Insurance': 0.03,
    'Car Insurance': 0.025,
    'Commercial Vehicle Insurance': 0.04,
    'Savings Account Opening': 10,
    'Current Account Opening': 20
};

// API to handle registration of new users
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users[username]) {
        return res.status(409).json({ message: "User already exists." });
    }

    users[username] = {
        password: password,
        balance: 500,
        history: []
    };
    
    saveUsers(); // Save the new user data to the file
    res.status(201).json({ message: "Registration successful." });
});

// API to handle login and get user data
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid username or password." });
    }
    
    res.status(200).json({
        username: username,
        balance: users[username].balance,
        history: users[username].history
    });
});

// API to handle transactions and update user data with commission
app.post('/api/transaction', (req, res) => {
    const { username, service, amount, transactionDetails } = req.body;

    if (!username || !service) {
        return res.status(400).json({ message: "Invalid transaction data." });
    }

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    let currentBalance = users[username].balance;
    const amountNum = parseFloat(amount) || 0;
    let transactionCost = amountNum;
    let commissionEarned = 0;

    const commissionRate = commissionRates[service];
    if (commissionRate !== undefined) {
        if (typeof commissionRate === 'number' && commissionRate < 1) {
            commissionEarned = amountNum * commissionRate;
        } else {
            commissionEarned = commissionRate;
        }
    }

    const isAEPSWithdrawal = service === 'AEPS Cash Withdrawal';
    const isBalanceInquiry = service === 'AEPS Balance Inquiry';
    const isMiniStatement = service === 'AEPS Mini Statement';

    if (isBalanceInquiry || isMiniStatement) {
        users[username].balance = currentBalance + commissionEarned;
        saveUsers();
        res.status(200).json({
            message: "Transaction successful.",
            newBalance: users[username].balance,
            commissionEarned: commissionEarned.toFixed(2)
        });
        return;
    }

    if (!isAEPSWithdrawal) {
        if (currentBalance < transactionCost) {
            return res.status(402).json({ message: "Insufficient balance." });
        }
        users[username].balance = currentBalance - transactionCost + commissionEarned;
    } else {
        users[username].balance = currentBalance + transactionCost + commissionEarned;
    }

    users[username].history.push({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN'),
        service: service,
        amount: amountNum,
        commission: commissionEarned.toFixed(2),
        status: 'Successful',
        fields: transactionDetails
    });

    saveUsers(); // Save the updated user data to the file
    res.status(200).json({
        message: "Transaction successful.",
        newBalance: users[username].balance,
        commissionEarned: commissionEarned.toFixed(2)
    });
});

// API to handle wallet top-up
app.post('/api/topup', (req, res) => {
    const { username, amount } = req.body;

    if (!username || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid top-up amount." });
    }

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    users[username].balance += amount;

    users[username].history.push({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN'),
        service: 'Wallet Top-up',
        amount: amount,
        status: 'Successful',
        fields: { 'Method': 'Online Payment' }
    });

    saveUsers(); // Save the updated user data to the file
    res.status(200).json({
        message: "Top-up successful.",
        newBalance: users[username].balance
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
