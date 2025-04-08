const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const courseController = require("../controllers/courseController");
const aboutController = require("../controllers/aboutController");
const classController = require("../controllers/classController");
const cancelController = require("../controllers/cancelController");

router.get("/", homeController.getHome);
router.get("/about", aboutController.getAbout);
router.get("/courses", courseController.getCourses);
router.post("/courses/register", courseController.registerForCourse);
router.get("/classes", classController.getClasses);
router.get("/classes/:direction", classController.changeMonth);
router.post("/classes/register", classController.registerForClass);
router.get("/cancelCourse/:token", cancelController.cancelCourse);
router.get("/cancelClass/:token", cancelController.cancelClass);


module.exports = router;
