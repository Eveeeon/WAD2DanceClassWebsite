const moment = require("moment");
const courseDAO = require("../DAOs/CourseDAO");

// Controller to render calendar page
const getCalendar = async (req, res) => {
  try {
    // Fetch courses or classes (this may be a database call, for example)
    const courses = await courseDAO.findAll();

    // Format the start dates or any other data if necessary
    const formattedCourses = courses.map(course => ({
      ...course,
      formattedStartDate: moment(course.startDate).format("MMMM Do YYYY"),
    }));

    // Render the calendar page
    res.render("calendar", {
      title: "Calendar of Classes",
      courses: formattedCourses
    });
  } catch (error) {
    console.error("Error fetching courses for calendar:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle the modal opening for class details
const getClassDetails = (req, res) => {
  const { courseId } = req.params;  // Assume courseId is passed in the URL

  // Fetch course details based on the courseId
  courseDAO.findById(courseId)
    .then(course => {
      if (!course) {
        return res.status(404).send("Course not found");
      }

      // Return the class details to populate the modal
      res.json(course);
    })
    .catch(error => {
      console.error("Error fetching class details:", error);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = { getCalendar, getClassDetails };
