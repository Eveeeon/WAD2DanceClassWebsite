const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const courseController = require("../controllers/courseController");
const aboutController = require("../controllers/aboutController");
const calendarController = require("../controllers/calendarController");

router.get("/", homeController.getHome);
router.get("/courses", courseController.getCourses);
router.get("/about", aboutController.getAbout);
router.get("/calendar", calendarController.getCalendar);
router.get("/calendar/class/:courseId", calendarController.getClassDetails);

module.exports = router;
