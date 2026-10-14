const authCard = document.getElementById("authCard");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const promoKicker = document.getElementById("promoKicker");
const promoTitle = document.getElementById("promoTitle");
const promoText = document.getElementById("promoText");
const promoButton = document.getElementById("promoButton");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function setMode(mode) {
  const signup = mode === "signup";
  authCard.classList.toggle("signup-mode", signup);
  loginForm.classList.toggle("active", !signup);
  signupForm.classList.toggle("active", signup);

  if (signup) {
    promoKicker.textContent = "ALREADY A MEMBER?";
    promoTitle.textContent = "Welcome back!";
    promoText.textContent = "Sign in to continue where you left off and explore your workspace.";
    promoButton.innerHTML = 'Login <i class="fa-solid fa-arrow-right"></i>';
    promoButton.setAttribute("aria-label", "Switch to login");
  } else {
    promoKicker.textContent = "NEW HERE?";
    promoTitle.textContent = "Hello, friend!";
    promoText.textContent = "Enter your personal details and start your journey with us.";
    promoButton.innerHTML = 'Sign up <i class="fa-solid fa-arrow-right"></i>';
    promoButton.setAttribute("aria-label", "Switch to sign up");
  }
}

promoButton.addEventListener("click", () => {
  setMode(authCard.classList.contains("signup-mode") ? "login" : "signup");
});
document.querySelectorAll(".switch-to-signup").forEach(button => {
  button.addEventListener("click", () => setMode("signup"));
});
document.querySelectorAll(".switch-to-login").forEach(button => {
  button.addEventListener("click", () => setMode("login"));
});

document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.innerHTML = show
      ? '<i class="fa-regular fa-eye-slash"></i>'
      : '<i class="fa-regular fa-eye"></i>';
    button.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!validEmail(email)) {
    showToast("Please enter a valid email address.");
    document.getElementById("loginEmail").focus();
    return;
  }
  if (!password) {
    showToast("Please enter your password.");
    document.getElementById("loginPassword").focus();
    return;
  }
  showToast("The interface works, but real login needs an authentication backend.");
});

signupForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const accepted = document.getElementById("acceptTerms").checked;

  if (name.length < 2) {
    showToast("Please enter your full name.");
    document.getElementById("signupName").focus();
    return;
  }
  if (!validEmail(email)) {
    showToast("Please enter a valid email address.");
    document.getElementById("signupEmail").focus();
    return;
  }
  if (password.length < 8) {
    showToast("Your password must be at least 8 characters.");
    document.getElementById("signupPassword").focus();
    return;
  }
  if (!accepted) {
    showToast("Please accept the terms and privacy policy.");
    document.getElementById("acceptTerms").focus();
    return;
  }
  showToast("Form validated. Connect an authentication service to create a real account.");
});

document.getElementById("forgotButton").addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  if (!validEmail(email)) {
    showToast("Enter your email address first to request a password reset.");
    document.getElementById("loginEmail").focus();
    return;
  }
  showToast("Password reset needs to be connected to your authentication service.");
});

document.querySelectorAll('[data-demo="google"]').forEach(button => {
  button.addEventListener("click", () => {
    showToast("Google sign-in is a visual demo. Configure Google OAuth to activate it.");
  });
});
