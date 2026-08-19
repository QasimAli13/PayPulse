// components/summary.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  CalendarDays,
} from "lucide-react";

function AccountSummary({ user, onOpenModal, transactions = [] }) {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    monthlyTransactions: 0,
  });

  useEffect(() => {
    if (!user) return;

    if (transactions && transactions.length > 0) {
      let sent = 0;
      let received = 0;
      const now = new Date();
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );

      let monthly = 0;

      transactions.forEach((tx) => {
        if (tx.sender?._id === user._id) {
          sent += tx.amount || 0;
        } else {
          received += tx.amount || 0;
        }

        const txDate = new Date(tx.createdAt);
        if (txDate > monthAgo) {
          monthly++;
        }
      });

      setStats({
        totalSent: sent,
        totalReceived: received,
        monthlyTransactions: monthly,
      });
    } else {
      setStats({
        totalSent: 0,
        totalReceived: 0,
        monthlyTransactions: 0,
      });
    }
  }, [transactions, user]);

  if (!user) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.accountNumber);
      toast.success("Account number copied!");
    } catch (error) {
      toast.error("Failed to copy account number");
    }
  };

  const currentDate = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);

  // Get recent transactions (last 3)
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="dashboard-wrapper">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h1 className="welcome-title">
            Welcome back, <span>{user.fullName || user.name || "User"}!</span>
          </h1>
          <p className="welcome-date">
            <CalendarDays size={16} />
            {formattedDate}
          </p>
        </div>
        <div className="welcome-badge">
          <Sparkles size={18} />
          <span>Premium</span>
        </div>
      </div>

      {/* Main Summary Cards */}
      <div className="summary-grid">
        {/* Balance Card */}
        <div className="balance-card">
          <div className="card-header">
            <h3>Total Balance</h3>
            <span className="card-icon">💰</span>
          </div>
          <h1 className="balance-amount">
            ${parseFloat(user.balance || 0).toFixed(2)}
          </h1>
          <div className="balance-footer">
            <div className="status-badge">
              <span className="status-dot active"></span>
              <span className="status-text">Active</span>
            </div>
            <div className="balance-change positive">
              <TrendingUp size={14} />
              <span>+2.4% this month</span>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div className="account-card">
          <div className="card-header">
            <h3>Account Overview</h3>
            <span className="card-icon">🏦</span>
          </div>

          <div className="account-detail-row">
            <span className="detail-label">
              <Wallet size={14} />
              Account Number
            </span>
            <div className="detail-value-row">
              <code className="account-number">
                {user.accountNumber || "N/A"}
              </code>
              <button className="copy-btn-small" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>

          <div className="account-detail-row">
            <span className="detail-label">
              <Building2 size={14} />
              Account Holder
            </span>
            <span className="detail-value">
              {user.fullName || user.name || "User"}
            </span>
          </div>

          <div className="account-detail-row last">
            <span className="detail-label">
              <ShieldCheck size={14} />
              Status
            </span>
            <span className="detail-value verified">
              <span className="verified-dot"></span>
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper sent">
            <TrendingDown size={20} />
          </div>
          <div>
            <span className="stat-label">Total Sent</span>
            <span className="stat-value">${stats.totalSent.toFixed(2)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper received">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="stat-label">Total Received</span>
            <span className="stat-value">
              ${stats.totalReceived.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper activity">
            <Clock size={20} />
          </div>
          <div>
            <span className="stat-label">Monthly Activity</span>
            <span className="stat-value">{stats.monthlyTransactions} tx</span>
          </div>
        </div>
      </div>

      {/* Recent Activity - Without Red Bars */}
      {transactions.length > 0 ? (
        <div className="activity-preview">
          <div className="activity-header">
            <h3>📋 Recent Activity</h3>
            <span className="activity-count">{transactions.length} total</span>
          </div>

          <div className="activity-list">
            {recentTransactions.map((tx, index) => {
              const isSent = tx.sender?._id === user._id;
              const amount = tx.amount || 0;

              return (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{isSent ? "↑" : "↓"}</div>

                  <div className="activity-info">
                    <span className="activity-desc">
                      {tx.description || "Transaction"}
                    </span>

                    <span className="activity-date">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`activity-amount ${
                      isSent ? "sent" : "received"
                    }`}
                  >
                    {isSent ? "-" : "+"}${amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-activity">
          <div className="empty-icon">📭</div>
          <h3>No Transactions Yet</h3>
          <p>Your recent activity will appear here</p>
        </div>
      )}
    </div>
  );
}

export default AccountSummary;
