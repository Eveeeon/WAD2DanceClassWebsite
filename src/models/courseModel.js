class Course {
  constructor(name, description, type, location, price, duration, endDate, startDate, capacity, organsierIds) {
    this.name = name;
    this.description = description;
    this.type = type; // Recurring or Workshop or Custom
    this.location = location;
    this.price = price;
    this.duration = duration;
    this.startDate = startDate;
    this.endDate = endDate;
    this.capacity = capacity;
    this.active = true; // Enables the organiser to cancel
    this.attendees = []; // List of attendees for this course
    this.organisers = organsierIds; // Organiser IDs
  }
}

module.exports = Course;
