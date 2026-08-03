import React, { useState } from "react";

function TransactionTable({ transactions, currentUserId }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions.filter((tx) => {
    const isDebit = tx.sender?._id === currentUserId;

    const matchesSearch = tx.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "debit" && isDebit) ||
      (filter === "credit" && !isDebit);

    return matchesSearch && matchesFilter;
  });

  if (transactions.length === 0) {
    return <p className="empty-state">No transactions logged yet.</p>;
  }

  return (
    <div className="table-container">
      <div className="table-controls">
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

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">
                No matching transactions found.
              </td>
            </tr>
          ) : (
            filteredTransactions.map((tx) => {
              const isDebit = tx.sender?._id === currentUserId;

              return (
                <tr key={tx._id}>
                  <td>
                    <span
                      className={isDebit ? "debit-badge" : "credit-badge"}
                    >
                      {isDebit ? "↑ Sent" : "↓ Received"}
                    </span>
                  </td>

                  <td>{tx.description}</td>

                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>

                  <td
                    className={isDebit ? "debit-amount" : "credit-amount"}
                  >
                    {isDebit ? "-" : "+"}${tx.amount.toFixed(2)}
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