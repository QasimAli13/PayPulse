import { useState } from "react";


function TransferModal({ isOpen, onClose, onTransfer }) {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  // Handler to auto-fill system test account
  const handleUseTestAccount = () => {
    setReceiverAccountNumber("PAYP-TEST-9999");
    setError(""); // Clear error on selecting test account
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const success = await onTransfer(receiverAccountNumber, amount, setError);

    if (success) {
      setReceiverAccountNumber("");
      setAmount("");
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="transfer-modal">
        <h2>Send Money</h2>


        <div className="test-account-box">
          <div className="test-account-info">
            <p className="test-account-title">Testing Solo?</p>
            <p className="test-account-sub">Use default system test vault</p>
          </div>
          <button
            type="button"
            className="test-account-btn"
            onClick={handleUseTestAccount}
          >
            Fill Test A/C
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="text"
            placeholder="Receiver Account Number"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
          />

          <input
            className="modal-input"
            type="number"
            min="1"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="modal-buttons">
            <button className="close-btn" type="button" onClick={onClose}>
              Close
            </button>

            <button className="transfer-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                "Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferModal;