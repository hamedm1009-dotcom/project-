import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3D_H82lJNsurcXDII5p3UoJPSIQ_8dEI",
  authDomain: "qube-io.firebaseapp.com",
  projectId: "qube-io",
  storageBucket: "qube-io.firebasestorage.app",
  messagingSenderId: "914137673124",
  appId: "1:914137673124:web:221687816edec786156531",
  measurementId: "G-GPFV0098X1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

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
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
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
promoButton.addEventListener("click", () => setMode(authCard.classList.contains("signup-mode") ? "login" : "signup"));
document.querySelectorAll(".switch-to-signup").forEach(b => b.addEventListener("click", () => setMode("signup")));
document.querySelectorAll(".switch-to-login").forEach(b => b.addEventListener("click", () => setMode("login")));

document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.innerHTML = show ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    button.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
function friendlyError(error) {
  const messages = {
    "auth/popup-closed-by-user": "You closed the Google sign-in window before finishing.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup. Allow popups and try again.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication settings.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Authentication.",
    "auth/email-already-in-use": "An account already exists with this email. Try logging in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/user-not-found": "No account was found for this email. Create an account first.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/network-request-failed": "Network problem. Check your internet connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a little and try again."
  };
  return messages[error?.code] || `Sign-in failed (${error?.code || "unknown error"}). Please try again.`;
}
async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showToast(`Welcome${result.user.displayName ? ", " + result.user.displayName : ""}! Google sign-in successful.`);
  } catch (error) {
    console.error(error);
    showToast(friendlyError(error));
  }
}
document.querySelectorAll('[data-demo="google"]').forEach(b => b.addEventListener("click", googleSignIn));

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!validEmail(email)) { showToast("Please enter a valid email address."); return; }
  if (!password) { showToast("Please enter your password."); return; }
  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    showToast(`Welcome back${result.user.displayName ? ", " + result.user.displayName : ""}! Login successful.`);
  } catch (error) { console.error(error); showToast(friendlyError(error)); }
  finally { button.disabled = false; }
});

signupForm.addEventListener("submit", async event => {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  if (name.length < 2) { showToast("Please enter your full name."); return; }
  if (!validEmail(email)) { showToast("Please enter a valid email address."); return; }
  if (password.length < 6) { showToast("Password must be at least 6 characters for Firebase."); return; }
  if (!document.getElementById("acceptTerms").checked) { showToast("Please accept the terms and privacy policy."); return; }
  const button = signupForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    showToast("Account created successfully!");
    signupForm.reset();
  } catch (error) { console.error(error); showToast(friendlyError(error)); }
  finally { button.disabled = false; }
});

document.getElementById("forgotButton").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  if (!validEmail(email)) { showToast("Enter your email address first to request a password reset."); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    showToast("If an account exists for this email, a password reset email has been sent.");
  } catch (error) { console.error(error); showToast(friendlyError(error)); }
});
