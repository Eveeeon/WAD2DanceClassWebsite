document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("classModal");
    const closeBtn = document.querySelector(".close-btn");
    const registerBtns = document.querySelectorAll(".register-btn");
    const form = document.getElementById("registerClassForm");
  
    const modalName = document.getElementById("modalClassName");
    const modalDesc = document.getElementById("modalClassDescription");
    const modalStart = document.getElementById("modalClassStartTime");
    const modalEnd = document.getElementById("modalClassEndTime");
    const modalLocation = document.getElementById("modalClassLocation");
    const modalPrice = document.getElementById("modalClassPrice");
    const modalClassId = document.getElementById("modalClassId");
  
    // Filtering
    const courseFilter = document.getElementById("courseFilter");
    if (courseFilter) {
      courseFilter.addEventListener("change", (e) => {
        const selectedCourse = e.target.value;
        filterClasses(selectedCourse);
      });
    }
  
    function filterClasses(selectedCourse) {
      const classCards = document.querySelectorAll(".card");
      classCards.forEach(card => {
        const courseName = card.getAttribute("data-course");
        card.style.display = (selectedCourse === "" || courseName === selectedCourse) ? "block" : "none";
      });
    }
  
    // Open modal
    registerBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modalName.textContent = btn.dataset.className;
        modalDesc.textContent = btn.dataset.classDescription;
        modalLocation.textContent = btn.dataset.classLocation;
        modalPrice.textContent = btn.dataset.classPrice;
        modalStart.textContent = btn.dataset.classStart;
        modalEnd.textContent = btn.dataset.classEnd;
        modalClassId.value = btn.dataset.classId;
  
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
  
    // Submit registration
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        classId: modalClassId.value,
        userName: document.getElementById("userName").value,
        userEmail: document.getElementById("userEmail").value,
      };
  
      try {
        const res = await fetch("/register-for-class", {
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
  