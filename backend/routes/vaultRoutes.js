const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createVault,
  depositToVault,
  withdrawFromVault,
  getUserVaults,
} = require("../controllers/vaultController");

router.post("/create", protect, createVault);
router.post("/deposit", protect, depositToVault);
router.post("/withdraw", protect, withdrawFromVault);
router.get("/", protect, getUserVaults);

module.exports = router;