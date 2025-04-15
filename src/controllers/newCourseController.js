const moment = require("moment");
const validator = require("validator");
const { generateRecurringCourse, generateWorkshopCourse } = require("@middleware/generateCourses");

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

  // Validate input using validator.js
  if (!validator.isLength(name, { min: 1 })) {
    return res.status(400).json({ success: false, message: "Course name is required." });
  }

  if (!validator.isNumeric(price.toString(), { no_symbols: true }) || price <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price." });
  }

  if (!validator.isNumeric(pricePerClass.toString(), { no_symbols: true }) || pricePerClass <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price per class." });
  }

  if (!validator.isInt(classLength.toString(), { min: 1 })) {
    return res.status(400).json({ success: false, message: "Class length must be a positive integer." });
  }

  if (!validator.isInt(courseCapacity.toString(), { min: 1 })) {
    return res.status(400).json({ success: false, message: "Course capacity must be a positive integer." });
  }

  if (!validator.isInt(classCapacity.toString(), { min: 1 })) {
    return res.status(400).json({ success: false, message: "Class capacity must be a positive integer." });
  }

  const startMoment = moment(startDate, "YYYY-MM-DD");

  if (!startMoment.isValid() || startMoment.isoWeekday() !== 6) {
    return res.status(400).json({ success: false, message: "Workshops must start on a Saturday." });
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

  // Validate input using validator.js
  if (!validator.isLength(name, { min: 1 })) {
    return res.status(400).json({ success: false, message: "Course name is required." });
  }

  if (!validator.isNumeric(price.toString(), { no_symbols: true }) || price <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price." });
  }

  if (!validator.isNumeric(pricePerClass.toString(), { no_symbols: true }) || pricePerClass <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price per class." });
  }

  if (!validator.isInt(classLength.toString(), { min: 1 })) {
    return res.status(400).json({ success: false, message: "Class length must be a positive integer." });
  }

  if (!validator.isInt(courseCapacity.toString(), { min: 0 })) {
    return res.status(400).json({ success: false, message: "Course capacity must be a positive integer." });
  }

  if (!validator.isInt(classCapacity.toString(), { min: 0 })) {
    return res.status(400).json({ success: false, message: "Class capacity must be a positive integer." });
  }

  const startMoment = moment(startDate, "YYYY-MM-DD");

  if (!startMoment.isValid()) {
    return res.status(400).json({ success: false, message: "Invalid start date." });
  }

  if (!validator.isISO8601(time, { strict: true })) {
    return res.status(400).json({ success: false, message: "Invalid time format. Use HH:mm." });
  }

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
