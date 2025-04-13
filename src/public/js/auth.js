// Used to manage authentication tokens and logout functionality from the frontend
document.addEventListener("DOMContentLoaded", function () {
  // Get access token from cookie
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  const token = getCookie("accessToken");

  // Include session token in all fetch requests
  if (token) {
    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
      options.headers = options.headers || {};
      options.headers["Authorization"] = `Bearer ${token}`;
      return originalFetch(url, options);
    };
  }

  // Logout handler
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", async function (e) {
      e.preventDefault();
      try {
        const response = await fetch("/logout", { method: "POST" });
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          // Clear token cookies
          document.cookie = "accessToken=; Max-Age=0; path=/";
          document.cookie = "refreshToken=; Max-Age=0; path=/";
          window.location.href = data.redirectUrl;
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error("Logout failed", err);
      }
    });
  }
});
