import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

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

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchVaults = async () => {
    try {
      const { data } = await axios.get("https://paypulse-og6r.onrender.com/api/vaults", {
        headers,
      });

      setVaults(data);
    } catch (err) {
      toast.error("Failed to load vaults");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const handleCreateVault = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/vaults/create",
        {
          title,
          targetAmount,
          lockUntil,
        },
        { headers },
      );

      toast.success(data.message);
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

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/vaults/deposit",
        {
          vaultId: selectedVault._id,
          amount: depositAmount,
        },
        { headers },
      );

      toast.success(data.message);

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
        "https://paypulse-og6r.onrender.com/api/vaults/withdraw",
        {
          vaultId: vault._id,
        },
        { headers },
      );

      toast.success(data.message);

      fetchVaults();

      if (onBalanceChange) {
        onBalanceChange();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <div className="vaults-container">
      <div className="vaults-header">
        <div>
          <h2 className="vaults-title">Locked Savings Vaults</h2>

          <p className="vaults-subtitle">
            Save towards your goals with locked withdrawal security.
          </p>
        </div>

        <button
          className="vault-create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + New Goal Vault
        </button>
      </div>

      {loading ? (
        <div className="vault-loading">
          <p>Loading your goals...</p>
        </div>
      ) : vaults.length === 0 ? (
        <div className="vault-empty">
          <div className="vault-empty-icon">🔒</div>

          <h3>No Savings Goals Yet</h3>

          <p>Create your first vault and start saving towards a goal.</p>
        </div>
      ) : (
        <div className="vaults-grid">
          {vaults.map((vault) => {
            const percentage = Math.min(
              Math.round((vault.savedAmount / vault.targetAmount) * 100),
              100,
            );

            const isLocked =
              new Date() < new Date(vault.lockUntil) && !vault.isCompleted;

            return (
              <div className="vault-card" key={vault._id}>
                <div className="vault-card-header">
                  <h3>{vault.title}</h3>

                  <span
                    className={
                      isLocked ? "vault-status locked" : "vault-status unlocked"
                    }
                  >
                    {isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                  </span>
                </div>

                <p className="vault-lock-date">
                  Locked until:{" "}
                  <strong>
                    {new Date(vault.lockUntil).toLocaleDateString()}
                  </strong>
                </p>

                <div className="vault-progress">
                  <div
                    className={`vault-progress-bar ${
                      percentage === 100 ? "completed" : ""
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="vault-amounts">
                  <span className="vault-saved">${vault.savedAmount}</span>

                  <span className="vault-target">
                    Goal: ${vault.targetAmount} ({percentage}%)
                  </span>
                </div>

                <div className="vault-actions">
                  <button
                    className="vault-deposit-btn"
                    onClick={() => {
                      setSelectedVault(vault);
                      setShowDepositModal(true);
                    }}
                  >
                    + Add Money
                  </button>

                  <button
                    className="vault-withdraw-btn"
                    onClick={() => handleWithdraw(vault)}
                    disabled={isLocked || vault.savedAmount === 0}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Vault Modal */}
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
              Set a target and lock your savings until your goal date.
            </p>

            <form onSubmit={handleCreateVault} className="vault-form">
              <label>Goal Title</label>

              <input
                type="text"
                placeholder="e.g. New Laptop"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Target Amount ($)</label>

              <input
                type="number"
                placeholder="500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />

              <label>Lock Savings Until</label>

              <input
                type="date"
                value={lockUntil}
                onChange={(e) => setLockUntil(e.target.value)}
                required
              />

              <button type="submit" className="vault-modal-primary-btn">
                Start Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
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
              Transfer money from your main balance into this savings vault.
            </p>

            <form onSubmit={handleDeposit} className="vault-form">
              <label>Amount to Transfer from Main Balance ($)</label>

              <input
                type="number"
                placeholder="100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />

              <button type="submit" className="vault-modal-primary-btn">
                Confirm Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaults;
