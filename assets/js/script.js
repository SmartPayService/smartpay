// Dummy wallet balance
let walletBalance = 500;

// Dummy data for dropdowns (as if fetched from a database)
const mobileOperators = [&#39;Jio&#39;, &#39;Airtel&#39;, &#39;Vi&#39;, &#39;BSNL&#39;];
const dthOperators = [&#39;Tata Play&#39;, &#39;Airtel Digital TV&#39;, &#39;Dish TV&#39;, &#39;Sun Direct&#39;];
const billerCategories = [&#39;Electricity&#39;, &#39;Water&#39;, &#39;Gas&#39;, &#39;Broadband&#39;];
const bankNames = [&#39;State Bank of India&#39;, &#39;HDFC Bank&#39;, &#39;ICICI Bank&#39;, &#39;Axis Bank&#39;];
const states = [&#39;Andhra Pradesh&#39;, &#39;Arunachal Pradesh&#39;, &#39;Assam&#39;, &#39;Bihar&#39;, &#39;Chhattisgarh&#39;, &#39;Goa&#39;, &#39;Gujarat&#39;, &#39;Haryana&#39;, &#39;Himachal Pradesh&#39;, &#39;Jharkhand&#39;, &#39;Karnataka&#39;, &#39;Kerala&#39;, &#39;Madhya Pradesh&#39;, &#39;Maharashtra&#39;, &#39;Manipur&#39;, &#39;Meghalaya&#39;, &#39;Mizoram&#39;, &#39;Nagaland&#39;, &#39;Odisha&#39;, &#39;Punjab&#39;, &#39;Rajasthan&#39;, &#39;Sikkim&#39;, &#39;Tamil Nadu&#39;, &#39;Telangana&#39;, &#39;Tripura&#39;, &#39;Uttar Pradesh&#39;, &#39;Uttarakhand&#39;, &#39;West Bengal&#39;];

// Function to update the wallet balance display
function updateWalletDisplay() {
    const balanceEl = document.getElementById(&#39;wallet-balance&#39;);
    if (balanceEl) {
        balanceEl.innerText = `₹ ${walletBalance}`;
    }
}

// Function to handle login with a dummy user
function handleLogin() {
    const username = document.getElementById(&#39;auth-username&#39;).value;
    const password = document.getElementById(&#39;auth-password&#39;).value;
    
    // Simple front-end validation (Not secure for real-world use)
    if (username &amp;&amp; password) {
        localStorage.setItem(&#39;loggedInUser&#39;, username);
        window.location.href = &quot;dashboard.html&quot;;
    } else {
        alert(&quot;Please enter both a username and a password.&quot;);
    }
}

// Function to show a success message and receipt
function showSuccessMessageAndReceipt(details) {
    const formContainer = document.getElementById(&#39;service-form-container&#39;);
    const today = new Date().toLocaleDateString(&#39;en-IN&#39;);
    const receiptContent = `
        &lt;div class=&quot;receipt-print-area&quot;&gt;
            &lt;h3&gt;Receipt&lt;/h3&gt;
            &lt;p&gt;&lt;strong&gt;Transaction ID:&lt;/strong&gt; ${Math.floor(Math.random() * 1000000)}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Date:&lt;/strong&gt; ${today}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Service:&lt;/strong&gt; ${details.serviceType}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Amount:&lt;/strong&gt; ₹ ${details.amount || &#39;N/A&#39;}&lt;/p&gt;
            &lt;p&gt;&lt;strong&gt;Status:&lt;/strong&gt; Successful&lt;/p&gt;
            ${details.fields ? Object.keys(details.fields).map(key =&gt; `&lt;p&gt;&lt;strong&gt;${key}:&lt;/strong&gt; ${details.fields[key]}&lt;/p&gt;`).join(&#39;&#39;) : &#39;&#39;}
        &lt;/div&gt;
    `;

    formContainer.innerHTML = `
        &lt;div class=&quot;success-message-container&quot;&gt;
            &lt;h3&gt;Transaction Successful!&lt;/h3&gt;
            &lt;p&gt;Your request has been processed successfully.&lt;/p&gt;
            &lt;div class=&quot;receipt&quot;&gt;
                ${receiptContent}
            &lt;/div&gt;
            &lt;button onclick=&quot;window.print()&quot; class=&quot;cta-btn&quot; style=&quot;margin-top: 20px;&quot;&gt;Print Receipt&lt;/button&gt;
            &lt;a href=&quot;dashboard.html&quot; class=&quot;cta-btn&quot; style=&quot;margin-top: 20px;&quot;&gt;Go to Dashboard&lt;/a&gt;
        &lt;/div&gt;
    `;
}

// Function to handle dummy form submissions
function handleDummyFormSubmit(event, serviceType, amount, fields = {}) {
    event.preventDefault();
    
    if (amount) {
        if (walletBalance &gt;= amount) {
            walletBalance -= amount;
            updateWalletDisplay();
            showSuccessMessageAndReceipt({serviceType, amount, fields});
        } else {
            alert(&quot;Insufficient balance. Please top up your wallet.&quot;);
        }
    } else {
        showSuccessMessageAndReceipt({serviceType, amount: &#39;N/A&#39;, fields});
    }
}

// Helper function to create a dropdown menu from an array
function createDropdown(name, options) {
    let selectHtml = `&lt;select name=&quot;${name}&quot; required&gt;&lt;option value=&quot;&quot;&gt;Select ${name.replace(&#39;_&#39;, &#39; &#39;)}&lt;/option&gt;`;
    options.forEach(option =&gt; {
        selectHtml += `&lt;option value=&quot;${option}&quot;&gt;${option}&lt;/option&gt;`;
    });
    selectHtml += `&lt;/select&gt;`;
    return selectHtml;
}

// Function to update the service form on the services page
function loadServiceForm() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get(&#39;service&#39;);
    const subServiceType = params.get(&#39;subservice&#39;);
    const formContainer = document.getElementById(&#39;service-form-container&#39;);
    
    // Check for user login
    const loggedInUser = localStorage.getItem(&#39;loggedInUser&#39;);
    if (!loggedInUser) {
        alert(&quot;Please log in to access services.&quot;);
        window.location.href = &quot;login.html&quot;; // Redirect to login page
        return;
    }

    if (!serviceType || !formContainer) {
        // If no service is selected, show the main service grid
        formContainer.innerHTML = `
            &lt;h2&gt;All Services&lt;/h2&gt;
            &lt;div class=&quot;services-grid&quot;&gt;
                &lt;a href=&quot;services.html?service=recharge&amp;subservice=mobile&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-mobile-alt&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;Mobile Recharge&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=billpay&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-bolt&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;Bill Payments&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=recharge&amp;subservice=dth&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-tv&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;DTH Recharge&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=aeps&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-fingerprint&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;AEPS&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=pancard&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-id-card&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;PAN Card&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=passport&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-passport&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;Passport&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=insurance&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-car-crash&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;Insurance&lt;/p&gt;
                &lt;/a&gt;
                &lt;a href=&quot;services.html?service=account-opening&quot; class=&quot;service-item&quot;&gt;
                    &lt;i class=&quot;fas fa-user-plus&quot;&gt;&lt;/i&gt;
                    &lt;p&gt;Account Opening&lt;/p&gt;
                &lt;/a&gt;
            &lt;/div&gt;
        `;
        return;
    }

    let formContent = &#39;&#39;;
    let formTitle = &#39;&#39;;

    switch(serviceType) {
        case &#39;recharge&#39;:
            formTitle = &#39;Recharge Services&#39;;
            if (subServiceType === &#39;mobile&#39;) {
                formTitle = &#39;Mobile Recharge&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Mobile Recharge&#39;, 199, {&#39;Mobile No.&#39;: this.mobile_no.value, &#39;Operator&#39;: this.operator.value})&quot;&gt;
                        &lt;label&gt;Mobile Number:&lt;/label&gt;
                        &lt;input type=&quot;tel&quot; name=&quot;mobile_no&quot; placeholder=&quot;Enter 10-digit mobile number&quot; required&gt;
                        &lt;label&gt;Operator:&lt;/label&gt;
                        ${createDropdown(&#39;operator&#39;, mobileOperators)}
                        &lt;label&gt;Amount:&lt;/label&gt;
                        &lt;input type=&quot;number&quot; name=&quot;amount&quot; value=&quot;199&quot; readonly&gt;
                        &lt;button type=&quot;submit&quot;&gt;Pay ₹199&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;dth&#39;) {
                formTitle = &#39;DTH Recharge&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;DTH Recharge&#39;, 300, {&#39;Operator ID&#39;: this.dth_id.value, &#39;Operator&#39;: this.operator.value})&quot;&gt;
                        &lt;label&gt;Operator ID:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;dth_id&quot; placeholder=&quot;Enter Operator ID&quot; required&gt;
                        &lt;label&gt;Operator:&lt;/label&gt;
                        ${createDropdown(&#39;operator&#39;, dthOperators)}
                        &lt;label&gt;Amount:&lt;/label&gt;
                        &lt;input type=&quot;number&quot; name=&quot;amount&quot; value=&quot;300&quot; readonly&gt;
                        &lt;button type=&quot;submit&quot;&gt;Pay ₹300&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=recharge&amp;subservice=mobile&quot; class=&quot;sub-service-btn&quot;&gt;Mobile&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=recharge&amp;subservice=dth&quot; class=&quot;sub-service-btn&quot;&gt;DTH&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;billpay&#39;:
            formTitle = &#39;Bill Payments&#39;;
            if (subServiceType) {
                formTitle = `${subServiceType} Bill Payment`;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;${subServiceType} Bill Payment&#39;, 850, {&#39;Customer ID&#39;: this.customer_id.value, &#39;State&#39;: this.state.value, &#39;Biller Type&#39;: &#39;${subServiceType}&#39;})&quot;&gt;
                        &lt;label&gt;Customer ID:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;customer_id&quot; placeholder=&quot;Enter Customer/Bill ID&quot; required&gt;
                        &lt;label&gt;State:&lt;/label&gt;
                        ${createDropdown(&#39;state&#39;, states)}
                        &lt;label&gt;Amount:&lt;/label&gt;
                        &lt;input type=&quot;number&quot; name=&quot;amount&quot; value=&quot;850&quot; readonly&gt;
                        &lt;button type=&quot;submit&quot;&gt;Pay ₹850&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        ${billerCategories.map(cat =&gt; `&lt;a href=&quot;services.html?service=billpay&amp;subservice=${cat}&quot; class=&quot;sub-service-btn&quot;&gt;${cat}&lt;/a&gt;`).join(&#39;&#39;)}
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;aeps&#39;:
            formTitle = &#39;AEPS (Aadhaar Enabled Payment System)&#39;;
            if (subServiceType === &#39;cash-withdrawal&#39;) {
                formTitle = &#39;Cash Withdrawal&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;AEPS Cash Withdrawal&#39;, this.amount.value, {&#39;Aadhaar No.&#39;: this.aadhaar_no.value, &#39;Bank&#39;: this.bank_name.value})&quot;&gt;
                        &lt;label&gt;Aadhaar Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;aadhaar_no&quot; placeholder=&quot;Enter Aadhaar Number&quot; required&gt;
                        &lt;label&gt;Bank Name:&lt;/label&gt;
                        ${createDropdown(&#39;bank_name&#39;, bankNames)}
                        &lt;label&gt;Amount:&lt;/label&gt;
                        &lt;input type=&quot;number&quot; name=&quot;amount&quot; placeholder=&quot;Enter amount to withdraw&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Withdraw Cash&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;balance-inquiry&#39;) {
                formTitle = &#39;Balance Inquiry&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;AEPS Balance Inquiry&#39;, null, {&#39;Aadhaar No.&#39;: this.aadhaar_no.value, &#39;Bank&#39;: this.bank_name.value})&quot;&gt;
                        &lt;label&gt;Aadhaar Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;aadhaar_no&quot; placeholder=&quot;Enter Aadhaar Number&quot; required&gt;
                        &lt;label&gt;Bank Name:&lt;/label&gt;
                        ${createDropdown(&#39;bank_name&#39;, bankNames)}
                        &lt;button type=&quot;submit&quot;&gt;Check Balance&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;deposit&#39;) {
                formTitle = &#39;Cash Deposit&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;AEPS Cash Deposit&#39;, this.amount.value, {&#39;Aadhaar No.&#39;: this.aadhaar_no.value, &#39;Bank&#39;: this.bank_name.value})&quot;&gt;
                        &lt;label&gt;Aadhaar Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;aadhaar_no&quot; placeholder=&quot;Enter Aadhaar Number&quot; required&gt;
                        &lt;label&gt;Bank Name:&lt;/label&gt;
                        ${createDropdown(&#39;bank_name&#39;, bankNames)}
                        &lt;label&gt;Amount:&lt;/label&gt;
                        &lt;input type=&quot;number&quot; name=&quot;amount&quot; placeholder=&quot;Enter amount to deposit&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Deposit Cash&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;ministatement&#39;) {
                formTitle = &#39;Mini Statement&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;AEPS Mini Statement&#39;, null, {&#39;Aadhaar No.&#39;: this.aadhaar_no.value, &#39;Bank&#39;: this.bank_name.value})&quot;&gt;
                        &lt;label&gt;Aadhaar Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; name=&quot;aadhaar_no&quot; placeholder=&quot;Enter Aadhaar Number&quot; required&gt;
                        &lt;label&gt;Bank Name:&lt;/label&gt;
                        ${createDropdown(&#39;bank_name&#39;, bankNames)}
                        &lt;button type=&quot;submit&quot;&gt;Get Mini Statement&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=aeps&amp;subservice=cash-withdrawal&quot; class=&quot;sub-service-btn&quot;&gt;Cash Withdrawal&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=aeps&amp;subservice=balance-inquiry&quot; class=&quot;sub-service-btn&quot;&gt;Balance Inquiry&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=aeps&amp;subservice=deposit&quot; class=&quot;sub-service-btn&quot;&gt;Cash Deposit&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=aeps&amp;subservice=ministatement&quot; class=&quot;sub-service-btn&quot;&gt;Mini Statement&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;pancard&#39;:
            formTitle = &#39;PAN Card Service&#39;;
            if (subServiceType === &#39;new-pan&#39;) {
                formTitle = &#39;New PAN Card Application&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;New PAN Card&#39;, null)&quot;&gt;
                        &lt;label&gt;Full Name:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter Full Name&quot; required&gt;
                        &lt;label&gt;Date of Birth:&lt;/label&gt;
                        &lt;input type=&quot;date&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Submit Application&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;correction-pan&#39;) {
                formTitle = &#39;PAN Card Correction&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;PAN Card Correction&#39;, null)&quot;&gt;
                        &lt;label&gt;Current PAN No.:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter existing PAN number&quot; required&gt;
                        &lt;label&gt;Field to correct:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;e.g., Name, DOB&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Submit Correction&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=pancard&amp;subservice=new-pan&quot; class=&quot;sub-service-btn&quot;&gt;New PAN Card&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=pancard&amp;subservice=correction-pan&quot; class=&quot;sub-service-btn&quot;&gt;Correction PAN&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;passport&#39;:
            formTitle = &#39;Passport Service&#39;;
            if (subServiceType === &#39;new-passport&#39;) {
                formTitle = &#39;New Passport&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;New Passport&#39;, null)&quot;&gt;
                        &lt;label&gt;Full Name:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter Full Name&quot; required&gt;
                        &lt;label&gt;Address:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter Address&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Submit Application&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;renewal&#39;) {
                formTitle = &#39;Passport Renewal&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Passport Renewal&#39;, null)&quot;&gt;
                        &lt;label&gt;Current Passport No.:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter current Passport No.&quot; required&gt;
                        &lt;label&gt;Date of Expiry:&lt;/label&gt;
                        &lt;input type=&quot;date&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Submit Renewal&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=passport&amp;subservice=new-passport&quot; class=&quot;sub-service-btn&quot;&gt;New Passport&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=passport&amp;subservice=renewal&quot; class=&quot;sub-service-btn&quot;&gt;Renewal&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;insurance&#39;:
            formTitle = &#39;Insurance Service&#39;;
            if (subServiceType === &#39;bike&#39;) {
                formTitle = &#39;Bike Insurance&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Bike Insurance&#39;, null)&quot;&gt;
                        &lt;label&gt;Vehicle Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter bike number&quot; required&gt;
                        &lt;label&gt;Policy Type:&lt;/label&gt;
                        &lt;select required&gt;
                            &lt;option value=&quot;&quot;&gt;Select Type&lt;/option&gt;
                            &lt;option value=&quot;Third-Party&quot;&gt;Third-Party&lt;/option&gt;
                            &lt;option value=&quot;Comprehensive&quot;&gt;Comprehensive&lt;/option&gt;
                        &lt;/select&gt;
                        &lt;button type=&quot;submit&quot;&gt;Get a Quote&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;car&#39;) {
                formTitle = &#39;Car Insurance&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Car Insurance&#39;, null)&quot;&gt;
                        &lt;label&gt;Vehicle Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter car number&quot; required&gt;
                        &lt;label&gt;Policy Type:&lt;/label&gt;
                        &lt;select required&gt;
                            &lt;option value=&quot;&quot;&gt;Select Type&lt;/option&gt;
                            &lt;option value=&quot;Third-Party&quot;&gt;Third-Party&lt;/option&gt;
                            &lt;option value=&quot;Comprehensive&quot;&gt;Comprehensive&lt;/option&gt;
                        &lt;/select&gt;
                        &lt;button type=&quot;submit&quot;&gt;Get a Quote&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;commercial-vehicle&#39;) {
                formTitle = &#39;Commercial Vehicle Insurance&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Commercial Vehicle Insurance&#39;, null)&quot;&gt;
                        &lt;label&gt;Vehicle Number:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter vehicle number&quot; required&gt;
                        &lt;label&gt;Vehicle Type:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;e.g., Truck, Bus&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Get a Quote&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=insurance&amp;subservice=bike&quot; class=&quot;sub-service-btn&quot;&gt;Bike&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=insurance&amp;subservice=car&quot; class=&quot;sub-service-btn&quot;&gt;Car&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=insurance&amp;subservice=commercial-vehicle&quot; class=&quot;sub-service-btn&quot;&gt;Commercial Vehicle&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        case &#39;account-opening&#39;:
            formTitle = &#39;Account Opening Service&#39;;
            if (subServiceType === &#39;savings&#39;) {
                formTitle = &#39;Savings Account&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Savings Account Opening&#39;, null)&quot;&gt;
                        &lt;label&gt;Full Name:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter your full name&quot; required&gt;
                        &lt;label&gt;Mobile Number:&lt;/label&gt;
                        &lt;input type=&quot;tel&quot; placeholder=&quot;Enter mobile number&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Open Account&lt;/button&gt;
                    &lt;/form&gt;`;
            } else if (subServiceType === &#39;current&#39;) {
                formTitle = &#39;Current Account&#39;;
                formContent = `
                    &lt;form onsubmit=&quot;handleDummyFormSubmit(event, &#39;Current Account Opening&#39;, null)&quot;&gt;
                        &lt;label&gt;Business Name:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter business name&quot; required&gt;
                        &lt;label&gt;Contact Person:&lt;/label&gt;
                        &lt;input type=&quot;text&quot; placeholder=&quot;Enter your name&quot; required&gt;
                        &lt;button type=&quot;submit&quot;&gt;Open Account&lt;/button&gt;
                    &lt;/form&gt;`;
            } else {
                formContent = `
                    &lt;div class=&quot;sub-service-buttons&quot;&gt;
                        &lt;a href=&quot;services.html?service=account-opening&amp;subservice=savings&quot; class=&quot;sub-service-btn&quot;&gt;Savings Account&lt;/a&gt;
                        &lt;a href=&quot;services.html?service=account-opening&amp;subservice=current&quot; class=&quot;sub-service-btn&quot;&gt;Current Account&lt;/a&gt;
                    &lt;/div&gt;
                `;
            }
            break;
        default:
            formTitle = &#39;Select a Service&#39;;
            formContent = &#39;&lt;p&gt;Please select a service from the list to view its details and form.&lt;/p&gt;&#39;;
    }

    formContainer.innerHTML = `
        &lt;h2&gt;${formTitle}&lt;/h2&gt;
        &lt;div class=&quot;form-content&quot;&gt;${formContent}&lt;/div&gt;
    `;
    updateWalletDisplay();
}

// Event listeners for different pages
document.addEventListener(&#39;DOMContentLoaded&#39;, () =&gt; {
    if (document.body.id === &#39;login-page&#39;) {
        document.querySelector(&#39;.form-container form&#39;).addEventListener(&#39;submit&#39;, (e) =&gt; {
            e.preventDefault();
            handleLogin();
        });
    }

    if (document.body.id === &#39;dashboard-page&#39;) {
        const username = localStorage.getItem(&#39;loggedInUser&#39;);
        if (!username) {
            window.location.href = &quot;login.html&quot;; // Redirect if not logged in
            return;
        }
        const welcomeEl = document.getElementById(&#39;welcome-user-name&#39;);
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, ${username}!`;
        }

        updateWalletDisplay();
        const topupButton = document.getElementById(&#39;topup-button&#39;);
        if (topupButton) {
            topupButton.addEventListener(&#39;click&#39;, () =&gt; {
                const topupAmount = prompt(&quot;Enter amount to top up:&quot;);
                const amount = parseInt(topupAmount);
                if (!isNaN(amount) &amp;&amp; amount &gt; 0) {
                    walletBalance += amount;
                    updateWalletDisplay();
                    alert(`₹${amount} has been added to your wallet!`);
                } else if (amount &lt;= 0) {
                    alert(&quot;Please enter a valid amount greater than 0.&quot;);
                } else {
                    alert(&quot;Top-up cancelled.&quot;);
                }
            });
        }
    }
    
    if (document.body.id === &#39;services-page&#39;) {
        loadServiceForm();
    }
});
