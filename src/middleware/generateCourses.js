const moment = require("moment");
const classDAO = require("@daos/ClassDAO");
const courseDAO = require("@daos/CourseDAO");
const DanceClass = require("@models/ClassModel");
const Course = require("@models/CourseModel");

const generateRecurringCourse = async (
  name,
  description,
  location,
  price,
  pricePerClass,
  classLength,
  durationWeeks,
  startYear,
  startMonth,
  startDay,
  time,
  courseCapacity,
  classCapacity,
  organiserIds
) => {
  const [hour, minute] = time.split(":").map(Number);

  const courseStartDate = moment(
    `${startYear}-${startMonth}-${startDay}`,
    "YYYY-MM-DD"
  ).startOf("day");
  const courseEndDate = moment(courseStartDate).add(durationWeeks - 1, "weeks");

  const course = new Course(
    name,
    description,
    "recurring",
    location,
    price,
    `${durationWeeks} weeks`,
    courseStartDate.toDate(),
    courseEndDate.toDate(),
    courseCapacity,
    organiserIds
  );

  const insertedCourse = await courseDAO.insert(course);
  const classes = [];

  for (let i = 0; i < durationWeeks; i++) {
    const classStartDateTime = moment(courseStartDate)
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
      insertedCourse._id,
      classCapacity
    );

    classes.push(danceClass);
  }

  const insertedClasses = await classDAO.insert(classes);
  const classIds = insertedClasses.map((c) => c._id);

  await courseDAO.updateClassIds(insertedCourse._id, classIds);

  return insertedCourse;
};

const generateWorkshopCourse = async (
  name,
  description,
  location,
  price,
  pricePerClass,
  classLength,
  startYear,
  startMonth,
  startDay,
  courseCapacity,
  classCapacity,
  organiserIds
) => {
  const courseStartDate = moment(
    `${startYear}-${startMonth}-${startDay}`,
    "YYYY-MM-DD"
  );
  const courseEndDate = moment(courseStartDate).add(7, "days");

  const course = new Course(
    name,
    description,
    "workshop",
    location,
    price,
    "Weekend Workshop",
    courseStartDate.toDate(),
    courseEndDate.toDate(),
    courseCapacity,
    organiserIds
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
    const classStart = moment(courseStartDate)
      .add(session.offset, "days")
      .set("hour", parseInt(session.time.split(":")[0]))
      .set("minute", parseInt(session.time.split(":")[1]))
      .toDate();

    const classEnd = moment(classStart).add(classLength, "minutes").toDate();

    const danceClass = new DanceClass(
      `${name} Workshop Class ${index + 1}`,
      classStart,
      classEnd,
      description,
      location,
      pricePerClass,
      insertedCourse._id,
      classCapacity
    );

    classes.push(danceClass);
  });

  const insertedClasses = await classDAO.insert(classes);
  const classIds = insertedClasses.map((c) => c._id);

  await courseDAO.updateClassIds(insertedCourse._id, classIds);

  return insertedCourse;
};

module.exports = {
  generateRecurringCourse,
  generateWorkshopCourse,
};
