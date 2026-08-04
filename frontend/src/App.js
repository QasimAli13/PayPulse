import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import AccountSummary from "./components/summary";
import TransactionTable from "./components/TransactionTable";
import TransferModal from "./components/TransferModal";
import ProfileSettings from "./components/ProfileSettings";

const API_BASE = "https://paypulse-og6r.onrender.com/api";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bank/user-data`, getConfig());

      setUser(res.data);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bank/transactions`, getConfig());

      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransfer = async (receiverAccountNumber, amount, setError) => {
    try {
      await axios.post(
        `${API_BASE}/bank/transfer`,
        {
          receiverAccountNumber,
          amount: Number(amount),
        },
        getConfig(),
      );

      await fetchUserData();
      await fetchTransactions();

      toast.success(
        `Successfully sent $${amount} to ${receiverAccountNumber}!`,
      );

      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Transfer failed";

      setError(message);
      toast.error(message);

      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTransactions([]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserData();
      fetchTransactions();
    }
  }, []);

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          {showLogin ? (
            <>
              <Login onLogin={setUser} />

              <p className="auth-switch">
                Don't have an account?{" "}
                <button
                  className="link-btn"
                  onClick={() => setShowLogin(false)}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register onRegister={setUser} />

              <p className="auth-switch">
                Already have an account?{" "}
                <button className="link-btn" onClick={() => setShowLogin(true)}>
                  Login
                </button>
              </p>
            </>
          )}
        </div>

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        user={user}
        onLogout={handleLogout}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {activePage === "dashboard" && (
          <>
            <AccountSummary
              user={user}
              onOpenModal={() => setIsModalOpen(true)}
            />

            <TransactionTable
              transactions={transactions}
              currentUserId={user._id}
            />
          </>
        )}

        {activePage === "settings" && <ProfileSettings user={user} />}

        <TransferModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTransfer={handleTransfer}
        />

        <Toaster position="top-right" reverseOrder={false} />
      </main>
    </div>
  );
}

export default App;
