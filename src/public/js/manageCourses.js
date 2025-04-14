document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('editModal');
  const inputContainer = document.getElementById('inputContainer');
  const fieldName = document.getElementById('editFieldName');
  const form = document.getElementById('editForm');

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  const token = getCookie("accessToken");

  // Debug: Check if the token is being fetched correctly
  console.log("Fetched Token:", token);  // <-- Add this line for debugging

  let lastField = null;
  let lastValue = null;

  document.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.field;
      const id = btn.dataset.id;
      const currentValue = btn.dataset.value;
      const entityType = btn.dataset.entity;

      openEditModal(field, id, currentValue, entityType);
    });
  });

  // Add event listener for "Remove Organiser" and "Remove Attendee" buttons
  document.querySelectorAll('[data-action="removeOrganiser"], [data-action="removeAttendee"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const courseId = e.target.dataset.courseId;
      const id = e.target.dataset.id;
      const email = e.target.dataset.email;

      openRemoveConfirmationModal(action, courseId, id, email);
    });
  });

  function openRemoveConfirmationModal(action, courseId, id, email) {
    const confirmationMessage = action === 'removeOrganiser' 
      ? `Are you sure you want to remove this organiser?`
      : `Are you sure you want to remove this attendee?`;

    // Open modal with confirmation message
    modal.style.display = 'block';
    fieldName.innerText = confirmationMessage;

    // Clear previous form data
    inputContainer.innerHTML = '';

    // Set up the form for the action (removal)
    const formHtml = `
      <input type="hidden" name="courseId" value="${courseId}">
      <input type="hidden" name="id" value="${id}">
      ${action === 'removeOrganiser' ? `<input type="hidden" name="email" value="${email}">` : ''}
    `;
    inputContainer.innerHTML = formHtml;

    form.action = `/courses/${courseId}/${action === 'removeOrganiser' ? 'organisers' : 'attendees'}/${id}/remove`;

    // Debug: Check if the action URL is being set correctly
    console.log("Form action URL:", form.action);  // <-- Add this line for debugging

    // Set up the form submission
    form.onsubmit = (e) => {
      e.preventDefault();

      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, id, email })
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          closeModal();
          window.location.reload();
        } else {
          throw new Error(data.message || "Unexpected error");
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('Failed to remove the organiser/attendee. Please try again.');
      });
    };
  }

  // Close the modal
  document.getElementById("closeModalBtn")?.addEventListener("click", closeModal);

  const openEditModal = (field, id, currentValue, entityType) => {
    fieldName.innerText = field;
  
    const valueToUse = (field === lastField && lastValue !== null) ? lastValue : currentValue;
  
    let inputHtml = '';
    if (field.includes("date")) {
      inputHtml = `<input type="datetime-local" name="value" value="${valueToUse}" required>`;
    } else {
      inputHtml = `<input name="value" value="${valueToUse}" required>`;
    }
  
    // Add hidden input for `field`
    inputHtml += `<input type="hidden" name="field" value="${field}">`;
  
    inputContainer.innerHTML = inputHtml;
  
    const inputElement = inputContainer.querySelector('[name="value"]');
    inputElement?.addEventListener('input', (e) => {
      lastValue = e.target.value;
    });
  
    lastField = field;
  
    form.action = `/${entityType === "class" ? "classes" : entityType + "s"}/${id}/updateField`;

    modal.style.display = 'block';
  };

  function closeModal() {
    modal.style.display = 'none';
    lastField = null;
    lastValue = null;
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
