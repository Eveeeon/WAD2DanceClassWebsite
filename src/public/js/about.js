document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
  
      question.addEventListener("click", () => {
        const answer = item.querySelector(".faq-answer");
  
        // Toggle visibility of the answer
        answer.classList.toggle("hidden");
  
        // Optionally, log to check if the event is working
        console.log("FAQ question clicked!");
      });
    });
  });
  