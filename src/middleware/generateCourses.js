const moment = require("moment");
const classDAO = require("../DAOs/classDAO.js");
const courseDAO = require("../DAOs/courseDAO.js");
const DanceClass = require("../models/classModel.js");
const Course = require("../models/courseModel.js");
console.log("Course type:", typeof Course); 

// Automatically creates all classes for a recurring course with one class per week on the same day and same time
function generateRecurringCourse(
  name,
  description,
  location,
  price,
  pricePerClass,
  classLength,
  durationWeeks,
  startDate,
  time
) {
  const classes = [];

  const course = new Course(
    name,
    description,
    "recurring",
    location,
    price,
    `${durationWeeks} weeks`,
    startDate
  );

  const [hour, minute] = time.split(":").map(Number);

  for (let i = 0; i < durationWeeks; i++) {
    const classStartDateTime = moment(startDate)
      .add(i, "weeks")
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0)
      .toDate();

    const classEndDateTime = moment(classStartDateTime)
      .add(classLength, "minutes")
      .toDate();

    const danceClass = new DanceClass(
      name,
      classStartDateTime,
      classEndDateTime,
      description,
      location,
      pricePerClass,
      course.id
    );

    classes.push(danceClass);
  }

  course.classIds = classes.map((c) => c.id);

  courseDAO.insert(course);
  classDAO.insert(classes);

  return course;
}

// Automatically creates all classes for a weekend workshop course
function generateWorkshopCourse(
  name,
  description,
  location,
  price,
  pricePerClass,
  classLength,
  startDate
) {
  const classes = [];
  const course = new Course(
    name,
    description,
    "workshop",
    location,
    price,
    "Weekend Workshop",
    startDate
  );

  const saturdayClasses = [
    { time: "10:00", dateOffset: 0 },
    { time: "12:00", dateOffset: 2 },
    { time: "15:00", dateOffset: 4 },
  ];

  const sundayClasses = [
    { time: "11:00", dateOffset: 5 },
    { time: "15:00", dateOffset: 7 },
  ];

  saturdayClasses.forEach((session, index) => {
    const classStartDate = moment(startDate)
      .add(session.dateOffset, "days")
      .set("hour", parseInt(session.time.split(":")[0]))
      .set("minute", parseInt(session.time.split(":")[1]))
      .toDate();
    const danceClass = new DanceClass(
      `Workshop Class ${index + 1}`,
      classStartDate,
      moment(classStartDate).add(classLength, "minutes").toDate(),
      description,
      location,
      pricePerClass,
      course.id
    );

    classes.push(danceClass);
  });

  sundayClasses.forEach((session, index) => {
    const classStartDate = moment(startDate)
      .add(session.dateOffset, "days")
      .set("hour", parseInt(session.time.split(":")[0]))
      .set("minute", parseInt(session.time.split(":")[1]))
      .toDate();
    const danceClass = new DanceClass(
      `Workshop Class ${index + 4}`,
      classStartDate,
      moment(classStartDate).add(classLength, "minutes").toDate(),
      description,
      location,
      pricePerClass,
      course.id
    );

    classes.push(danceClass);
  });

  // Add class IDs to the course
  course.classIds = classes.map((c) => c.id);

  // Insert course and classes into the DB
  courseDAO.insert(course);
  classDAO.insert(classes);

  return course;
}

module.exports = {
  generateRecurringCourse,
  generateWorkshopCourse,
};
