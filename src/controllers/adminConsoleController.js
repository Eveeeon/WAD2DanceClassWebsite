const getAdminConsole = (req, res) => {
  // testing if authentication works
  res.render("adminConsole", {
    title: "Admin Console",
    user: req.user,
  });
};

module.exports = {
  getAdminConsole,
};
