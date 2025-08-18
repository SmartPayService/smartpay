const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// A simple in-memory database to store user data
const users = {};

// API to handle login and get user data
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!users[username]) {
        // Create a new user if they don't exist
        users[username] = {
            balance: 500, // Initial dummy balance
            history: []
        };
    }
    
    // In a real application, you would check the password here.
    // For this example, we'll just return the user data.
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
