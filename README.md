# 💳 PayPulse

<p align="center">

A modern full-stack banking web application built using the MERN Stack.

Secure authentication, money transfers, transaction management, and account security — all in one responsive web application.

</p>

---

## 🌐 Live Demo

**Frontend**

https://pay-pulse-three.vercel.app/

**Backend API**

https://paypulse-og6r.onrender.com

---

## 📌 Project Overview

PayPulse is a full-stack banking web application developed using the MERN Stack. The project simulates a real-world online banking system where registered users can securely manage their account, transfer money to other users, monitor transaction history, and update their account credentials.

The goal of this project is to demonstrate practical implementation of authentication, authorization, database management, REST APIs, and responsive frontend development by building an application that closely resembles the core workflow of an actual banking system.

Instead of being a simple CRUD application, PayPulse combines secure authentication with banking features such as real-time balance updates, protected routes, transaction tracking, and account management.

---

# ✨ Features

## 🔐 Authentication

- Register a new account
- Secure user login
- JWT Authentication
- Protected Routes
- Logout
- Forgot Password
- Change Password

---

## 💳 Banking Features

- Automatically generated account number
- View account balance
- Transfer money securely
- Real-time balance updates
- Copy account number with one click

---

## 📄 Transaction Management

- Complete transaction history
- Sent transactions
- Received transactions
- Search transactions
- Filter transactions
- Date & amount tracking

---

## 👤 Account Settings

- View profile information
- View account details
- View current balance
- Change password securely

---

## 🎨 User Experience

- Responsive Design
- Mobile Friendly
- Modern Banking UI
- Toast Notifications
- Smooth Animations
- Simple User Interface

---

# 🛠 Tech Stack

### Frontend

- React.js
- Axios
- React Hot Toast
- Lucide React
- CSS3

---

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

---

### Database

- MongoDB Atlas

---

# 📁 Project Structure

```
PayPulse
│
├── client
│   ├── public
│   ├── src
│   │
│   ├── components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Navbar.js
│   │   ├── AccountSummary.js
│   │   ├── TransactionTable.js
│   │   ├── TransferModal.js
│   │   └── ProfileSettings.js
│   │
│   ├── App.js
│   ├── App.css
│   └── main.js
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── config
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ How It Works

### 1. User Registration

A new user creates an account by entering:

- Full Name
- Email Address
- Password

After successful registration, a unique bank account number is automatically generated and an initial balance is assigned.

---

### 2. User Login

The user logs in using email and password.

After successful authentication, the backend generates a JWT token which is stored on the client side and used for all protected requests.

---

### 3. Authentication

Every protected API request includes the JWT token inside the Authorization header.

The backend verifies the token before allowing access to protected resources.

This ensures that only authenticated users can access their banking information.

---

### 4. Money Transfer

Users can transfer money using another user's account number.

Before processing the transaction, the backend validates:

- Receiver account exists
- Sender has sufficient balance
- Sender is not transferring to themselves

If validation succeeds:

- Sender balance decreases
- Receiver balance increases
- Transaction is stored in MongoDB
- Updated balance is returned to the frontend

---

### 5. Transaction History

Every successful transfer creates a permanent transaction record.

Users can:

- View all transactions
- Search transactions
- Filter Sent transactions
- Filter Received transactions

Each transaction displays:

- Type
- Description
- Date
- Amount

---

### 6. Account Security

Users can securely update their password after verifying their current password.

Passwords are encrypted using **bcrypt** before being stored in MongoDB.

---
# 🚀 Getting Started

## Prerequisites

Make sure the following software is installed on your computer.

- Node.js
- npm
- MongoDB Atlas Account
- Git

---
# 📥 Installation

### Clone the Repository

```bash
git clone https://github.com/QasimAli13/PayPulse.git
cd PayPulse
```

### Install Backend

```bash
cd server
npm install
npm run dev
```

### Install Frontend

Open a new terminal.

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```
[http://localhost:5173]
```
# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| PUT | /api/auth/change-password | Change Password |

---

## Banking

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/bank/user-data | Get User Details |
| POST | /api/bank/transfer | Transfer Money |
| GET | /api/bank/transactions | Get Transaction History |

---

# 🔒 Security Features

- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt
- Authentication Middleware
- Secure API Requests
- Input Validation
- Unauthorized Access Prevention

---

# 📱 Responsive Design

The application is fully responsive and works across:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# ☁️ Deployment

### Frontend

Deployed using **Vercel**

```
https://pay-pulse-three.vercel.app/
```

---

### Backend

Deployed using **Render**

```
https://paypulse-og6r.onrender.com
```

# 💡 Future Improvements

Some features that can be added in future versions include:

- Email verification
- Profile picture upload
- Two-Factor Authentication (2FA)
- Dark Mode
- Download transaction history as PDF
- Monthly spending analytics
- Email notifications after transactions
- Pagination for transaction history

---

<p align="center">
Made with ❤️ using React, Node.js, Express.js and MongoDB.
</p>
