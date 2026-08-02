const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  handleTransfer,
  getTransactions,
  getUserData,
} = require("../controllers/bankControllers");

router.post("/transfer", protect, handleTransfer);

router.get("/transactions", protect, getTransactions);
router.get("/user-data", protect, getUserData);

module.exports = router;
