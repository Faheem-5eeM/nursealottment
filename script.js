function showLoginSignupOptions() {
    const selectBox = document.getElementById('initial');
    const loginSignupDiv = document.getElementById('loginSignup'); // Div that contains Login/Signup options
    const loginLink = document.getElementById('loginLink'); // Login button
    const signupLink = document.getElementById('signupLink'); // Signup button

    // Default: Hide the login/signup div
    loginSignupDiv.style.display = "none";

    // Handle different selection options
    if (selectBox.value === "Nurse") {
        loginSignupDiv.style.display = "block";
        loginLink.onclick = () => window.location.href = '/nurse-login'; // Redirect to Nurse Login
        signupLink.onclick = () => window.location.href = '/nurse-register'; // Redirect to Nurse Registration
    } else if (selectBox.value === "Patient") {
        loginSignupDiv.style.display = "block";
        loginLink.onclick = () => window.location.href = '/patient-login'; // Redirect to Patient Login
        signupLink.onclick = () => window.location.href = '/patient-register'; // Redirect to Patient Registration
    } else if (selectBox.value === "Admin") {
        loginSignupDiv.style.display = "block";
        loginLink.onclick = () => window.location.href = '/admin-login'; // Redirect to Admin Login
        signupLink.style.display = "none"; // Hide Signup for Admin
    }
}


// Set the current year dynamically in the footer
document.getElementById('year').textContent = new Date().getFullYear();
