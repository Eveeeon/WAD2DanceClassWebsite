const courseDAO = require("../DAOs/CourseDAO.js");
const moment = require("moment");

const getCourses = async (req, res) => {
  try {
    const courses = await courseDAO.findAll();

    // Format date and add tab indexes
    const formattedCourses = courses.map((course, index) => ({
      ...course,
      formattedStartDate: moment(course.startDate).format("dddd, MMMM Do YYYY"),
      tabIndex: index + 1
    }));

    res.render("courses", {title: "Dance Courses", courses: formattedCourses, isSignedin: false });
    
  } catch (error) {
    console.error("Error loading course page:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getCourses };
