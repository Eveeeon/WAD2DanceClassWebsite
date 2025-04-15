const locationDAO = require("@daos/locationDAO");

const getAbout = async (req, res) => {
  try {
    const aboutInfo = {
      title: "About Us",
      description: `We run dance courses in multiple locations across Jiggleton, we run both weekly recurring courses and weekend workshops composed of 5 sessions. You can sign up to a class individually, or full the full course depending on your commitment, though an organiser may wish to restrict sign-ups to one or the other depending on suitability of the classes.`,
    };

    const locations = await locationDAO.findAll();
    const faqs = [
      {
        question: "How do I sign up for a class or course?",
        answer:
          "Simple! Just go to the classes or courses section of the site and select register, enter your name and email, and you'll get a confirmation email.",
      },
      {
        question: "Do I sign up for a full course as well as the classes?",
        answer:
          "No, signing up for a full course just gives you access to all of the classes, signing up for a single class allows you to join just that one class. The sign-ups are distinct.",
      },
      {
        question: "How do I pay for a course or class?",
        answer:
          "We don't currently offer online payments, so the organiser will take payments at the sessions.",
      },
      {
        question: "How do I cancel?",
        answer:
          "In your confirmation email you will see a cancellation link, just click, and you're good.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No, accounts are only for organisers who are hosting sessions, just enter your email and name so that the organiser can see you are joining.",
      },
      {
        question: "Who can see my name and email?",
        answer:
          "Only the site admin and the organisers of the courses and classes you sign up to can see your email and name, we do not share your details with anyone, and cancelling your sign-ups removes your name from our database.",
      },
      {
        question: "Will you use my email for marketing?",
        answer:
          "No, we only send confirmation emails for classes and courses you have signed up to.",
      },
      {
        question: "How can I become an organiser?",
        answer:
          "Reach out to us at danceclassesjiggleton@gmail.com to let us know about yourself and register on the sign up page. Once approved, we will give you access to create courses on the site.",
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
