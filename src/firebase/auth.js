// js/auth.js
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email sent. Please check your inbox.");
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    console.error(err.message);
    alert("Login failed: " + err.message);
  }
});
