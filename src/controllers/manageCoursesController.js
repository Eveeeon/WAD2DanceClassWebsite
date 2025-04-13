const getManageCourses = (req, res) => {
// testing if authentication works
    res.render('manageCourses', {
      title: 'Manage Courses',
      user: req.user,
    });

}

module.exports = {
    getManageCourses,
};