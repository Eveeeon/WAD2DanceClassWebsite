document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("courseModal");
    const closeBtn = document.querySelector(".close-btn");
    const registerBtns = document.querySelectorAll(".register-btn");
    const form = document.getElementById("registerForm");
  
    const modalName = document.getElementById("modalCourseName");
    const modalDesc = document.getElementById("modalCourseDescription");
    const modalDate = document.getElementById("modalCourseStartDate");
    const modalLocation = document.getElementById("modalCourseLocation");
    const modalPrice = document.getElementById("modalCoursePrice");
    const modalDuration = document.getElementById("modalCourseDuration");
    const modalCourseId = document.getElementById("modalCourseId");
  
    registerBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
  
        modalName.textContent = btn.dataset.courseName;
        modalDesc.textContent = btn.dataset.courseDescription;
        modalLocation.textContent = btn.dataset.courseLocation;
        modalPrice.textContent = btn.dataset.coursePrice;
        modalDuration.textContent = btn.dataset.courseDuration;
        modalDate.textContent = btn.dataset.courseDate;
        modalCourseId.value = btn.dataset.courseId;
  
        modal.style.display = "block";
      });
    });
  
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        courseId: modalCourseId.value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
      };
  
      try {
        const res = await fetch("/courses/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
        alert(data.message);
  
        if (res.ok) {
          modal.style.display = "none";
          form.reset();
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });
  });
  