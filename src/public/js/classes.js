document.addEventListener("DOMContentLoaded", () => {
  // Modal related variables
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

  // Course filter logic
  const courseFilter = document.getElementById("courseFilter");
  const classGrid = document.getElementById("classGrid");
  const classCards = classGrid.getElementsByClassName("card");

  // Open the modal when the register button is clicked
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

  // Close the modal when the close button is clicked
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal if clicked outside of it
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Registration form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      classId: modalClassId.value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
    };

    try {
      const res = await fetch("classes/register", {
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

  // Filter the classes based on the selected course
  courseFilter.addEventListener("change", () => {
    const selectedCourse = courseFilter.value.toLowerCase().trim();

    for (let card of classCards) {
      const courseName = card.getAttribute("data-course").toLowerCase();

      // If the filter value is empty or matches the class's course name, show the class
      if (!selectedCourse || courseName === selectedCourse) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    }
  });
});
