const locationDAO = require('../DAOs/locationDAO');

const getAbout = async (req, res) => {
  try {
    const aboutInfo = {
      title: "About Us",
      description: `Signing up is simple! Go to the <a href="/calendar">Calendar</a>, switch between course or class view,
                    click on the one you want, register your name, and enter your email for verification. Easy as that!`,
    };

    const locations = await locationDAO.findAll();
    const faqs = [
      {
        question: "How do I sign up for a class/course?",
        answer:
          "Go to the Calendar page, select a class or course, enter your name and email, and follow the verification instructions.",
      },
      {
        question: "How do I cancel a sign-up?",
        answer:
          "After verifying your email, you'll receive a one-time link that lets you cancel your booking if needed.",
      },
      {
        question: "How do I run a class or course?",
        answer:
          "You need to register as an organiser. Once submitted, you'll be reviewed and approved by an admin.",
      },
      {
        question: "Is there a cost to join classes?",
        answer:
          "Some classes may have a price listed. Be sure to check the details before signing up!",
      },
      {
        question: "Can I sign up for a full course at once?",
        answer:
          "Yes! If the class is part of a course, you’ll see a 'Sign up for full course' option too.",
      },
    ];

    res.render("about", {
      aboutInfo,
      locations,
      title: "About Us",
      faqs,
    });
  } catch (error) {
    console.error("Error loading about page:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAbout };
