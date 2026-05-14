import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const authMessage =
    document.getElementById("authMessage");
const profileButton =
    document.getElementById("profileButton");
const membershipText =
    document.getElementById("membershipText");

onAuthStateChanged(auth, async(user) => {
    if (user) {
        const userDoc = await getDoc(
            doc(db, "users", user.uid)
        );
        if (userDoc.exists()) {
            const data = userDoc.data();
            authMessage.innerHTML =
                `Welcome back, ${data.username} ✨`;
            profileButton.innerHTML =
                data.emoji;
            membershipText.innerHTML =
                `Membership: ${data.membership}`;
        }
    }
});

window.logout = async function() {
    await signOut(auth);
    window.location.href = "login.html";
};

window.resetPassword = async function() {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await sendPasswordResetEmail(
            auth,
            user.email
        );
        alert(
            "Password reset email sent!"
        );
    }
    catch(error) {

        alert(error.message);
    }
};
