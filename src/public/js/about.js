document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq_item");
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq_question");
  
      question.addEventListener("click", () => {
        const answer = item.querySelector(".faq_answer");
  
        // Toggle visibility of the answer
        answer.classList.toggle("hidden");
  
        // Optionally, log to check if the event is working
        console.log("FAQ question clicked!");
      });
    });
  });
  