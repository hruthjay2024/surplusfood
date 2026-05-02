document.addEventListener("DOMContentLoaded", () => {

  // ================= USER LOGIN =================
  const userForm = document.getElementById("userLoginForm");

  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("userEmail").value;
      const password = document.getElementById("userPassword").value;

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ SAVE ROLE IN LOCAL STORAGE
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "home.html";
      }
    });
  }


  // ================= ADMIN LOGIN =================
  const adminForm = document.getElementById("adminLoginForm");

  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("adminEmail").value;
      const password = document.getElementById("adminPassword").value;

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        alert("Not an admin account");
      }
    });
  }

});
