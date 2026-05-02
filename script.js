// ================= AUTH CHECK =================
document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role");

  if (!role) {
    window.location.replace("index.html"); // ✅ fixed: login page is index.html
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

// ================= DONATION FORM =================
const donationForm = document.getElementById("donationForm");

if (donationForm) {
  donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donorName = document.getElementById("donorName").value;
    const foodType = document.getElementById("foodType").value;
    const quantity = document.getElementById("quantity").value;
    const pickupLocation = document.getElementById("pickupLocation").value;
    const phone = document.getElementById("phone") ? document.getElementById("phone").value : "";

    try {
      const res = await fetch("http://localhost:5000/api/food/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName, foodType, quantity, pickupLocation, phone })
      });

      if (!res.ok) throw new Error("Failed");

      alert("Food donated successfully!");
      donationForm.reset();

    } catch (err) {
      alert("Error submitting donation");
    }
  });
}