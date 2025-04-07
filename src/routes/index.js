const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const courseController = require("../controllers/courseController");
const aboutController = require("../controllers/aboutController");
const classController = require("../controllers/classController");

router.get("/", homeController.getHome);
router.get("/about", aboutController.getAbout);
router.get("/courses", courseController.getCourses);
router.post("/courses/register", courseController.registerForCourse);
router.get("/classes", classController.getClasses);
router.post("/classes/register", classController.registerForClass);


module.exports = router;
