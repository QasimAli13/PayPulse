// components/TransferModal.jsx
import { useState } from "react";

function TransferModal({ isOpen, onClose, onTransfer, user }) {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUseTestAccount = () => {
    setReceiverAccountNumber("PAYP-TEST-9999");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await onTransfer(receiverAccountNumber, amount, setError);

    if (success) {
      setReceiverAccountNumber("");
      setAmount("");
      setTimeout(() => onClose(), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="page-transfers">
      <div className="page-header">
        <h2>💸 Send Money</h2>
        <p>Transfer funds to any PayPulse account</p>
      </div>

      <div className="transfer-balance-card">
        <span>Available Balance</span>
        <h3>${user?.balance?.toFixed(2)}</h3>
      </div>

      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="test-account-box">
          <div>
            <p className="test-account-title">🧪 Testing Solo?</p>
            <p className="test-account-sub">Use default system test account</p>
          </div>
          <button
            type="button"
            className="test-account-btn"
            onClick={handleUseTestAccount}
          >
            Fill Test
          </button>
        </div>

        {error && <div className="transfer-error">{error}</div>}

        <div className="form-group">
          <label>Receiver Account Number</label>
          <input
            type="text"
            placeholder="Enter account number"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="modal-buttons">
          <button type="button" className="close-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="transfer-btn" disabled={loading}>
            {loading ? "Processing..." : "Send Money"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransferModal;
