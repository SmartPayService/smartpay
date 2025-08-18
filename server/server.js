const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// A simple in-memory database to store user data
const users = {};

// Commission rates for different services
const commissionRates = {
    'Mobile Recharge': 0.02, // 2% commission
    'DTH Recharge': 0.015,   // 1.5% commission
    'Electricity Bill Payment': 0.005, // 0.5% commission
    'Water Bill Payment': 0.005,
    'Gas Bill Payment': 0.005,
    'Broadband Bill Payment': 0.005,
    'AEPS Cash Withdrawal': 0.01, // 1% commission on withdrawal amount
    'AEPS Cash Deposit': 0.01,
    'New PAN Card': 25,      // Fixed commission of ₹25
    'Correction PAN': 15,    // Fixed commission of ₹15
    'New Passport': 50,      // Fixed commission of ₹50
    'Passport Renewal': 30,    // Fixed commission of ₹30
    'Bike Insurance': 0.03, // 3% commission
    'Car Insurance': 0.025,  // 2.5% commission
    'Commercial Vehicle Insurance': 0.04, // 4% commission
    'Savings Account Opening': 10,   // Fixed commission of ₹10
    'Current Account Opening': 20    // Fixed commission of ₹20
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
        balance: 500, // Initial balance
        history: []
    };
    
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

    const currentBalance = users[username].balance;
    const amountNum = parseFloat(amount) || 0; // Ensure amount is a number
    let transactionCost = amountNum;
    let commissionEarned = 0;

    // Calculate commission based on service type
    const commissionRate = commissionRates[service];
    if (commissionRate !== undefined) {
        if (typeof commissionRate === 'number' && commissionRate < 1) {
            // Percentage-based commission
            commissionEarned = amountNum * commissionRate;
        } else {
            // Fixed amount commission
            commissionEarned = commissionRate;
        }
    }

    const isAEPSWithdrawal = service === 'AEPS Cash Withdrawal';
    
    if (!isAEPSWithdrawal && transactionCost > currentBalance) {
        return res.status(402).json({ message: "Insufficient balance." });
    }

    let newBalance;
    if (isAEPSWithdrawal) {
        // For cash withdrawal, the user's wallet balance increases, and they also earn commission.
        newBalance = currentBalance + amountNum + commissionEarned;
    } else {
        // For all other services, the cost is deducted, and commission is added back.
        // We deduct the transaction cost and then add the commission.
        newBalance = currentBalance - transactionCost + commissionEarned;
    }

    users[username].balance = newBalance;
    users[username].history.push({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN'),
        service: service,
        amount: amountNum,
        commission: commissionEarned.toFixed(2),
        status: 'Successful',
        fields: transactionDetails
    });

    res.status(200).json({
        message: "Transaction successful.",
        newBalance: newBalance,
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

    res.status(200).json({
        message: "Top-up successful.",
        newBalance: users[username].balance
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
