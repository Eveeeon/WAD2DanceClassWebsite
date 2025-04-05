const {
  generateRecurringCourse,
  generateWorkshopCourse,
} = require("../middleware/courseGenerator");

const locations = [
  "Town Hall, Jiggington, 00000",
  "The Shake and Wave, Jigglesville, 00000",
  "The Move Zone, Jigglington, 00000",
];

const recurringCourses = [
  {
    name: "Beginner Salsa",
    description: "Learn the basics of Salsa.",
    location: 1,
    courseCost: 100,
    classCost: 20,
    classLength: 60,
    durationWeeks: 12,
    startDate: "2025-04-28",
    time: "18:30",
  },
  {
    name: "Intermediate Tango",
    description: "Improve your Tango skills.",
    location: 2,
    courseCost: 120,
    classCost: 28,
    classLength: 90,
    durationWeeks: 10,
    startDate: "2025-04-29",
    time: "19:00",
  },
  {
    name: "Advanced Hip-Hop",
    description: "For experienced Hip-Hop dancers.",
    location: 3,
    courseCost: 200,
    classCost: 30,
    classLength: 40,
    durationWeeks: 8,
    startDate: "2025-04-30",
    time: "17:45",
  },
  {
    name: "Latin Fusion",
    description: "A mix of various Latin dances.",
    location: 1,
    courseCost: 85,
    classCost: 15,
    classLength: 70,
    durationWeeks: 12,
    startDate: "2025-05-01",
    time: "18:00",
  },
  {
    name: "Swing Dance",
    description: "Get into the rhythm of Swing dancing.",
    location: 2,
    courseCost: 110,
    classCost: 20,
    classLength: 50,
    durationWeeks: 10,
    startDate: "2025-05-02",
    time: "19:15",
  },
];

recurringCourses.forEach((course) => {
  generateRecurringCourse(
    course.name,
    course.description,
    locations[course.location],
    course.courseCost,
    course.classCost,
    course.classLength,
    course.durationWeeks,
    course.startDate,
    course.time
  );
});

// Workshop Course
const workshopStartDate = "2025-05-10";

generateWorkshopCourse(
  "Freestyle Dance Workshop",
  "A weekend of expressive freestyle dance.",
  locations[1],
  100, // full price
  20, // single class price
  90, // length
  workshopStartDate
);

console.log("Dummy data has been added to the database.");
