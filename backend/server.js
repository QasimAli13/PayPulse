const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const https = require("https");

const connectDB = require("./config/db");

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bank", require("./routes/bankRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vaults", require("./routes/vaultRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(
  () => {
    https
      .get("https://paypulse-og6r.onrender.com/api/auth/login", (res) => {
        console.log("Self-ping keep-alive status:", res.statusCode);
      })
      .on("error", (err) => {
        console.error("Keep-alive ping error:", err.message);
      });
  },
  10 * 60 * 1000,
);
