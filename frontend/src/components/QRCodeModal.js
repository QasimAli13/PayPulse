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
          console.log("Camera access error or file scan preferred", err);
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
    <div className="qr-modal-overlay">
      <div className="qr-modal">
        <button className="qr-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Tabs */}
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

        {/* My QR */}
        {activeTab === "myQr" ? (
          <div className="my-qr-section">
            <h3 className="qr-user-name">{user?.fullName}</h3>

            <p className="qr-account-number">
              Account Number: <strong>{user?.accountNumber}</strong>
            </p>

            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={user?.accountNumber || "0000000000"}
                size={200}
              />
            </div>

            <p className="qr-help-text">
              Scan this code from any PayPulse app to send money instantly.
            </p>
          </div>
        ) : (
          /* Scanner */
          <div className="qr-scanner-section">
            <h3 className="qr-scanner-title">Scan Receiver's QR Code</h3>

            <div id="reader" className="qr-reader"></div>

            <p className="qr-scanner-help">
              {isScanning
                ? "Point your camera at a PayPulse QR Code"
                : "Starting camera..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeModal;
