class DanceClass {
  constructor(
    name,
    startDateTime,
    endDateTime,
    description,
    location,
    price,
    courseId,
    capacity
  ) {
    this.name = name;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.description = description;
    this.location = location;
    this.price = price;
    this.courseId = courseId; // The course this class belongs to
    this.active = true; // Enables the organiser to cancel
    this.capacity = capacity;
    this.attendees = []; // List of attendees for this single class (excludng the course attendees)
  }
}

module.exports = DanceClass;
