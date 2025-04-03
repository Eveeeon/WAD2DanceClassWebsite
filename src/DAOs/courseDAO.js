class CourseDAO {
    constructor(db) {
      this.db = db;
    }
  
    async getNextCourseId() {
      const courses = await this.getAllCourses();
      const lastId = courses.length ? courses[courses.length - 1].id : "CO000";
      const nextNumber = parseInt(lastId.replace("CO", "")) + 1;
      return `CO${String(nextNumber).padStart(3, "0")}`;
    }
  
    async insertCourse(course) {
      await this.db.insert(course);
    }
  
    async getAllCourses() {
      return new Promise((resolve, reject) => {
        this.db.find({}, (err, courses) => {
          if (err) reject(err);
          else resolve(courses);
        });
      });
    }
  }
  