const express = require("express");
const router = express.Router();
const loginRegisterController = require("@controllers/loginRegisterController");

// Views
router.get("/login", loginRegisterController.renderLogin);
router.get("/reqResetPassword", loginRegisterController.renderResetPassword);
router.get("/register", loginRegisterController.renderRegister);
router.get("/resetPassword/:token", loginRegisterController.renderResetPasswordForm);

// APIs
router.post("/login", loginRegisterController.login);
router.post("/logout", loginRegisterController.logout);
router.post("/register", loginRegisterController.register);
router.post("/resetPassword", loginRegisterController.sendResetLink);
router.post("/resetPassword/:token", loginRegisterController.handleResetPassword);

module.exports = router;
