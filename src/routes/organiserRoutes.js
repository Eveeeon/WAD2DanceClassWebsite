const express = require("express");
const router = express.Router();
const manageCoursesController = require("../controllers/manageCoursesController");
const { ensureCourseOrganiser, ensureClassOrganiser } = require("../middleware/auth");

// View
router.get("/manageCourses", manageCoursesController.getManageCourses);

// Course management
router.post("/courses/:id/cancel", ensureCourseOrganiser, manageCoursesController.cancelCourse);
router.post("/courses/:id/updateField", ensureCourseOrganiser, manageCoursesController.updateCourseField);
router.post("/courses/:id/addOrganiser", ensureCourseOrganiser, manageCoursesController.addCourseOrganiser);
router.post("/courses/:id/removeOrganiser/:organiserId/remove", ensureCourseOrganiser, manageCoursesController.removeCourseOrganiser);
router.post("/courses/:id/removeAttendee/:email/remove", ensureCourseOrganiser, manageCoursesController.removeCourseAttendee);

// Class management
router.post("/classes/:id/cancel", ensureClassOrganiser, manageCoursesController.cancelClass);
router.post("/classes/:id/updateField", ensureClassOrganiser, manageCoursesController.updateClassField);
router.post("/classes/:id/removeAttendee/:email/remove", ensureClassOrganiser, manageCoursesController.removeClassAttendee);

module.exports = router;
