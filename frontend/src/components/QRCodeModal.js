// components/QRCodeModal.jsx
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-hot-toast";

const QRCodeModal = ({ isOpen, onClose, user, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState("myQr");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isOpen && activeTab === "scan") {
      setIsScanning(true);

      html5QrcodeScanner = new Html5Qrcode("reader");

      const qrCodeSuccessCallback = (decodedText) => {
        toast.success(`Account Scanned: ${decodedText}`);

        if (onScanSuccess) {
          onScanSuccess(decodedText);
        }

        if (html5QrcodeScanner.isScanning) {
          html5QrcodeScanner.stop();
        }

        onClose();
      };

      const config = {
        fps: 10,
        qrbox: {
          width: 220,
          height: 220,
        },
      };

      html5QrcodeScanner
        .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch((err) => {
          console.log("Camera access error", err);
        });
    }

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner.stop().catch((e) => console.error(e));
      }
      setIsScanning(false);
    };
  }, [isOpen, activeTab, onClose, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="page-qr">
      <div className="page-header">
        <h2>📱 QR Code</h2>
        <p>Share your QR code or scan others to send money instantly</p>
      </div>

      <div className="qr-tabs">
        <button
          className={`qr-tab ${activeTab === "myQr" ? "active" : ""}`}
          onClick={() => setActiveTab("myQr")}
        >
          My QR Code
        </button>
        <button
          className={`qr-tab ${activeTab === "scan" ? "active" : ""}`}
          onClick={() => setActiveTab("scan")}
        >
          Scan QR
        </button>
      </div>

      {activeTab === "myQr" ? (
        <div className="qr-display">
          <div className="qr-user-info">
            <h3>{user?.fullName}</h3>
            <p>
              Account: <strong>{user?.accountNumber}</strong>
            </p>
          </div>
          <div className="qr-code-wrapper">
            <QRCodeSVG value={user?.accountNumber || "000000"} size={200} />
          </div>
          <p className="qr-help">Scan this code to send money instantly</p>
        </div>
      ) : (
        <div className="qr-scanner">
          {!isScanning ? (
            <button className="scan-btn" onClick={() => setActiveTab("scan")}>
              📷 Start Scanning
            </button>
          ) : (
            <>
              <div id="reader" className="qr-reader"></div>
              <p className="qr-help">Point camera at QR code</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeModal;
