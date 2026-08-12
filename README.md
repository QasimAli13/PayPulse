
# 💳 PayPulse

<p align="center">

A modern full-stack digital banking web application built using the MERN Stack.

Secure authentication, money transfers, savings vaults, QR-based payments, transaction management, and PDF financial records — all in one responsive web application.

</p>

---

## 🌐 Live Demo

**Frontend:**  
https://pay-pulse-three.vercel.app/

**Backend API:**  
https://paypulse-og6r.onrender.com

---

## 📌 Project Overview

PayPulse is a full-stack digital banking web application developed using the MERN Stack.

The application simulates the core workflow of a modern online banking platform, allowing users to securely manage their accounts, transfer money, track transactions, create locked savings goals, make QR-based transfers, and generate downloadable financial documents.

The project demonstrates practical implementation of authentication, authorization, REST APIs, database management, transaction processing, protected routes, responsive UI development, and client-side PDF generation.

---

# ✨ Features

## 🔐 Authentication

- User registration
- Secure user login
- JWT authentication
- Protected routes
- Logout
- Email verification
- Forgot password with OTP
- Reset password
- Change password

---

## 💳 Banking Features

- Automatically generated account number
- View account balance
- Secure money transfers
- Real-time balance updates
- Copy account number with one click
- Sender and receiver transaction tracking
- Balance validation before transfers

---

## 🔒 Vault Savings System

- Create personalized savings goals
- Set target savings amount
- Set a lock-until date
- Deposit money into savings vaults
- Track savings progress with visual progress bars
- View saved amount versus target amount
- Locked and unlocked vault states
- Withdraw funds after the vault unlock date

---

## 📱 QR Code & Quick Transfer

- Generate a unique QR code for each account
- Display account information through QR
- Scan QR codes using the device camera
- Automatically retrieve the receiver's account number
- Quickly initiate transfers using QR scanning

---

## 📄 Transaction Management

- Complete transaction history
- Sent transactions
- Received transactions
- Search transactions
- Filter transactions
- Date and amount tracking
- Transaction details
- Download individual transaction receipts

---

## 🧾 PDF Financial Records

- Download individual transaction receipts
- Generate monthly account statements
- Display total money sent
- Display total money received
- Include user and account information
- Multi-page PDF statement generation
- Client-side PDF generation using jsPDF

---

## 👤 Account Management

- View profile information
- View account details
- View current balance
- Change password securely
- View banking activity

---

## 🎨 User Experience

- Responsive design
- Mobile-friendly interface
- Modern banking UI
- Toast notifications
- Smooth interactions
- Clean and simple user interface

---

# 🛠 Tech Stack

## Frontend

- React.js
- Axios
- React Hot Toast
- Lucide React
- jsPDF
- QRCode
- HTML5 QR Code
- CSS3

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- REST APIs

## Database

- MongoDB Atlas

## Tools & Deployment

- Git
- GitHub
- Postman
- Vercel
- Render

---

# ⚙️ How It Works

## 1. User Registration

A new user creates an account by providing:

- Full Name
- Email Address
- Password

After successful registration, a unique bank account number is automatically generated.

The user's email can then be verified through the email verification system.

---

## 2. User Login

The user logs in using their email and password.

After successful authentication, the backend generates a JWT token which is used to authenticate protected API requests.

---

## 3. Authentication & Authorization

Protected API requests include the JWT token inside the Authorization header.

The backend authentication middleware verifies the token before allowing access to protected banking resources.

This ensures that users can only access their own account and financial information.

---

## 4. Money Transfer

Users can transfer money using another user's account number.

Before processing a transaction, the backend validates:

- Receiver account exists
- Sender has sufficient balance
- Sender is not transferring money to themselves

If validation succeeds:

- Sender balance decreases
- Receiver balance increases
- Transaction is stored in MongoDB
- Updated account information is returned to the frontend

---

## 5. Transaction History

Every successful transfer creates a transaction record.

Users can:

- View all transactions
- Search transactions
- Filter sent transactions
- Filter received transactions
- View transaction dates
- View transaction amounts
- Download individual transaction receipts

---

## 6. Vault Savings Workflow

Users can create savings vaults for specific financial goals.

When creating a vault, the user defines:

- Goal title
- Target amount
- Lock-until date

Users can transfer money from their main balance into the vault.

The application calculates savings progress and displays it using a progress bar.

While the vault is locked, the saved funds cannot be withdrawn.

After the unlock date, the user can withdraw the saved amount back to their main balance.

---

## 7. QR Code Transfer Workflow

Every PayPulse account has a unique QR code containing the user's account number.

Users can display their QR code for another user to scan.

The receiving user can use the built-in camera scanner to scan the QR code.

After a successful scan:

- Account number is detected
- Receiver information is passed to the transfer interface
- Transfer form can be automatically populated
- User can proceed with the transaction

---

## 8. PDF Receipt Generation

Each transaction can generate an individual PDF receipt.

The receipt contains:

- PayPulse branding
- Transaction status
- Transaction amount
- Transaction ID
- Date and time
- Transaction type
- Sender
- Receiver

The receipt is generated on the client side using the `jsPDF` library and can be downloaded directly.

---

## 9. Monthly Account Statements

Users can export their transaction history as a complete PDF account statement.

The generated statement includes:

- User information
- Account information
- Statement period
- Total money sent
- Total money received
- Complete transaction history
- Transaction dates
- Transaction amounts
- Transaction types

Large transaction histories are handled across multiple PDF pages.

---

## 10. Password Management

Users can securely manage their passwords through:

- Forgot password
- OTP verification
- Password reset
- Change password

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following software is installed:

- Node.js
- npm
- MongoDB Atlas Account
- Git

---

# 📥 Installation

## Clone the Repository

```bash
git clone https://github.com/QasimAli13/PayPulse.git
cd PayPulse
````

## Install Backend

```bash
cd backend
npm install
npm run dev
```

## Install Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by the configured email or deployment services.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/register`        | Register user            |
| POST   | `/api/auth/login`           | Login user               |
| POST   | `/api/auth/forget-password` | Send password reset OTP  |
| POST   | `/api/auth/reset-password`  | Reset password using OTP |
| PUT    | `/api/auth/change-password` | Change password          |
| GET    | `/api/auth/verify-email`    | Verify user email        |

---

## Banking

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/bank/user-data`    | Get user details        |
| POST   | `/api/bank/transfer`     | Transfer money          |
| GET    | `/api/bank/transactions` | Get transaction history |

---

## Vault Savings

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/vaults`          | Get user's vaults           |
| POST   | `/api/vaults/create`   | Create a savings vault      |
| POST   | `/api/vaults/deposit`  | Deposit money into a vault  |
| POST   | `/api/vaults/withdraw` | Withdraw money from a vault |

---

# 🔒 Security Features

* JWT authentication
* Protected routes
* Password hashing using bcryptjs
* Authentication middleware
* Authorization checks
* Input validation
* Balance validation
* Unauthorized access prevention
* Secure password management

---

# 📱 Responsive Design

PayPulse is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

# ☁️ Deployment

## Frontend

Deployed using **Vercel**

[https://pay-pulse-three.vercel.app/](https://pay-pulse-three.vercel.app/)

## Backend

Deployed using **Render**

[https://paypulse-og6r.onrender.com](https://paypulse-og6r.onrender.com)

---

# 💡 Future Improvements

* Two-Factor Authentication (2FA)
* Profile picture upload
* Transaction pagination
* Advanced monthly spending analytics
* Email notifications for transactions
* Spending category analysis
* Recurring payments
* Enhanced account security monitoring
* Admin dashboard

---

# 📬 Contact

**Qasim Ali**

GitHub:
[https://github.com/QasimAli13](https://github.com/QasimAli13)

LinkedIn:
[https://www.linkedin.com/in/qasim-ali-18b485330](https://www.linkedin.com/in/qasim-ali-18b485330)

---

<p align="center">

Made with ❤️ using React, Node.js, Express.js and MongoDB.

</p>
```
