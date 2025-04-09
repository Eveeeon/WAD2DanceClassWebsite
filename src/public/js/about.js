document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isExpanded = answer.classList.contains("expanded");
  
      if (isExpanded) {
        // Collapse the answer
        answer.classList.remove("expanded");
        question.classList.remove("expanded");
      } else {
        // Expand the answer
        answer.classList.add("expanded");
        question.classList.add("expanded");
      }
    });
  });
});
