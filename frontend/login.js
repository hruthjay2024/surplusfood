document.addEventListener("DOMContentLoaded", () => {

  // ================= USER LOGIN =================
  const userForm = document.getElementById("userLoginForm");

  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email    = document.getElementById("userEmail").value;
      const password = document.getElementById("userPassword").value;

      try {
        const res  = await fetch("https://surplusfood-nnfx.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) { alert(data.message); return; }

        // ✅ Save role, email and name
        localStorage.setItem("role",      data.role);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName",  data.name);

        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "home.html";
        }

      } catch (err) {
        alert("Error connecting to server. Please try again.");
      }
    });
  }

  // ================= ADMIN LOGIN =================
  const adminForm = document.getElementById("adminLoginForm");

  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email    = document.getElementById("adminEmail").value;
      const password = document.getElementById("adminPassword").value;

      try {
        const res  = await fetch("https://surplusfood-nnfx.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) { alert(data.message); return; }

        localStorage.setItem("role",      data.role);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName",  data.name);

        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          alert("Not an admin account");
        }

      } catch (err) {
        alert("Error connecting to server. Please try again.");
      }
    });
  }

});