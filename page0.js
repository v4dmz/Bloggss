import { firebaseConfig } from './config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('#signupForm');
  const loginForm = document.querySelector('#loginForm');
  const forgotForm = document.querySelector('#forgotForm');
  const signupBtn = document.querySelector('.signupbtn');
  const loginBtn = document.querySelector('.loginbtn');
  const forgotBtn = document.querySelector('.forgotbtn');
  const anchors = document.querySelectorAll('a');

  // Function to toggle forms visibility using Tailwind CSS classes
  function toggleForms(showForm) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    forgotForm.classList.add('hidden');

    switch (showForm) {
      case 'login':
        loginForm.classList.remove('hidden');
        loginForm.classList.add('block');
        break;
      case 'signup':
        signupForm.classList.remove('hidden');
        signupForm.classList.add('block');
        break;
      case 'forgot':
        forgotForm.classList.remove('hidden');
        forgotForm.classList.add('block');
        break;
    }
  }

  // Check if the user is already signed in
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified) {
        console.log('User is already signed in and verified.');
        location.href = "dashboard.html"; // Redirect to dashboard
      } else {
        alert('Please verify your email before accessing your account.');
      }
    } else {
      // No user is signed in, show the login form by default
      toggleForms('login');
    }
  });

  anchors.forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent default anchor behavior
      const id = anchor.id;
      switch (id) {
        case 'loginLabel':
          toggleForms('login');
          break;
        case 'signupLabel':
          toggleForms('signup');
          break;
        case 'forgotLabel':
          toggleForms('forgot');
          break;
      }
    });
  });

  signupBtn.addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        user.sendEmailVerification()
          .then(() => {
            alert('Verification email sent. Please check your inbox and verify your email before signing in.');
          })
          .catch((error) => {
            alert('Error sending verification email: ' + error.message);
          });

        firestore.collection('users').doc(uid).set({
          name: name,
          username: username,
          email: email,
        });

        toggleForms('login');
      })
      .catch((error) => {
        alert('Error signing up: ' + error.message);
      });
  });

  loginBtn.addEventListener('click', () => {
    const email = document.querySelector('#inUsr').value.trim();
    const password = document.querySelector('#inPass').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          console.log('User is signed in with a verified email.');
          location.href = "dashboard.html";
        } else {
          alert('Please verify your email before signing in.');
        }
      })
      .catch((error) => {
        alert('Error signing in: ' + error.message);
      });
  });

  forgotBtn.addEventListener('click', () => {
    const emailForReset = document.querySelector('#forgotinp').value.trim();
    if (emailForReset.length > 0) {
      auth.sendPasswordResetEmail(emailForReset)
        .then(() => {
          alert('Password reset email sent. Please check your inbox to reset your password.');
          toggleForms('login');
        })
        .catch((error) => {
          alert('Error sending password reset email: ' + error.message);
        });
    }
  });

});
