import React, { useState } from "react";
import { generateReceipt } from "../utils/generateReceipt";
import { generateStatement } from "../utils/generateStatement";

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
    return <p className="empty-state">No transactions logged yet.</p>;
  }

  return (
    <div className="table-container">
      <div
        className="table-controls"
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flex: 1 }}>
          <input
            type="text"
            placeholder="Search transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="debit">Sent</option>
            <option value="credit">Received</option>
          </select>
        </div>

        {/* Export Full Statement Button */}
        <button
          onClick={() =>
            generateStatement(transactions, user || { _id: currentUserId })
          }
          style={{
            background: "#1a365d",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          Export Statement PDF
        </button>
      </div>

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

              return (
                <tr key={tx._id}>
                  <td>
                    <span className={isDebit ? "debit-badge" : "credit-badge"}>
                      {isDebit ? "↑ Sent" : "↓ Received"}
                    </span>
                  </td>

                  <td>{tx.description}</td>

                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>

                  <td className={isDebit ? "debit" : "credit"}>
                    {isDebit ? "-" : "+"}$
                    {tx.amount ? tx.amount.toFixed(2) : "0.00"}
                  </td>

                  <td>
                    <button
                      onClick={() => generateReceipt(tx, currentUserId)}
                      style={{
                        background: "#e6eef7",
                        border: "1px solid #2c5282",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#1a365d",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
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
  );
}

export default TransactionTable;
