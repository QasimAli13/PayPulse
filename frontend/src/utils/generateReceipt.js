import jsPDF from "jspdf";

export const generateReceipt = (transaction, currentUserId) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 150], // Receipt size format
  });

  const isSender = transaction.sender?._id === currentUserId;
  const isReceived = !isSender;

  doc.setFillColor(30, 41, 59); 
  doc.rect(0, 0, 100, 25, "F");

  // App Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PayPulse", 50, 12, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Official Transaction Receipt", 50, 18, { align: "center" });

  // Status Badge
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("✔ SUCCESSFUL", 50, 35, { align: "center" });

  // Amount Display
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.text(`${isReceived ? "+" : "-"}$${transaction.amount}`, 50, 46, {
    align: "center",
  });

  // Line Separator
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 52, 90, 52);

  // Details Section
  doc.setFontSize(9);

  // Transaction ID
  doc.setTextColor(100, 116, 139);
  doc.text("Transaction ID:", 10, 60);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(transaction._id.substring(0, 16) + "...", 90, 60, {
    align: "right",
  });

  // Date
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Date & Time:", 10, 68);
  doc.setTextColor(15, 23, 42);
  doc.text(
    new Date(transaction.createdAt).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    90,
    68,
    { align: "right" },
  );

  // Type
  doc.setTextColor(100, 116, 139);
  doc.text("Transaction Type:", 10, 76);
  doc.setTextColor(15, 23, 42);
  doc.text(isReceived ? "Received Payment" : "Funds Transfer", 90, 76, {
    align: "right",
  });

  // Sender
  doc.setTextColor(100, 116, 139);
  doc.text("From:", 10, 84);
  doc.setTextColor(15, 23, 42);
  doc.text(transaction.sender?.fullName || "External Account", 90, 84, {
    align: "right",
  });

  // Receiver
  doc.setTextColor(100, 116, 139);
  doc.text("To:", 10, 92);
  doc.setTextColor(15, 23, 42);
  doc.text(transaction.receiver?.fullName || "External Account", 90, 92, {
    align: "right",
  });

  // Line Separator
  doc.line(10, 100, 90, 100);

  // Footer Note
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for using PayPulse Digital Banking.", 50, 110, {
    align: "center",
  });
  doc.text("This is a computer-generated receipt.", 50, 115, {
    align: "center",
  });

  // Auto Download Trigger
  doc.save(`PayPulse_Receipt_${transaction._id.substring(0, 8)}.pdf`);
};
