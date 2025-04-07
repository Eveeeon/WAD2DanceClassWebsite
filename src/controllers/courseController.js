const courseDAO = require("../DAOs/CourseDAO.js");
const moment = require("moment");

// Fetch all courses
const getCourses = async (req, res) => {
  try {
    const courses = await courseDAO.findAll();

    const formattedCourses = courses.map((course, index) => {
      const currentAttendees = Array.isArray(course.attendees) ? course.attendees.length : 0;
      const courseCapacity = typeof course.capacity === "number" ? course.capacity : Infinity;
      const isFull = currentAttendees >= courseCapacity;

      return {
        ...course,
        formattedStartDate: moment(course.startDate).format("dddd, MMMM Do YYYY"),
        tabIndex: index + 1,
        fullyBooked: isFull,
      };
    });

    res.render("courses", {
      title: "Dance Courses",
      courses: formattedCourses,
      isSignedIn: false,
    });
  } catch (error) {
    console.error("Error loading course page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Register for a course
const registerForCourse = async (req, res) => {
  const { courseId, userName, userEmail } = req.body;

  if (!userName || !userEmail) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const course = await courseDAO.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Ensure attendees array exists
    course.attendees = Array.isArray(course.attendees) ? course.attendees : [];

    // Check if course is fully booked
    const currentAttendees = course.attendees.length;
    const courseCapacity = course.capacity;

    if (currentAttendees >= courseCapacity) {
      return res.status(400).json({ message: "Sorry, this course is fully booked." });
    }

    const newAttendee = { name: userName, email: userEmail };
    course.attendees.push(newAttendee);

    await courseDAO.db.update(
      { _id: courseId },
      { $set: { attendees: course.attendees } },
      {}
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
