import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE = "https://paypulse-og6r.onrender.com/api/vaults";

const Vaults = ({ onBalanceChange }) => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState(null);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [lockUntil, setLockUntil] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchVaults = async () => {
    try {
      const { data } = await axios.get(API_BASE, getAuthHeaders());
      setVaults(data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to load vaults");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const handleCreateVault = async (e) => {
    e.preventDefault();

    if (Number(targetAmount) <= 0) {
      return toast.error("Target amount must be greater than 0");
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/create`,
        {
          title,
          targetAmount: Number(targetAmount),
          lockUntil,
        },
        getAuthHeaders(),
      );

      toast.success(data.message || "Vault created successfully");
      setShowCreateModal(false);

      setTitle("");
      setTargetAmount("");
      setLockUntil("");

      fetchVaults();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create vault");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (Number(depositAmount) <= 0) {
      return toast.error("Deposit amount must be greater than 0");
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/deposit`,
        {
          vaultId: selectedVault._id,
          amount: Number(depositAmount),
        },
        getAuthHeaders(),
      );

      toast.success(data.message || "Deposit successful");
      setShowDepositModal(false);
      setDepositAmount("");

      fetchVaults();

      if (onBalanceChange) {
        onBalanceChange();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (vault) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/withdraw`,
        {
          vaultId: vault._id,
        },
        getAuthHeaders(),
      );

      toast.success(data.message || "Withdrawal successful");
      fetchVaults();

      if (onBalanceChange) {
        onBalanceChange();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <div className="vaults-container" style={{ marginTop: 0 }}>
      <div className="vaults-header">
        <div>
          <h2 className="vaults-title">Smart Savings Vaults</h2>
          <p className="vaults-subtitle">
            Lock funds toward specific financial targets.
          </p>
        </div>

        <button
          className="vault-create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + New Vault
        </button>
      </div>

      {loading ? (
        <div className="vault-loading">
          <p>Syncing savings goals...</p>
        </div>
      ) : vaults.length === 0 ? (
        <div className="vault-empty">
          <div className="vault-empty-icon">🛡️</div>
          <h3>No Active Vaults</h3>
          <p>Create a locked goal vault to earn discipline on your spending.</p>
        </div>
      ) : (
        <div className="vaults-grid">
          {vaults.map((vault) => {
            const target = vault.targetAmount || 1;
            const saved = vault.savedAmount || 0;
            const percentage = Math.min(
              Math.round((saved / target) * 100),
              100,
            );
            const isLocked =
              new Date() < new Date(vault.lockUntil) && !vault.isCompleted;

            return (
              <div className="vault-card" key={vault._id}>
                <div className="vault-card-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>🎯</span>
                    <h3>{vault.title}</h3>
                  </div>
                  <span
                    className={
                      isLocked ? "vault-status locked" : "vault-status unlocked"
                    }
                  >
                    {isLocked ? "🔒 Locked" : "🔓 Available"}
                  </span>
                </div>

                <div className="vault-progress">
                  <div
                    className={`vault-progress-bar ${
                      percentage === 100 ? "completed" : ""
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="vault-amounts">
                  <div>
                    <span className="vault-saved">
                      $
                      {Number(saved).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginLeft: "4px",
                      }}
                    >
                      saved
                    </span>
                  </div>
                  <span className="vault-target">
                    Goal: $
                    {Number(target).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}{" "}
                    ({percentage}%)
                  </span>
                </div>

                <p className="vault-lock-date" style={{ margin: "4px 0 14px" }}>
                  Matures on:{" "}
                  <strong>
                    {new Date(vault.lockUntil).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </p>

                <div className="vault-actions">
                  <button
                    className="vault-deposit-btn"
                    onClick={() => {
                      setSelectedVault(vault);
                      setShowDepositModal(true);
                    }}
                  >
                    + Add Funds
                  </button>

                  <button
                    className="vault-withdraw-btn"
                    onClick={() => handleWithdraw(vault)}
                    disabled={isLocked || saved === 0}
                    title={
                      isLocked
                        ? "Funds are locked until maturity date"
                        : "Withdraw to main balance"
                    }
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CREATE VAULT MODAL ===== */}
      {showCreateModal && (
        <div className="vault-modal-overlay">
          <div className="vault-modal">
            <button
              className="vault-modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>

            <div className="vault-modal-icon">🎯</div>
            <h2>Create Savings Goal</h2>
            <p className="vault-modal-description">
              Set your target amount and lock funds until your target date.
            </p>

            <form onSubmit={handleCreateVault} className="vault-form">
              <label>Goal Title</label>
              <input
                type="text"
                placeholder="e.g. Emergency Fund, Laptop, Travel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Target Amount ($)</label>
              <input
                type="number"
                placeholder="1000"
                min="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />

              <label>Lock Funds Until</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={lockUntil}
                onChange={(e) => setLockUntil(e.target.value)}
                required
              />

              <button type="submit" className="vault-modal-primary-btn">
                Initialize Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== DEPOSIT MODAL ===== */}
      {showDepositModal && selectedVault && (
        <div className="vault-modal-overlay">
          <div className="vault-modal">
            <button
              className="vault-modal-close"
              onClick={() => setShowDepositModal(false)}
            >
              ✕
            </button>

            <div className="vault-modal-icon">💰</div>
            <h2>Deposit to {selectedVault.title}</h2>
            <p className="vault-modal-description">
              Transfer funds from your main balance into this locked goal.
            </p>

            <form onSubmit={handleDeposit} className="vault-form">
              <label>Amount ($)</label>
              <input
                type="number"
                placeholder="100"
                min="1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />

              <button type="submit" className="vault-modal-primary-btn">
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaults;
