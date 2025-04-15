const UserDAO = require("@daos/userDAO");

const getAdminConsole = async (req, res) => {
  try {
    const unapproved = await UserDAO.getAllUnapprovedOrganisers();
    res.render("adminConsole", { unapproved });
  } catch (err) {
    res.status(500).send("Error loading unapproved organisers.");
  }
};

approveOrganiser = async (req, res) => {
  const userId = req.params.id;
  try {
    await UserDAO.updateRole(userId, "organiser");
    res.redirect("/adminConsole");
  } catch (err) {
    res.status(500).send("Error approving organiser.");
  }
};


module.exports = {
  getAdminConsole,
  approveOrganiser
};
