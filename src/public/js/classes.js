document.addEventListener("DOMContentLoaded", () => {
    // Modal Elements
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

    // Filter for course/classes
    const courseFilter = document.getElementById("courseFilter");
    if (courseFilter) {
        courseFilter.addEventListener("change", (e) => {
            const selectedCourse = e.target.value;
            filterClasses(selectedCourse);
        });
    }

    // Apply filter
    function filterClasses(selectedCourse) {
        const classCards = document.querySelectorAll(".card");
        classCards.forEach(card => {
            const courseName = card.getAttribute("data-course");
            card.style.display = (selectedCourse === "" || courseName === selectedCourse) ? "block" : "none";
        });
    }

    // Register for class
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

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // Close modal if clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Handle registration form submission
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
