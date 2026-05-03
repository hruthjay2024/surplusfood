// ============================================================
// otp-popup.js — include on every page for OTP popup support
// ============================================================

(function () {

  const popupHTML = `
    <style>
      #otpTriggerBtn {
        display: none; position: fixed; bottom: 28px; right: 28px;
        background: #2e7d32; color: white; border: none;
        padding: 14px 22px; border-radius: 50px; font-size: 15px;
        font-weight: bold; cursor: pointer;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3); z-index: 9000; transition: 0.2s;
      }
      #otpTriggerBtn:hover { background: #1b5e20; transform: scale(1.04); }
      #otpTriggerBtn.pulse { animation: otpPulse 1.5s infinite; }
      @keyframes otpPulse {
        0%   { box-shadow: 0 0 0 0 rgba(46,125,50,0.6); }
        70%  { box-shadow: 0 0 0 14px rgba(46,125,50,0); }
        100% { box-shadow: 0 0 0 0 rgba(46,125,50,0); }
      }
      #otpOverlay {
        display: none; position: fixed; inset: 0;
        background: rgba(0,0,0,0.65); z-index: 9999;
        justify-content: center; align-items: center; backdrop-filter: blur(3px);
      }
      #otpOverlay.active { display: flex; }
      .otp-popup {
        background: white; border-radius: 20px; padding: 40px 36px;
        width: 90%; max-width: 400px; text-align: center;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3); animation: otpPopIn 0.3s ease;
      }
      @keyframes otpPopIn {
        from { transform: scale(0.85); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }
      .otp-popup .popup-icon { font-size: 52px; margin-bottom: 10px; }
      .otp-popup h3 { color: #2e7d32; font-size: 22px; margin-bottom: 6px; }
      .otp-popup .popup-desc { color: #666; font-size: 14px; margin-bottom: 22px; line-height: 1.6; }
      #otpDonationSelect {
        width: 100%; padding: 11px; border-radius: 8px;
        border: 2px solid #e0e0e0; font-size: 14px;
        margin-bottom: 14px; color: #333; box-sizing: border-box;
      }
      #otpInputField {
        width: 100%; padding: 16px; font-size: 32px;
        letter-spacing: 12px; text-align: center; font-weight: bold;
        color: #e65100; border: 2px solid #e0e0e0; border-radius: 10px;
        margin-bottom: 8px; box-sizing: border-box;
      }
      #otpInputField:focus { outline: none; border-color: #2e7d32; }
      #otpError {
        color: #c62828; font-size: 13px; margin-bottom: 10px;
        display: none; text-align: left;
        background: #ffebee; padding: 8px 10px; border-radius: 6px;
      }
      .btn-otp-verify {
        width: 100%; padding: 14px; background: #2e7d32; color: white;
        border: none; border-radius: 10px; font-size: 16px;
        font-weight: bold; cursor: pointer; transition: 0.2s; margin-bottom: 10px;
      }
      .btn-otp-verify:hover { background: #1b5e20; }
      .btn-otp-verify:disabled { background: #a5d6a7; cursor: not-allowed; }
      .btn-otp-close { background: none; border: none; color: #999; font-size: 13px; cursor: pointer; }
      .btn-otp-close:hover { color: #555; }
      #otpSuccessView { display: none; }
      #otpSuccessView .big-check { font-size: 70px; }
      #otpSuccessView h3 { color: #2e7d32; font-size: 22px; margin: 10px 0 6px; }
      #otpSuccessView p  { color: #666; font-size: 14px; margin-bottom: 20px; }
    </style>

    <button id="otpTriggerBtn" onclick="otpOpenPopup()">
      🔐 Enter OTP to Confirm Pickup
    </button>

    <div id="otpOverlay">
      <div class="otp-popup">
        <div id="otpFormView">
          <div class="popup-icon">🔐</div>
          <h3>Enter OTP</h3>
          <p class="popup-desc">
            The receiver is at your location.<br>
            Enter the OTP shown on the admin's screen to confirm pickup.
          </p>
          <select id="otpDonationSelect">
            <option value="">-- Select your donation --</option>
          </select>
          <input type="text" id="otpInputField" maxlength="6" placeholder="● ● ● ● ● ●" />
          <div id="otpError"></div>
          <button class="btn-otp-verify" id="verifyOtpBtn" onclick="otpSubmit()">
            ✅ Confirm & Allow Pickup
          </button>
          <br>
          <button class="btn-otp-close" onclick="otpClosePopup()">✕ Close</button>
        </div>
        <div id="otpSuccessView">
          <div class="big-check">✅</div>
          <h3>Pickup Confirmed!</h3>
          <p>Receiver verified successfully.<br>Your food is being collected. Thank you! 🙏</p>
          <button class="btn-otp-verify" onclick="otpClosePopup()">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", popupHTML);

  const role      = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail") || "";

  if (!role || role === "admin" || !userEmail) return;

  window.otpOpenPopup = function () {
    document.getElementById("otpOverlay").classList.add("active");
    document.getElementById("otpFormView").style.display  = "block";
    document.getElementById("otpSuccessView").style.display = "none";
    document.getElementById("otpError").style.display = "none";
    document.getElementById("otpInputField").value = "";
    const btn = document.getElementById("verifyOtpBtn");
    btn.disabled = false;
    btn.textContent = "✅ Confirm & Allow Pickup";
  };

  window.otpClosePopup = function () {
    document.getElementById("otpOverlay").classList.remove("active");
  };

  document.getElementById("otpOverlay").addEventListener("click", function (e) {
    if (e.target === this) otpClosePopup();
  });

  document.getElementById("otpInputField").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  async function checkPendingOTPs() {
    try {
      const res  = await fetch("https://surplusfood-nnfx.onrender.com/api/food/all");
      const all  = await res.json();

      const mine = all.filter(d => !d.otpVerified && d.userEmail === userEmail);
      if (mine.length === 0) return;

      const select = document.getElementById("otpDonationSelect");
      select.innerHTML = '<option value="">-- Select your donation --</option>';
      mine.forEach(d => {
        select.innerHTML += `<option value="${d._id}">${d.donorName} — ${d.foodType} (${d.quantity})</option>`;
      });

      let anyPending = false;
      for (const d of mine) {
        try {
          const r  = await fetch(`https://surplusfood-nnfx.onrender.com/api/otp/pending/${d._id}`);
          const rd = await r.json();
          if (rd.pending) { anyPending = true; break; }
        } catch {}
      }

      const btn = document.getElementById("otpTriggerBtn");
      btn.style.display = "block";
      if (anyPending) { btn.classList.add("pulse"); otpOpenPopup(); }

    } catch {}
  }

  window.otpSubmit = async function () {
    const donationId = document.getElementById("otpDonationSelect").value;
    const otp        = document.getElementById("otpInputField").value.trim();
    const errEl      = document.getElementById("otpError");
    const btn        = document.getElementById("verifyOtpBtn");

    errEl.style.display = "none";

    if (!donationId) {
      errEl.textContent = "Please select your donation.";
      errEl.style.display = "block"; return;
    }
    if (!otp || otp.length !== 6) {
      errEl.textContent = "Please enter the 6-digit OTP.";
      errEl.style.display = "block"; return;
    }

    btn.disabled = true; btn.textContent = "Verifying...";

    try {
      const res  = await fetch(`https://surplusfood-nnfx.onrender.com/api/otp/verify/${donationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();

      if (!res.ok) {
        errEl.textContent = data.message || "Invalid OTP.";
        errEl.style.display = "block";
        btn.disabled = false;
        btn.textContent = "✅ Confirm & Allow Pickup";
        return;
      }

      await fetch(`https://surplusfood-nnfx.onrender.com/api/food/otp-verified/${donationId}`, {
        method: "PUT"
      });

      document.getElementById("otpFormView").style.display   = "none";
      document.getElementById("otpSuccessView").style.display = "block";
      document.getElementById("otpTriggerBtn").style.display  = "none";

    } catch {
      errEl.textContent = "Server error. Please try again.";
      errEl.style.display = "block";
      btn.disabled = false;
      btn.textContent = "✅ Confirm & Allow Pickup";
    }
  };

  checkPendingOTPs();
  setInterval(checkPendingOTPs, 15000);

})();