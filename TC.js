document.getElementById("userForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let postal = document.getElementById("postal").value.trim();

  // Regex patterns
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  let phoneRegex = /^[0-9]{10}$/;
  let postalRegex = /^[0-9]{6}$/;

  // Clear old messages
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("postalError").textContent = "";

  let valid = true;

  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Invalid email format!";
    valid = false;
  }
  if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").textContent = "Phone must be 10 digits!";
    valid = false;
  }
  if (!postalRegex.test(postal)) {
    document.getElementById("postalError").textContent = "Postal code must be 6 digits!";
    valid = false;
  }

  if (valid) {
    alert("Form submitted successfully!");
  }
});