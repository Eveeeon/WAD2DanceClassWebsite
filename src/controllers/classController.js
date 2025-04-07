const classDAO = require("../DAOs/ClassDAO");
const courseDAO = require("../DAOs/CourseDAO");
const moment = require("moment");

// Fetch all classes and map course IDs to names
const getClasses = async (req, res) => {
  try {
    const classes = await classDAO.findAll();
    const courses = await courseDAO.findAll();

    const courseMap = courses.reduce((map, course) => {
      map[course._id] = course.name;
      return map;
    }, {});

    const formattedClasses = classes.map((cls, index) => {
      const currentAttendees = Array.isArray(cls.attendees) ? cls.attendees.length : 0;
      const classCapacity = cls.capacity;
      const isFull = currentAttendees >= classCapacity;

      return {
        ...cls,
        courseName: courseMap[cls.courseId] || "Not Part of a Course",
        formattedStartDateTime: moment(cls.startDateTime).format("MMMM Do, YYYY, h:mm A"),
        formattedEndDateTime: moment(cls.endDateTime).format("MMMM Do, YYYY, h:mm A"),
        tabIndex: index + 1,
        fullyBooked: isFull,
      };
    });

    const uniqueCourses = [...new Set(formattedClasses.map(cls => cls.courseName))];

    res.render("classes", {
      title: "Dance Classes",
      uniqueCourses,
      classes: formattedClasses,
      isSignedIn: false,
    });
  } catch (err) {
    console.error("Error loading classes:", err);
    res.status(500).send("Something went wrong.");
  }
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
  registerForClass,
};
