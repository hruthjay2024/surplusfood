// ================= AUTH CHECK =================
document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role");

  if (!role) {
    window.location.replace("login.html");
    return;
  }

  // ================= LOGOUT =================
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.replace("login.html");
    });
  }

});

const donationForm = document.getElementById("donationForm");

if (donationForm) {
  donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donorName = document.getElementById("donorName").value;
    const foodType = document.getElementById("foodType").value;
    const quantity = document.getElementById("quantity").value;
    const pickupLocation = document.getElementById("pickupLocation").value;

    try {
      const res = await fetch("https://surplusfood-nnfx.onrender.com/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          donorName,
          foodType,
          quantity,
          pickupLocation
        })
      });

      if (!res.ok) throw new Error("Failed");

      alert("Food donated successfully!");
      donationForm.reset();

    } catch (err) {
      alert("Error submitting donation");
    }
  });
}