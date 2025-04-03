class Course {
    constructor(id, name, description, type, location, price, duration, startDate, classIds = []) {
        this.id = id; // Unique Course ID
        this.name = name;
        this.description = description;
        this.type = type; // Recurring or Workshop
        this.location = location;
        this.price = price;
        this.duration = duration;
        this.startDate = startDate;
        this.classIds = classIds; // List of class IDs in this course
    }
}
