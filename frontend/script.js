// ================= AUTH CHECK =================
document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role");

  if (!role) {
    window.location.replace("index.html"); // ✅ fixed: was "login.html"
    return;
  }

  // ================= LOGOUT =================
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.replace("index.html"); // ✅ fixed
    });
  }

});