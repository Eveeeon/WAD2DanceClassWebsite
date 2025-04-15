const jwt = require("jsonwebtoken");
const classDAO = require("@daos/ClassDAO");
const courseDAO = require("@daos/CourseDAO");

const cancelCourse = async (req, res) => {
  const { token } = req.params;

  try {
    const { id, userEmail } = jwt.verify(token, process.env.JWT_SECRET);

    const result = await courseDAO.removeAttendee(id, userEmail);
    if (result === "Success") {
      return res.render("cancelConfirmation", {
        message: "You have successfully cancelled your course registration.",
      });
    } else {
      res.render("cancelConfirmation", {
        message: "Could not find your registration to cancel.",
      });
    }
  } catch (err) {
    console.error("Invalid or expired token:", err);
    res.status(400).render("cancelConfirmation", {
      message: "Invalid or expired cancellation link.",
    });
  }
};

const cancelClass = async (req, res) => {
  const { token } = req.params;

  try {
    const { id, userEmail } = jwt.verify(token, process.env.JWT_SECRET);

    const result = await classDAO.removeAttendee(id, userEmail);
    if (result === "Success") {
      return res.render("cancelConfirmation", {
        message: "You have successfully cancelled your class registration.",
      });
    } else {
      return res.render("cancelConfirmation", {
        message: "Could not find your registration to cancel.",
      });
    }
  } catch (err) {
    console.error("Invalid or expired token:", err);
    res.status(400).render("cancelConfirmation", {
      message: "Invalid or expired cancellation link.",
    });
  }
};

module.exports = { cancelClass, cancelCourse };
