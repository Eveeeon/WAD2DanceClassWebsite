const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const aboutController = require("../controllers/aboutController");
const classController = require("../controllers/classController");
const courseController = require("../controllers/courseController");
const cancelController = require("../controllers/cancelController");

// Views
router.get("/", homeController.getHome);
router.get("/about", aboutController.getAbout);
router.get("/courses", courseController.getCourses);
router.get("/classes", classController.getClasses);
router.get("/classes/:direction", classController.changeMonth);
router.get("/cancelCourse/:token", cancelController.cancelCourse);
router.get("/cancelClass/:token", cancelController.cancelClass);

// APIs
router.post("/courses/register", courseController.registerForCourse);
router.post("/classes/register", classController.registerForClass);

module.exports = router;
