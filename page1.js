import { firebaseConfig } from "./config.js";
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // User is not logged in, redirect to the index page
            location.href = "index.html";
        }
    });

    // Set up signout button functionality
    const signoutBtn = document.querySelector('#signoutbtn');
    signoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                console.log('User signed out successfully');
                location.href = "index.html";
            })
            .catch((error) => {
                alert('Error signing out: ' + error.message);
            });
    });
});
