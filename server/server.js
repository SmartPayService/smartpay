const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// A simple in-memory database to store user data
const users = {};

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
        password: password, // In a real app, this would be hashed
        balance: 500,
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

    // Check if user exists and password is correct
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid username or password." });
    }
    
    // If login is successful, return user data
    res.status(200).json({
        username: username,
        balance: users[username].balance,
        history: users[username].history
    });
});

// API to handle transactions and update user data
app.post('/api/transaction', (req, res) => {
    const { username, service, amount, transactionDetails } = req.body;

    if (!username || !service || amount === undefined) {
        return res.status(400).json({ message: "Invalid transaction data." });
    }

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    let currentBalance = users[username].balance;
    const amountNum = parseFloat(amount);
    const isCashWithdrawal = service === 'AEPS Cash Withdrawal';

    if (isCashWithdrawal) {
        currentBalance += amountNum;
    } else if (currentBalance >= amountNum) {
        currentBalance -= amountNum;
    } else {
        return res.status(402).json({ message: "Insufficient balance." });
    }

    // Add transaction to history
    users[username].balance = currentBalance;
    users[username].history.push({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('en-IN'),
        service: service,
        amount: amount,
        status: 'Successful',
        fields: transactionDetails
    });

    res.status(200).json({
        message: "Transaction successful.",
        newBalance: currentBalance
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

    // Add a top-up transaction to history for record-keeping
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