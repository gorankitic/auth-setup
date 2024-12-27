const express = require("express");
const { signup, verifyEmail, signin, signout, forgotPassword, resetPassword, updatePassword, createNewVerificationToken } = require("../controllers/authController");
const { updateMe, deleteMe, getUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddlewares");
const { loginLimiter } = require("../middlewares/limiters");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", loginLimiter, signin);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protected routes
router.get("/", protect, getUser);

router.get("/signout", protect, signout);

router.get("/newVerification", protect, createNewVerificationToken);

router.post("/verifyEmail", protect, verifyEmail);

router.patch("/updatePassword", protect, updatePassword);

router.patch("/updateMe", protect, updateMe);

router.delete("/deleteMe", protect, deleteMe);

module.exports = router;