const courseDAO = require("../DAOs/courseDAO");
const moment = require("moment");

const getHome = async (req, res) => {
  try {
    const courses = await courseDAO.findAll();

    // Format date and prepare accessibility attributes
    const formattedCourses = courses.map((course, index) => ({
      ...course,
      formattedStartDate: moment(course.startDate).format("dddd, MMMM Do YYYY"),
      tabIndex: index + 1 // for keyboard navigation
    }));

    res.render("home", { courses: formattedCourses });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getHome };