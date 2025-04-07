const moment = require("moment");
const classDAO = require("../DAOs/ClassDAO.js");
const courseDAO = require("../DAOs/CourseDAO.js");
const DanceClass = require("../models/ClassModel.js");
const Course = require("../models/CourseModel.js");

async function generateRecurringCourse(
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
  const [hour, minute] = time.split(":").map(Number);

  const course = new Course(
    name,
    description,
    "recurring",
    location,
    price,
    `${durationWeeks} weeks`,
    startDate
  );

  const insertedCourse = await courseDAO.insert(course);

  const classes = [];

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
      insertedCourse._id // use NeDB's _id
    );

    classes.push(danceClass);
  }

  const insertedClasses = await classDAO.insert(classes);
  const classIds = insertedClasses.map((c) => c._id);

  await courseDAO.updateClassIds(insertedCourse._id, classIds);

  return insertedCourse;
}

async function generateWorkshopCourse(
  name,
  description,
  location,
  price,
  pricePerClass,
  classLength,
  startDate,
) {
  const course = new Course(
    name,
    description,
    "workshop",
    location,
    price,
    "Weekend Workshop",
    startDate
  );

  const insertedCourse = await courseDAO.insert(course);
  const classes = [];

  const sessions = [
    { time: "10:00", offset: 0 },
    { time: "12:00", offset: 2 },
    { time: "15:00", offset: 4 },
    { time: "11:00", offset: 5 },
    { time: "15:00", offset: 7 },
  ];

  sessions.forEach((session, index) => {
    const classStart = moment(startDate)
      .add(session.offset, "days")
      .set("hour", parseInt(session.time.split(":")[0]))
      .set("minute", parseInt(session.time.split(":")[1]))
      .toDate();

    const classEnd = moment(classStart).add(classLength, "minutes").toDate();

    const danceClass = new DanceClass(
      `${course.name} Workshop Class ${index + 1}`,
      classStart,
      classEnd,
      description,
      location,
      pricePerClass,
      insertedCourse._id
    );

    classes.push(danceClass);
  });

  const insertedClasses = await classDAO.insert(classes);
  const classIds = insertedClasses.map((c) => c._id);

  await courseDAO.updateClassIds(insertedCourse._id, classIds);

  return insertedCourse;
}

module.exports = {
  generateRecurringCourse,
  generateWorkshopCourse,
};
