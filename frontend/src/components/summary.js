import toast from "react-hot-toast";

function AccountSummary({ user, onOpenModal }) {
  if (!user) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.accountNumber);
      toast.success("Account number copied!");
    } catch (error) {
      toast.error("Failed to copy account number");
    }
  };

  return (
    <div className="summary-container">
      <div className="balance-card">
        <h3>Current Balance</h3>
        <h1 className="balance-amount">${user.balance}</h1>
      </div>

      <div className="account-card">
        <h3>Account Number</h3>

        <div className="account-row">
          <h2>{user.accountNumber}</h2>

          <span className="active-badge">Verified Active</span>

          <button className="copy-btn" onClick={handleCopy}>
            Copy
          </button>
        </div>

        <button className="send-btn" onClick={onOpenModal}>
          Send Money
        </button>
      </div>
    </div>
  );
}

export default AccountSummary;
