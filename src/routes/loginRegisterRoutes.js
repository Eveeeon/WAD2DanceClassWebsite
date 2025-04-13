const express = require("express");
const router = express.Router();
const loginRegisterController = require("../controllers/loginRegisterController");

router.get("/login", loginRegisterController.renderLogin);
router.post("/login", loginRegisterController.login);
router.post("/logout", loginRegisterController.logout);
router.get("/register", loginRegisterController.renderRegister);
router.post("/register", loginRegisterController.register);
router.get("/reqResetPassword", loginRegisterController.renderResetPassword);
router.post("/resetPassword", loginRegisterController.sendResetLink);
router.get("/resetPassword/:token", loginRegisterController.renderResetPasswordForm);
router.post("/resetPassword/:token", loginRegisterController.handleResetPassword);

module.exports = router;
