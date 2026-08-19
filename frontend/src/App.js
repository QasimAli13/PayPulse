// App.js
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
import Vaults from "./components/Vaults";
import QRCodeModal from "./components/QRCodeModal";
import FloatingDock from "./components/FloatingDock";

const API_BASE = "https://paypulse-og6r.onrender.com/api";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialAccount, setInitialAccount] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bank/user-data`, getConfig());
      setUser(res.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bank/transactions`, getConfig());
      setTransactions(res.data);
    } catch (error) {
      console.error("Fetch transactions error:", error);
    }
  };

  const handleTransfer = async (receiverAccountNumber, amount, setError) => {
    try {
      await axios.post(
        `${API_BASE}/bank/transfer`,
        { receiverAccountNumber, amount: Number(amount) },
        getConfig(),
      );

      await Promise.all([fetchUserData(), fetchTransactions()]);
      toast.success(
        `✅ Successfully sent $${amount} to ${receiverAccountNumber}!`,
      );
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Transfer failed";
      setError(message);
      toast.error(`❌ ${message}`);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTransactions([]);
    toast.success("👋 Logged out successfully");
  };

  const handleQrScanned = (scannedAccountNumber) => {
    setInitialAccount(scannedAccountNumber);
    setShowQrModal(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData();
      fetchTransactions();
    }
  }, []);

  // Auth Screen
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
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <AccountSummary
            user={user}
            onOpenModal={() => {
              setInitialAccount("");
              setIsModalOpen(true);
            }}
            transactions={transactions || []}
          />
        )}

        {/* Transfers */}
        {activeTab === "transfers" && (
          <TransferModal
            isOpen={true}
            onClose={() => setActiveTab("dashboard")}
            onTransfer={handleTransfer}
            user={user}
          />
        )}

        {/* Transactions */}
        {activeTab === "transactions" && (
          <TransactionTable
            transactions={transactions}
            currentUserId={user._id}
            user={user}
          />
        )}

        {/* QR */}
        {activeTab === "qr" && (
          <QRCodeModal
            isOpen={true}
            onClose={() => setActiveTab("dashboard")}
            user={user}
            onScanSuccess={handleQrScanned}
          />
        )}

        {/* Vaults */}
        {activeTab === "vaults" && <Vaults onBalanceChange={fetchUserData} />}

        {/* Settings */}
        {activeTab === "settings" && <ProfileSettings user={user} />}
      </main>

      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
