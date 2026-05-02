document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("donationForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const donorName      = document.getElementById("donorName").value;
      const foodType       = document.getElementById("foodType").value;
      const quantity       = document.getElementById("quantity").value;
      const pickupLocation = document.getElementById("pickupLocation").value;
      const phone          = document.getElementById("phone").value;
      const userEmail      = localStorage.getItem("userEmail") || ""; // ✅ links donation to user

      try {
        const res = await fetch("http://localhost:5000/api/food/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ donorName, foodType, quantity, pickupLocation, phone, userEmail })
        });

        const result = await res.json();
        alert(result.message);
        form.reset();

      } catch (error) {
        console.error(error);
        alert("Error submitting donation");
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html"; // ✅ fixed
    });
  }

});