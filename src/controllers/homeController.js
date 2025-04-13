const getHome = async (req, res) => {
  try {
    res.render("home", { title: "Dance Courses" });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getHome };
