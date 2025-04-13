const express = require("express");
const router = express.Router();
const manageCoursesController = require("../controllers/manageCoursesController");

router.get("/manageCourses", manageCoursesController.getManageCourses);

module.exports = router;
