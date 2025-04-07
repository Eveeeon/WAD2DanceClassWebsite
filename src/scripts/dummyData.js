const {
  generateRecurringCourse,
  generateWorkshopCourse,
} = require("../middleware/generateCourses.js");

const locationDAO = require("../DAOs/locationDAO");

// Define location data
const locationStrings = [
  "Town Hall, Jiggington, 00000",
  "The Shake and Wave, Jigglesville, 00000",
  "The Move Zone, Jigglington, 00000",
];

// Define course data (using indexes for location reference)
const recurringCourses = [
  {
    name: "Beginner Salsa",
    description: "Learn the basics of Salsa.",
    location: 0,
    courseCost: 100,
    classCost: 20,
    classLength: 60,
    durationWeeks: 12,
    startDate: "2025-04-28",
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
    startDate: "2025-04-29",
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
    startDate: "2025-04-30",
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
    startDate: "2025-05-01",
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
    startDate: "2025-05-02",
    time: "19:15",
    courseCapacity: 10,
    classCapacity: 20,
  },
];

const seed = async () => {
  try {
    // Insert all locations
    const insertedLocations = await Promise.all(
      locationStrings.map(address => locationDAO.insert({ address }))
    );

    // Generate recurring courses with real location objects
    for (const course of recurringCourses) {
      const loc = insertedLocations[course.location];
      await generateRecurringCourse(
        course.name,
        course.description,
        loc.address,
        course.courseCost,
        course.classCost,
        course.classLength,
        course.durationWeeks,
        course.startDate,
        course.time,
        course.courseCapacity,
        course.classCapacity  
      );
    }

    // Add the workshop
    const workshopStartDate = "2025-05-10";
    const fullPrice = 100;
    const classPrice = 20;
    const length = 90;
    const courseCapacity = 0;
    const classCapacity = 50;
    await generateWorkshopCourse(
      "Freestyle Dance",
      "A weekend of expressive freestyle dance.",
      insertedLocations[1].address,
      fullPrice,
      classPrice,
      length,
      workshopStartDate,
      courseCapacity,
      classCapacity  
    );

    console.log("Dummy data has been added to the database.");
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  }
};

seed();
