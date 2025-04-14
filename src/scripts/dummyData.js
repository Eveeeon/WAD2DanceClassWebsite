const { generateRecurringCourse } = require("../middleware/generateCourses.js");
const locationDAO = require("../DAOs/locationDAO");
const userDAO = require("../DAOs/userDAO");
const courseDAO = require("../DAOs/CourseDAO");
const classDAO = require("../DAOs/ClassDAO");

// Define location data
const locationStrings = [
  "Town Hall, Jiggington, 00000",
  "The Shake and Wave, Jigglesville, 00000",
  "The Move Zone, Jigglington, 00000",
];

// Define course data
const recurringCourses = [
  {
    name: "Beginner Salsa",
    description: "Learn the basics of Salsa.",
    location: 0,
    courseCost: 100,
    classCost: 20,
    classLength: 60,
    durationWeeks: 12,
    startDateYear: "2025",
    startDateMonth: "04",
    startDateDay: "28",
    time: "18:30",
    courseCapacity: 25,
    classCapacity: 35,
  },
  {
    name: "Intermediate Tango",
    description: "Improve your Tango skills.",
    location: 1,
    courseCost: 120,
    classCost: 28,
    classLength: 90,
    durationWeeks: 10,
    startDateYear: "2025",
    startDateMonth: "04",
    startDateDay: "29",
    time: "19:00",
    courseCapacity: 15,
    classCapacity: 20,
  },
  {
    name: "Advanced Hip-Hop",
    description: "For experienced Hip-Hop dancers.",
    location: 2,
    courseCost: 200,
    classCost: 30,
    classLength: 40,
    durationWeeks: 8,
    startDateYear: "2025",
    startDateMonth: "04",
    startDateDay: "30",
    time: "17:45",
    courseCapacity: 10,
    classCapacity: 15,
  },
  {
    name: "Latin Fusion",
    description: "A mix of various Latin dances.",
    location: 0,
    courseCost: 85,
    classCost: 15,
    classLength: 70,
    durationWeeks: 12,
    startDateYear: "2025",
    startDateMonth: "05",
    startDateDay: "01",
    time: "18:00",
    courseCapacity: 15,
    classCapacity: 20,
  },
  {
    name: "Swing Dance",
    description: "Get into the rhythm of Swing dancing.",
    location: 1,
    courseCost: 110,
    classCost: 20,
    classLength: 50,
    durationWeeks: 10,
    startDateYear: "2025",
    startDateMonth: "05",
    startDateDay: "02",
    time: "19:15",
    courseCapacity: 10,
    classCapacity: 20,
  },
];

const seed = async () => {
  try {
    // Insert all locations
    const insertedLocations = await Promise.all(
      locationStrings.map((address) => locationDAO.insert({ address }))
    );

    // Create users
    const adminUser = await userDAO.createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: "adminpassword123!",
    });

    const organiser1 = await userDAO.createUser({
      name: "Organiser 1",
      email: "organiser1@example.com",
      password: "password123!",
    });
    const organiser2 = await userDAO.createUser({
      name: "Organiser 2",
      email: "organiser2@example.com",
      password: "password123!",
    });
    const organiser3 = await userDAO.createUser({
      name: "Organiser 3",
      email: "organiser3@example.com",
      password: "password123!",
    });
    const organiser4 = await userDAO.createUser({
      name: "Organiser 4",
      email: "organiser4@example.com",
      password: "password123!",
    });
    const organiser5 = await userDAO.createUser({
      name: "Organiser 5",
      email: "organiser5@example.com",
      password: "password123!",
    });

    // Set roles for users
    await userDAO.updateRole(adminUser._id, "admin");
    await userDAO.updateRole(organiser1._id, "organiser");
    await userDAO.updateRole(organiser2._id, "organiser");
    await userDAO.updateRole(organiser3._id, "organiser");
    await userDAO.updateRole(organiser4._id, "organiser");
    await userDAO.updateRole(organiser5._id, "organiser");

    // Add organisers to the courses
    const organiserIds = [
      organiser1._id,
      organiser2._id,
      organiser3._id,
      organiser4._id,
      organiser5._id,
    ];

    // Generate the recurring courses and add attendees
    for (let i = 0; i < recurringCourses.length; i++) {
      const course = recurringCourses[i];
      const loc = insertedLocations[course.location];
      const organiser = organiserIds[i]; // Use a different organiser for each course

      // Generate the course
      const generatedCourse = await generateRecurringCourse(
        course.name,
        course.description,
        loc.address,
        course.courseCost,
        course.classCost,
        course.classLength,
        course.durationWeeks,
        course.startDateYear,
        course.startDateMonth,
        course.startDateDay,
        course.time,
        course.courseCapacity,
        course.classCapacity,
        [organiser]
      );

      // Define attendees for the course
      const courseAttendees = [
        { name: "Course Attendee 1", email: "course1@example.com" },
        { name: "Course Attendee 2", email: "course2@example.com" },
      ];

      // Add attendees to the course (not using loops)
      for (const attendee of courseAttendees) {
        await courseDAO.addAttendee(generatedCourse._id, attendee);
      }
    }

    const classes = await classDAO.findAll();
    if (classes && classes.length > 0) {
      // Define attendees for classes
      const classAttendees = [
        { name: "Class Attendee 1", email: "class1a@example.com" },
        { name: "Class Attendee 2", email: "class1b@example.com" },
        { name: "Class Attendee 3", email: "class2a@example.com" },
        { name: "Class Attendee 4", email: "class2b@example.com" },
      ];

      // Add attendees to all classes
      for (const singleClass of classes) {
        for (const attendee of classAttendees) {
          await classDAO.addAttendee(singleClass._id, attendee);
        }
      }
    }
    console.log("Dummy data successfully added");
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  }
};

seed();
