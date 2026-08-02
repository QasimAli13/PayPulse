const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgetPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
