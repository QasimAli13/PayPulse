const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgetPassword);

router.post("/reset-password", resetPassword);

router.put("/change-password", protect, changePassword);

module.exports = router;
