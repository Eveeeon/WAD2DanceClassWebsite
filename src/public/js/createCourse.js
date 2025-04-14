document.addEventListener("DOMContentLoaded", () => {
  const workshopForm = document.getElementById("workshopForm");
  const recurringForm = document.getElementById("recurringForm");

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  const handleSubmit = (form, endpoint) => {
    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const token = getCookie("accessToken");

      // Attach token to req and send
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Submission failed");
          const json = await res.json();
          window.location.href = `/manageCourses`;
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Something went wrong. Please try again.");
        });
    });
  };

  // Enforce workshop must start on a Saturday
  const isSaturday = (data) => {
    const date = new Date(data.startDate);
    if (date.getDay() !== 6) {
      alert("Workshops must start on a Saturday.");
      return false;
    }
    return true;
  };

  // Attach handlers
  handleSubmit(workshopForm, "/new/workshopCourse", isSaturday);
  handleSubmit(recurringForm, "/new/recurringCourse");
});
