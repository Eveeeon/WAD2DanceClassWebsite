document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const email = formData.get("email");

  try {
    const res = await fetch("/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (result.success) {
      alert(result.message);
      window.location.href = "/login";
    } else {
      alert("Something went wrong: " + result.message);
    }
  } catch (err) {
    alert("An error occurred while sending the reset request.");
  }
});
