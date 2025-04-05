const metadataDAO = new metadataDAO();

class Course {
  constructor(
    name,
    description,
    type,
    location,
    price,
    duration,
    startDate,
    classIds = []
  ) {
    this.id = metadataDAO.getNextCourseId();
    this.name = name;
    this.description = description;
    this.type = type; // Recurring or Workshop
    this.location = location;
    this.price = price;
    this.duration = duration;
    this.startDate = startDate;
    this.classIds = classIds; // List of class IDs in this course
    this.active = true; // Enables the organiser to cancel
    this.attendees = []; // List of attendees for this course
  }
}

module.exports = Course;