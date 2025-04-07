const classDAO = require("../DAOs/ClassDAO");
const courseDAO = require("../DAOs/CourseDAO");
const moment = require("moment");

// Fetch all classes and map course IDs to names, can take a month as a query parameter
// Default to the current month if not provided
const getClasses = async (req, res) => {
  try {
    const monthParam = req.query.month || moment().format("YYYY-MM");  // "YYYY-MM" format
    const startOfMonth = moment(monthParam, "YYYY-MM").startOf("month");
    const endOfMonth = moment(monthParam, "YYYY-MM").endOf("month");
    const classes = await classDAO.findByStartDateRange(startOfMonth.toDate(), endOfMonth.toDate());

    const courses = await courseDAO.findAll();

    const courseMap = courses.reduce((map, course) => {
      map[course._id] = course.name;
      return map;
    }, {});

    const formattedClasses = classes.map((cls, index) => ({
      ...cls,
      courseName: courseMap[cls.courseId] || "Not Part of a Course",
      formattedStartDateTime: moment(cls.startDateTime).format("MMMM Do, YYYY, h:mm A"),
      formattedEndDateTime: moment(cls.endDateTime).format("MMMM Do, YYYY, h:mm A"),
      tabIndex: index + 1,
    }));

    const uniqueCourses = [...new Set(formattedClasses.map(cls => cls.courseName))];

    // Render the page with the filtered classes for the selected month
    res.render("classes", {
      title: "Dance Classes",
      uniqueCourses,
      classes: formattedClasses,
      currentMonth: monthParam,
      isSignedIn: false,
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

  const newMonth = moment(currentMonth, "YYYY-MM").add(direction === "next" ? 1 : -1, "months").format("YYYY-MM");
  
  // Redirect to the updated month
  res.redirect(`/classes?month=${newMonth}`);
};


// Register for a class
const registerForClass = async (req, res) => {
  const { classId, userName, userEmail } = req.body;

  if (!userName || !userEmail) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const cls = await classDAO.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found." });

    cls.attendees = Array.isArray(cls.attendees) ? cls.attendees : [];

    const currentAttendees = cls.attendees.length;
    const classCapacity = typeof cls.capacity === "number" ? cls.capacity : Infinity;

    if (currentAttendees >= classCapacity) {
      return res.status(400).json({ message: "Sorry, this class is fully booked." });
    }

    const newAttendee = { name: userName, email: userEmail };
    cls.attendees.push(newAttendee);

    await classDAO.db.update(
      { _id: classId },
      { $set: { attendees: cls.attendees } },
      {}
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
