import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================
// EMOJI SELECTION
// ======================

let selectedEmoji = "🦋";

window.selectEmoji = function(emoji) {

    selectedEmoji = emoji;

    document.getElementById("selectedEmoji").innerHTML =
        `Selected: ${emoji}`;
};


// ======================
// SIGNUP
// ======================

window.signup = async function() {

    const username =
        document.getElementById("signupUsername").value;

    const email =
        document.getElementById("signupEmail").value;

    const password =
        document.getElementById("signupPassword").value;

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        // Save extra profile info
        await setDoc(doc(db, "users", user.uid), {

            username: username,
            email: email,
            emoji: selectedEmoji,
            membership: "Dreamer",
            createdAt: new Date()

        });

        alert("Account created successfully!");

        window.location.href = "login.html";

    }
    catch(error) {

        alert(error.message);

    }

};


// ======================
// LOGIN
// ======================

window.login = async function() {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login successful!");

        window.location.href = "index.html";

    }
    catch(error) {

        alert(error.message);

    }

};


// ======================
// LOGOUT
// ======================

window.logout = async function() {

    await signOut(auth);

    window.location.href = "login.html";

};


// ======================
// PASSWORD RESET
// ======================

window.resetPassword = async function() {

    const email = prompt(
        "Enter your account email:"
    );

    if (!email) return;

    try {

        await sendPasswordResetEmail(auth, email);

        alert(
            "Password reset email sent!"
        );

    }
    catch(error) {

        alert(error.message);

    }

};
