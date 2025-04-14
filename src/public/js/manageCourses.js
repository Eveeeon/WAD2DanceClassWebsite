document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("editModal");
  const inputContainer = document.getElementById("inputContainer");
  const fieldName = document.getElementById("editFieldName");
  const form = document.getElementById("editForm");
  let lastField = null;
  let lastValue = null;

  // Fetch the access token
  const token = getCookie("accessToken");

  // Debug: Log token value
  console.log("Fetched Token:", token);

  // Helper function to get a cookie value
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Event listener for edit buttons
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { field, id, value, entity } = btn.dataset;
      openEditModal(field, id, value, entity);
    });
  });

  // Event listener for removing organisers and attendees
  document
    .querySelectorAll(
      '[data-action="removeOrganiser"], [data-action="removeAttendee"]'
    )
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const { action, courseId, id, email } = e.target.dataset;
        openRemoveConfirmationModal(action, courseId, id, email);
      });
    });

  // Event listener for adding organisers
  document.querySelectorAll("[data-action='addOrganiser']").forEach((btn) => {
    btn.addEventListener("submit", (e) => {
      e.preventDefault();

      const courseId = btn.dataset.courseId;
      const organiserId = btn.querySelector("select[name='organiserId']").value;

      // Prepare data for request
      const data = {
        organiserId,
      };

      // Use submitForm to handle request
      const actionUrl = `/courses/${courseId}/addOrganiser/`;
      submitForm(actionUrl, data); 
    });
  });

  // Open the edit modal with proper input fields
  const openEditModal = (field, id, currentValue, entityType) => {
    fieldName.innerText = field;

    let valueToUse =
      field === lastField && lastValue !== null ? lastValue : currentValue;

    // If date field, convert epoch to datetime-local format for input
    const isDateField = field.toLowerCase().includes("date");
    if (isDateField && !isNaN(valueToUse)) {
      const date = new Date(parseInt(valueToUse));
      // Format date for user
      valueToUse = date.toISOString().slice(0, 16);
    }

    const inputHtml = isDateField
      ? `<input type="datetime-local" name="value" value="${valueToUse}" required>`
      : `<input name="value" value="${valueToUse}" required>`;

    // Render inputs in modal
    inputContainer.innerHTML = ` 
      ${inputHtml}
      <input type="hidden" name="field" value="${field}">
    `;

    const inputElement = inputContainer.querySelector('[name="value"]');
    inputElement?.addEventListener("input", (e) => {
      lastValue = e.target.value;
    });

    lastField = field;
    form.action = `/${
      entityType === "class" ? "classes" : entityType + "s"
    }/${id}/updateField`;
    modal.style.display = "block";

    // Prevent default submit & send fetch instead
    form.onsubmit = (e) => {
      e.preventDefault();

      let value = inputElement.value;

      // Convert datetime-local string to epoch if it's a date field
      if (isDateField) {
        value = new Date(value).getTime();
      }

      submitForm(form.action, {
        field,
        value,
      });
    };
  };

  // Open confirmation modal for removal actions (Organiser/Attendee)
  const openRemoveConfirmationModal = (action, courseId, id, email) => {
    const confirmationMessage =
      action === "removeOrganiser"
        ? `Are you sure you want to remove this organiser?`
        : `Are you sure you want to remove this attendee?`;

    // Set up the modal content for removal
    fieldName.innerText = confirmationMessage;
    inputContainer.innerHTML = ` 
      <input type="hidden" name="courseId" value="${courseId}">
      <input type="hidden" name="id" value="${id}">
      ${action === "removeOrganiser" ? "" : `<input type="hidden" name="email" value="${email}">`} 
    `;

    // Construct action URL based on whether we are removing an organiser or attendee
    form.action = `/courses/${courseId}/${
      action === "removeOrganiser" ? "removeOrganiser" : "removeAttendee"
    }/${action === "removeOrganiser" ? id : email}/remove`;

    modal.style.display = "block";

    // Handle form submission
    form.onsubmit = (e) => {
      e.preventDefault();

      const data = {
        courseId,
        id,
        ...(action === "removeAttendee" && { email }), // Add email only for attendees
      };

      submitForm(form.action, data);
    };
  };

  // General form submission handler - prevents default and sends fetch request to prevent redirect
  const submitForm = (actionUrl, data) => {
    fetch(actionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      redirect: "manual",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const responseData = await response.json();
        if (responseData.success) {
          closeModal();
          window.location.reload();
        } else {
          alert(responseData.message || "An error occurred");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again.");
      });
  };

  // Close the modal
  const closeModal = () => {
    modal.style.display = "none";
    lastField = null;
    lastValue = null;
  };

  // Event listener to close the modal if clicked outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close modal on Cancel button click
  document
    .getElementById("closeModalBtn")
    ?.addEventListener("click", closeModal);
});
