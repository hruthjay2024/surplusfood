const token = localStorage.getItem("token");

// If token missing AND we are NOT on login page
if (!token && !location.pathname.endsWith("index.html")) {
  window.location.replace("index.html");
}
