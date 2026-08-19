// components/TransactionTable.jsx
import React, { useState } from "react";
import { generateReceipt } from "../utils/generateReceipt";
import { generateStatement } from "../utils/generateStatement";
import { FileText, Search, Filter, Download } from "lucide-react";

function TransactionTable({ transactions, currentUserId, user }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions.filter((tx) => {
    const isDebit = tx.sender?._id === currentUserId;
    const matchesSearch = (tx.description || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "debit" && isDebit) ||
      (filter === "credit" && !isDebit);
    return matchesSearch && matchesFilter;
  });

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state-container">
        <p className="empty-state">No transactions logged yet.</p>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <div className="table-header">
        <h3 className="table-title">Transaction History</h3>
        <div className="table-controls">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="debit">Sent</option>
            <option value="credit">Received</option>
          </select>

          <button
            onClick={() =>
              generateStatement(transactions, user || { _id: currentUserId })
            }
            className="export-btn"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Receipt</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isDebit = tx.sender?._id === currentUserId;
                const date = new Date(tx.createdAt);

                return (
                  <tr key={tx._id}>
                    <td>
                      <span className={`badge ${isDebit ? "debit" : "credit"}`}>
                        {isDebit ? "↑ Sent" : "↓ Received"}
                      </span>
                    </td>

                    <td className="description-cell">
                      {tx.description || "No description"}
                    </td>

                    <td>
                      <span className="date-cell">
                        {date.toLocaleDateString()}
                        <span className="time-cell">
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </td>

                    <td className={`amount ${isDebit ? "debit" : "credit"}`}>
                      {isDebit ? "-" : "+"}$
                      {tx.amount ? tx.amount.toFixed(2) : "0.00"}
                    </td>

                    <td>
                      <button
                        onClick={() => generateReceipt(tx, currentUserId)}
                        className="receipt-btn"
                      >
                        <FileText size={14} />
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
