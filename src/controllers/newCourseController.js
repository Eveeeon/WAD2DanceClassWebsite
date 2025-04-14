const moment = require("moment");
const { generateRecurringCourse, generateWorkshopCourse } = require("../middleware/generateCourses");

const getNewWorkshopForm = (req, res) => {
  res.render("newWorkshopCourse", { user: req.user });
};

const getNewRecurringForm = (req, res) => {
  res.render("newRecurringCourse", { user: req.user });
};

const createWorkshopCourse = async (req, res) => {
  const organiserId = req.user.userId;

  const {
    name, description, location, price, pricePerClass,
    classLength, startDate, courseCapacity, classCapacity
  } = req.body;

  const startMoment = moment(startDate, "YYYY-MM-DD");
  if (startMoment.isoWeekday() !== 6) {
    return res.status(400).send("Workshops must start on a Saturday.");
  }

  try {
    const course = await generateWorkshopCourse(
      name, description, location, price, pricePerClass,
      classLength,
      startMoment.year(),
      startMoment.month() + 1,
      startMoment.date(),
      courseCapacity,
      classCapacity,
      [organiserId]
    );

    return res.json({ success: true, courseId: course._id });
  } catch (error) {
    console.error("Error creating workshop course:", error);
    return res.status(500).json({ success: false, message: "Failed to create workshop course." });
  }
};


const createRecurringCourse = async (req, res) => {
  const organiserId = req.user.userId;

  const {
    name, description, location, price, pricePerClass,
    classLength, durationWeeks, startDate, time,
    courseCapacity, classCapacity
  } = req.body;

  const startMoment = moment(startDate, "YYYY-MM-DD");

  try {
    const course = await generateRecurringCourse(
      name, description, location, price, pricePerClass,
      classLength, durationWeeks,
      startMoment.year(),
      startMoment.month() + 1,
      startMoment.date(),
      time,
      courseCapacity,
      classCapacity,
      [organiserId]
    );

    return res.json({ success: true, courseId: course._id });
  } catch (error) {
    console.error("Error creating recurring course:", error);
    return res.status(500).json({ success: false, message: "Failed to create recurring course." });
  }
};


module.exports = {
  getNewWorkshopForm,
  getNewRecurringForm,
  createWorkshopCourse,
  createRecurringCourse,
};
