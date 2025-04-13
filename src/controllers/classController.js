const classDAO = require("../DAOs/ClassDAO");
const courseDAO = require("../DAOs/CourseDAO");
const moment = require("moment");
const validator = require("validator");
const { sendClassRegistrationEmail } = require("../middleware/emailHandler");

// Fetch all classes and map course IDs to names, can take a month as a query parameter
// Default to the current month if not provided
const getClasses = async (req, res) => {
  try {
    const monthParam = req.query.month || moment().format("YYYY-MM"); // "YYYY-MM" format
    const startOfMonth = moment(monthParam, "YYYY-MM").startOf("month");
    const endOfMonth = moment(monthParam, "YYYY-MM").endOf("month");

    // Fetch classes within the specified date range
    const classes = await classDAO.findByStartDateRange(
      startOfMonth.toDate(),
      endOfMonth.toDate()
    );
    const courses = await courseDAO.findAll();

    // Map course IDs to course names
    const courseMap = courses.reduce((map, course) => {
      map[course._id] = course.name;
      return map;
    }, {});

    // Format classes with course names and date-times
    const formattedClasses = classes.map((cls, index) => ({
      ...cls,
      courseName: courseMap[cls.courseId] || "Not Part of a Course",
      formattedStartDateTime: moment(cls.startDateTime).format(
        "MMMM Do, YYYY, h:mm A"
      ),
      formattedEndDateTime: moment(cls.endDateTime).format(
        "MMMM Do, YYYY, h:mm A"
      ),
      tabIndex: index + 1,
    }));

    // Get unique course names
    const uniqueCourses = [
      ...new Set(formattedClasses.map((cls) => cls.courseName)),
    ];

    // Render the page with the filtered classes for the selected month
    res.render("classes", {
      title: "Dance Classes",
      uniqueCourses,
      classes: formattedClasses,
      currentMonth: monthParam,
    });
  } catch (err) {
    console.error("Error loading classes:", err);
    res.status(500).send("Something went wrong.");
  }
};

// Month navigation (previous and next)
const changeMonth = (req, res) => {
  const currentMonth = req.query.month || moment().format("YYYY-MM");
  const direction = req.params.direction;

  // Calculate the new month based on the direction
  const newMonth = moment(currentMonth, "YYYY-MM")
    .add(direction === "next" ? 1 : -1, "months")
    .format("YYYY-MM");

  // Redirect to the updated month
  res.redirect(`/classes?month=${newMonth}`);
};

// Register for a class
const registerForClass = async (req, res) => {
  const { classId, name, email } = req.body;

  // Validate input
  if (
    !name ||
    !validator.isLength(name.trim(), { min: 2, max: 100 }) ||
    !email ||
    !validator.isEmail(email)
  ) {
    return res
      .status(400)
      .json({ message: "Please provide valid name and email." });
  }

  try {
    // Fetch the class by ID
    const clss = await classDAO.findById(classId);
    if (!clss) return res.status(404).json({ message: "Class not found." });

    // Check if fully booked
    if (clss.attendees.length >= clss.capacity) {
      return res
        .status(400)
        .json({ message: "Sorry, this class is fully booked." });
    }

    // Add attendee
    const newAttendee = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    };
    await classDAO.addAttendee(classId, newAttendee);

    // Send confirmation email with cancellation link
    await sendClassRegistrationEmail(
      newAttendee,
      clss,
      `${process.env.BASE_URL}/cancelClass`
    );

    res.status(200).json({ message: "Successfully registered!" });
  } catch (err) {
    console.error("Error during class registration:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  getClasses,
  changeMonth,
  registerForClass,
};
