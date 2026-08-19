// components/FloatingDock.jsx
import React from "react";
import { 
  Home, 
  Send, 
  Receipt, 
  QrCode, 
  Shield, 
  Settings 
} from "lucide-react";

function FloatingDock({ activeTab, setActiveTab }) {
  const dockItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "transfers", label: "Send", icon: Send },
    { id: "transactions", label: "History", icon: Receipt },
    { id: "qr", label: "QR", icon: QrCode },
    { id: "vaults", label: "Vaults", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="floating-dock-container">
      <div className="floating-dock-glass">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`dock-btn ${isActive ? "active" : ""}`}
              type="button"
            >
              <div className="dock-icon-wrapper">
                <Icon size={22} />
              </div>
              <span className="dock-label">{item.label}</span>
              {isActive && <span className="dock-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FloatingDock;