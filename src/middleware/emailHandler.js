const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const classDAO = require("../DAOs/ClassDAO");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Standard format for date
const formatDate = (date) => moment(date).format("dddd, MMMM Do YYYY, h:mm A");

// Generate token
const generateCancelToken = (id, userEmail, endDateTime) => {
  const expSeconds = Math.floor(moment(endDateTime).valueOf() / 1000);
  return jwt.sign({ id, userEmail, exp: expSeconds }, process.env.JWT_SECRET);
};

// Create email body
const generateEmailBody = (
  type,
  user,
  item,
  cancelUrlBase,
  classDetails = []
) => {
  const token = generateCancelToken(
    item._id,
    user.email,
    item.endDateTime || item.endDate
  );
  const cancelUrl = `${cancelUrlBase}/${token}`;

  // Content
  let html = `
    <p>Hi ${user.name},</p>
    <p>You're successfully registered for the following ${type}:</p>
    <ul>
      <li><strong>${item.name}</strong></li>
      <li><strong>Start:</strong> ${formatDate(
        item.startDateTime || item.startDate
      )}</li>
      <li><strong>End:</strong> ${formatDate(
        item.endDateTime || item.endDate
      )}</li>
      ${
        item.location
          ? `<li><strong>Location:</strong> ${item.location}</li>`
          : ""
      }
      ${item.price ? `<li><strong>Price:</strong> £${item.price}</li>` : ""}
    </ul>
  `;

  // Show all classes of course in email
  if (type === "course") {
    html += "<p>Below are the classes for this course:</p><ul>";
    classDetails.forEach((clss) => {
      html += `
        <li><strong>${clss.name}</strong></li>
        <li>Start: ${formatDate(clss.startDateTime)}</li>
        <li>Location: ${clss.location}</li>
      `;
    });
    html += "</ul>";
  }

  html += `
    <p>Click <a href="${cancelUrl}">here to cancel</a>.</p>
  `;

  return html;
};

// Send course email
const sendCourseRegistrationEmail = async ( user, course, cancelUrlBase ) => {
  // Get all classes for course
  const classDetails = await classDAO.findByCourseId(course._id);
  console.log("this is" + course);
  const html = generateEmailBody(
    "course",
    user,
    course,
    cancelUrlBase,
    classDetails
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Dance Course Registration Confirmation",
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Send class email
const sendClassRegistrationEmail = async ( user, clss, cancelUrlBase ) => {
    console.log("this is" + clss);
  const html = generateEmailBody("class", user, clss, cancelUrlBase);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Dance Class Registration Confirmation",
    html,
  };

  await transporter.sendMail(mailOptions);
};

//
const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <p>Hi ${user.name},</p>
    <p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 15 minutes.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html,
  });
};


module.exports = { sendCourseRegistrationEmail, sendClassRegistrationEmail, sendPasswordResetEmail };
