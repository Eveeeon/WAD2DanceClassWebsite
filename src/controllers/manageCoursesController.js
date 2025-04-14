const courseDAO = require("../DAOs/CourseDAO");
const classDAO = require("../DAOs/ClassDAO");
const userDAO = require("../DAOs/userDAO");
const moment = require("moment");

// Helper function as we are already getting all organisers
const getOrganiserNameById = (organiserId, allOrganisers) => {
  const organiser = allOrganisers.find((org) => org._id === organiserId);
  return organiser ? organiser.name : "Unknown";
};

const getManageCourses = async (req, res) => {
  const organiserId = req.user.userId;

  try {
    const courses = await courseDAO.findByOrganiserId(organiserId);
    const allOrganisers = await userDAO.getAllOrganisers();

    const courseWithClasses = await Promise.all(
      courses.map(async (course, index) => {
        // Map organiser IDs to names using the preloaded allOrganisers list
        const organiserNames = (course.organisers || []).map((organiserId) =>
          getOrganiserNameById(organiserId, allOrganisers)
        );

        const classes = await classDAO.findByCourseId(course._id);

        const formattedClasses = await Promise.all(
          classes.map(async (cls) => {
            // For class organisers, use the same method
            const classOrganiserNames = (cls.organisers || []).map(
              (organiserId) => getOrganiserNameById(organiserId, allOrganisers)
            );

            return {
              ...cls,
              organiserNames: classOrganiserNames,
              formattedStartDateTime: moment(cls.startDateTime).format(
                "dddd, MMM Do YYYY, h:mm a"
              ),
              formattedEndDateTime: moment(cls.endDateTime).format(
                "dddd, MMM Do YYYY, h:mm a"
              ),
              isCancelled: cls.active === false,
            };
          })
        );

        // Sort classes by start date
        formattedClasses.sort(
          (a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)
        );

        return {
          ...course,
          organiserNames,
          formattedStartDate: moment(course.startDate).format(
            "dddd, MMMM Do YYYY"
          ),
          formattedEndDate: moment(course.endDate).format("dddd, MMMM Do YYYY"),
          classes: formattedClasses,
          isCancelled: course.active === false,
        };
      })
    );

    res.render("manageCourses", {
      title: "My Courses & Classes",
      courseWithClasses,
      allOrganisers,
    });
  } catch (err) {
    console.error("Error fetching organiser courses:", err);
    res.status(500).send("Internal Server Error");
  }
};

const cancelClass = async (req, res) => {
  const classId = req.params.id;
  try {
    await classDAO.cancel(classId);
    res
      .status(200)
      .json({ success: true, message: "Canceled Class Successfully" });
  } catch (err) {
    console.error("Failed to cancel class", err);
    res.status(500).send("Failed to cancel class");
  }
};

const cancelCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    await courseDAO.cancel(courseId);
    res
      .status(200)
      .json({ success: true, message: "Canceled Course Successfully" });
  } catch (err) {
    console.error("Failed to cancel course", err);
    res.status(500).send("Failed to cancel course");
  }
};

const removeCourseAttendee = async (req, res) => {
  console.log("Removing course attendee", req.params);
  const { id, email } = req.params;
  try {
    await courseDAO.removeAttendee(id, email);
    // res.status(200).json({ success: true, message: "Removed Attendee Successfully" });
    // Manual redirect as a workaround to a bug in the frontend 
    res.redirect("/manageCourses");
  } catch (err) {
    console.error("Failed to remove course attendee", err);
    res.status(500).send("Failed to remove attendee");
  }
};

const removeClassAttendee = async (req, res) => {
  const { id, email } = req.params;
  try {
    await classDAO.removeAttendee(id, email);
    console.log("Removed class attendee", { id, email });
    // res.status(200).json({ success: true, message: "Removed Attendee Successfully" });
    // Manual redirect as a workaround to a bug in the frontend
    res.redirect("/manageCourses");
  } catch (err) {
    console.error("Failed to remove class attendee", err);
    res.status(500).send("Failed to remove attendee");
  }
};

const updateClassField = async (req, res) => {
  const classId = req.params.id;
  let { field, value } = req.body;

  if (field.includes("Date") || field.includes("dateTime")) {
    value = new Date(value).getTime();
  }

  try {
    await classDAO.updateField(classId, field, value);
    console.log({
      op: "updateField",
      id: classId,
      field,
      value,
      msg: "Updated class field",
    });
    res.status(200).json({ success: true, message: "Class field updated" });
  } catch (err) {
    console.error("Failed to update class field", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update class field" });
  }
};

const updateCourseField = async (req, res) => {
  const courseId = req.params.id;
  let { field, value } = req.body;

  if (field.includes("Date") || field.includes("dateTime")) {
    value = new Date(value).getTime();
  }

  try {
    await courseDAO.updateField(courseId, field, value);
    console.log({
      op: "updateField",
      id: courseId,
      field,
      value,
      msg: "Updated course field",
    });
    res.status(200).json({ success: true, message: "Course field updated" });
  } catch (err) {
    console.error("Failed to update course field", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update course field" });
  }
};

// Add organiser to a course
const addCourseOrganiser = async (req, res) => {
  const courseId = req.params.id;
  const { organiserId } = req.body;

  try {
    await courseDAO.addOrganiser(courseId, organiserId);
    res
      .status(200)
      .json({ success: true, message: "Added Organiser Successfully" });
  } catch (err) {
    console.error("Failed to add organiser", err);
    res.status(500).send("Failed to add organiser");
  }
};

// Remove organiser from a course
const removeCourseOrganiser = async (req, res) => {
  const courseId = req.params.id;
  const { organiserId } = req.body;

  try {
    await courseDAO.removeOrganiser(courseId, organiserId);
    res
      .status(200)
      .json({ success: true, message: "Removed Organiser Successfully" });
  } catch (err) {
    console.error("Failed to remove organiser", err);
    res.status(400).send(err.message || "Failed to remove organiser");
  }
};

module.exports = {
  getManageCourses,
  cancelClass,
  cancelCourse,
  removeCourseAttendee,
  removeClassAttendee,
  updateClassField,
  updateCourseField,
  addCourseOrganiser,
  removeCourseOrganiser,
};
