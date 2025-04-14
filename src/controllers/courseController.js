const courseDAO = require("../DAOs/CourseDAO.js");
const moment = require("moment");
const validator = require("validator");
const { sendCourseRegistrationEmail } = require("../middleware/emailHandler");
require("dotenv").config();

// Fetch all courses
const getCourses = async (req, res) => {
  try {
    const courses = await courseDAO.findActive();

    const formattedCourses = courses.map((course, index) => {
      const currentAttendees = Array.isArray(course.attendees)
        ? course.attendees.length
        : 0;
      const courseCapacity = course.capacity;
      const isFull = currentAttendees >= courseCapacity;

      return {
        ...course,
        formattedStartDate: moment(course.startDate).format(
          "dddd, MMMM Do YYYY"
        ),
        formattedEndDate: moment(course.endDate).format("dddd, MMMM Do YYYY"),
        tabIndex: index + 1,
        fullyBooked: isFull,
      };
    });

    res.render("courses", {
      title: "Dance Courses",
      courses: formattedCourses,
    });
  } catch (error) {
    console.error("Error loading course page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Register for a course
const registerForCourse = async (req, res) => {
  const { courseId, name, email } = req.body;

  // Validation
  if (
    !name ||
    !email ||
    !validator.isLength(name, { min: 1, max: 100 }) ||
    !validator.isAlpha(name.replace(/\s/g, "")) ||
    !validator.isEmail(email)
  ) {
    return res.status(400).json({ message: "Invalid email or name format." });
  }

  try {
    const course = await courseDAO.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const currentAttendees = course.attendees.length;
    const courseCapacity = course.capacity;

    if (currentAttendees >= courseCapacity) {
      return res.status(400).json({ message: "Course is fully booked." });
    }

    // Add new attendee
    const newAttendee = { name: name.trim(), email: email.trim() };
    await courseDAO.addAttendee(courseId, newAttendee);
    // Send confirmation email
    await sendCourseRegistrationEmail(
      newAttendee,
      course,
      `${process.env.BASE_URL}/cancelCourse`
    );

    return res.status(200).json({ message: "Successfully registered!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  getCourses,
  registerForCourse,
};
