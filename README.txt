SmartPay Auth Gate + Wallet (Dummy)
-----------------------------------
What this does:
- Hides wallet and other protected sections until user logs in.
- Adds a simple wallet with "Add Balance" and history (stored in localStorage).
- Route guard to stop opening protected pages without login.

How to use quickly:
1) Copy `smartpay-auth-wallet.js` to: assets/js/smartpay-auth-wallet.js
2) On homepage (index.html), replace your wallet block with the code in `index-snippet.html`
   - Make sure the Login/Register section has class `sp-public`
   - Wallet blocks must have class `sp-protected`
3) Include the script at the end of the body (after Bootstrap):
   <script src="assets/js/smartpay-auth-wallet.js"></script>
4) Use `data-sp-guard="login.html"` on <body> of any protected page to auto-redirect to login.
5) Use the sample `login.html` (or wire your own) with id="sp-login-form".

Keys in localStorage:
- sp_user   -> logged-in user's basic info
- sp_wallet -> { balance: number, history: Tx[] }

Note: This is a demo (no backend). Replace with real APIs later.
