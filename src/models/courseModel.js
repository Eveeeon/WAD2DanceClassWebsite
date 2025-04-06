class Course {
  constructor(name, description, type, location, price, duration, startDate) {
    this.name = name;
    this.description = description;
    this.type = type; // Recurring or Workshop or Custom
    this.location = location;
    this.price = price;
    this.duration = duration;
    this.startDate = startDate;
    this.active = true; // Enables the organiser to cancel
    this.attendees = []; // List of attendees for this course
  }
}

module.exports = Course;
