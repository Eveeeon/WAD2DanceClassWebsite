const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const courseController = require("../controllers/courseController");
const aboutController = require("../controllers/aboutController");
const classController = require("../controllers/classController");
const cancelController = require("../controllers/cancelController");
const loginRegisterController = require("../controllers/loginRegisterController");

router.get("/", homeController.getHome);
router.get("/about", aboutController.getAbout);
router.get("/courses", courseController.getCourses);
router.post("/courses/register", courseController.registerForCourse);
router.get("/classes", classController.getClasses);
router.get("/classes/:direction", classController.changeMonth);
router.post("/classes/register", classController.registerForClass);
router.get("/cancelCourse/:token", cancelController.cancelCourse);
router.get("/cancelClass/:token", cancelController.cancelClass);
router.get("/login", loginRegisterController.renderLogin);
router.post("/login", loginRegisterController.login);
router.get("/register", loginRegisterController.renderRegister);
router.post("/register", loginRegisterController.register);
router.get("/reqResetPassword", loginRegisterController.renderResetPassword);
router.post("/resetPassword", loginRegisterController.sendResetLink);
router.get("/resetPassword/:token", loginRegisterController.renderResetPasswordForm);
router.post("/resetPassword/:token", loginRegisterController.handleResetPassword);


module.exports = router;
