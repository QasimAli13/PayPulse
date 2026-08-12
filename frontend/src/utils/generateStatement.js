import jsPDF from "jspdf";

export const generateStatement = (transactions, user) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calculate Totals
  let totalSent = 0;
  let totalReceived = 0;

  transactions.forEach((tx) => {
    const isSender = tx.sender?._id === user._id;
    if (isSender) {
      totalSent += Number(tx.amount || 0);
    } else {
      totalReceived += Number(tx.amount || 0);
    }
  });

  // Header Banner
  doc.setFillColor(30, 41, 59); // Dark Navy
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PayPulse", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ACCOUNT STATEMENT", 196, 22, { align: "right" });

  // User Summary Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Account Details", 14, 52);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Account Holder: ${user?.fullName || "Valued Customer"}`, 14, 60);
  doc.text(`Account Number: ${user?.accountNumber || "N/A"}`, 14, 66);
  doc.text(`Email: ${user?.email || "N/A"}`, 14, 72);

  doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, 196, 60, { align: "right" });
  doc.text(`Current Balance: $${user?.balance?.toFixed(2) || "0.00"}`, 196, 66, { align: "right" });

  // Summary Box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 80, 182, 20, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 80, 182, 20, "S");

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Transactions: ${transactions.length}`, 24, 92);
  doc.setTextColor(220, 38, 38);
  doc.text(`Total Sent: -$${totalSent.toFixed(2)}`, 90, 92);
  doc.setTextColor(22, 163, 74);
  doc.text(`Total Received: +$${totalReceived.toFixed(2)}`, 150, 92);

  // Table Headers
  let startY = 112;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 182, 8, "F");

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Date", 18, startY + 5.5);
  doc.text("Type", 50, startY + 5.5);
  doc.text("Description", 85, startY + 5.5);
  doc.text("Amount", 190, startY + 5.5, { align: "right" });

  // Table Rows
  startY += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  transactions.forEach((tx) => {
    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }

    const isSender = tx.sender?._id === user._id;
    const dateStr = new Date(tx.createdAt).toLocaleDateString();
    const typeStr = isSender ? "Debit (Sent)" : "Credit (Received)";
    const descStr = (tx.description || "N/A").substring(0, 35);
    const amountStr = `${isSender ? "-" : "+"}$${Number(tx.amount || 0).toFixed(2)}`;

    doc.setTextColor(71, 85, 105);
    doc.text(dateStr, 18, startY);
    doc.text(typeStr, 50, startY);
    doc.text(descStr, 85, startY);

    if (isSender) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(22, 163, 74);
    }
    doc.text(amountStr, 190, startY, { align: "right" });

    // Divider Line
    doc.setDrawColor(241, 245, 249);
    doc.line(14, startY + 2, 196, startY + 2);

    startY += 8;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PayPulse Digital Banking - Confidential System Generated Statement", 105, 287, { align: "center" });

  doc.save(`PayPulse_Statement_${user?.accountNumber || "Account"}.pdf`);
};