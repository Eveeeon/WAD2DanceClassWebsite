class DanceClass {
    constructor(id, name, dateTime, description, location, price, courseId) {
      this.id = id; // Unique Class ID
      this.name = name;
      this.dateTime = dateTime;
      this.description = description;
      this.location = location;
      this.price = price;
      this.courseId = courseId; // The course this class belongs to
    }
  }
  