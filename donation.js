// Wait until page fully loads
document.addEventListener("DOMContentLoaded", () => {

  // ===== DONATION FORM =====
  const form = document.getElementById("donationForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const donorName = document.getElementById("donorName").value;
      const foodType = document.getElementById("foodType").value;
      const quantity = document.getElementById("quantity").value;
      const pickupLocation = document.getElementById("pickupLocation").value;
      const phone = document.getElementById("phone").value;

      const data = {
        donorName,
        foodType,
        quantity,
        pickupLocation,
        phone
      };

      try {
        const res = await fetch("http://localhost:5000/api/food/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);

        form.reset(); // clear form

      } catch (error) {
        console.error(error);
        alert("Error submitting donation");
      }
    });
  }

  // ===== LOGOUT BUTTON =====
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  }

});
