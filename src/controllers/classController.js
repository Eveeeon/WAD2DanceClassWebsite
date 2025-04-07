const classDAO = require("../DAOs/ClassDAO");
const courseDAO = require("../DAOs/CourseDAO");
const moment = require("moment");

// Fetch all classes and map ids to course names
const getClasses = async (req, res) => {
  try {
    const classes = await classDAO.findAll();
    const courses = await courseDAO.findAll();
    
    // Map courseId to course name
    const courseMap = courses.reduce((map, course) => {
      map[course._id] = course.name;
      return map;
    }, {});

    // Formating dates
    const formattedClasses = classes.map((cls, index) => {

      return {
        ...cls,
        courseName: courseMap[cls.courseId] || 'Not Part of a Course', 
        formattedStartDateTime: moment(cls.startDateTime).format("MMMM Do, YYYY, h:mm A"),
        formattedEndDateTime: moment(cls.endDateTime).format("MMMM Do, YYYY, h:mm A"),
        tabIndex: index + 1,
      };
    });

    // Get filter values
    const uniqueCourses = [...new Set(formattedClasses.map(cls => cls.courseName))];
    console.log("Unique Courses:", uniqueCourses); // Log the unique courses array

    res.render("classes", {
      title: "Dance Classes",
      uniqueCourses: uniqueCourses,
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

    const newAttendee = { name: userName, email: userEmail };
    cls.attendees = cls.attendees || [];
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
