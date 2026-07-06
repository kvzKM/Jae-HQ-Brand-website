import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    getDocFromServer,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const DEFAULT_EMOJI = "🦋";
const ALLOWED_EMOJIS = ["🦋", "🌸", "🌙", "⭐", "🧸", "☁️", "🍄", "🐇"];
let selectedEmoji = DEFAULT_EMOJI;

function cleanText(value) {
    return String(value ?? "").trim();
}

function setMessage(message, type = "") {
    const element = document.getElementById("formMessage");
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`.trim();
}

function friendlyAuthError(error) {
    const messages = {
        "auth/email-already-in-use": "That email address already has a JAE HQ account.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/invalid-credential": "The email or password is incorrect.",
        "auth/missing-password": "Please enter your password.",
        "auth/weak-password": "Your password must contain at least 6 characters.",
        "auth/too-many-requests": "Too many attempts were made. Please try again a little later."
    };

    return messages[error?.code] || "Something went wrong. Please try again.";
}

export async function getUserProfile(uid) {
    if (!uid) return null;

    const reference = doc(db, "users", uid);

    try {
        const snapshot = await getDocFromServer(reference);
        const profile = snapshot.exists()
            ? { id: snapshot.id, ...snapshot.data() }
            : null;

        console.info("[JAE HQ AUTH]", {
            uid,
            profileDocumentId: profile?.id ?? null,
            role: profile?.role ?? null,
            source: "server"
        });

        return profile;
    } catch (serverError) {
        console.warn(
            "Could not read the profile directly from Firestore server. Falling back to the standard Firestore read.",
            serverError
        );

        const snapshot = await getDoc(reference);
        const profile = snapshot.exists()
            ? { id: snapshot.id, ...snapshot.data() }
            : null;

        console.info("[JAE HQ AUTH]", {
            uid,
            profileDocumentId: profile?.id ?? null,
            role: profile?.role ?? null,
            source: "fallback"
        });

        return profile;
    }
}

export function watchAuth(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (!user) {
            callback({ user: null, profile: null });
            return;
        }

        try {
            const profile = await getUserProfile(user.uid);
            callback({ user, profile });
        } catch (error) {
            console.error("Could not load user profile:", error);
            callback({ user, profile: null });
        }
    });
}

window.selectEmoji = function selectEmoji(emoji) {
    if (!ALLOWED_EMOJIS.includes(emoji)) return;
    selectedEmoji = emoji;

    document.querySelectorAll(".emoji-option").forEach((button) => {
        button.classList.toggle("selected", button.dataset.emoji === emoji);
    });

    const selected = document.getElementById("selectedEmoji");
    if (selected) selected.textContent = `Selected identity: ${emoji}`;
};

window.signup = async function signup() {
    const username = cleanText(document.getElementById("signupUsername")?.value);
    const email = cleanText(document.getElementById("signupEmail")?.value).toLowerCase();
    const password = document.getElementById("signupPassword")?.value ?? "";
    const button = document.getElementById("signupButton");

    if (username.length < 2 || username.length > 30) {
        setMessage("Your username must be between 2 and 30 characters.", "error");
        return;
    }

    if (!email || !password) {
        setMessage("Please complete your email and password.", "error");
        return;
    }

    button?.setAttribute("disabled", "true");
    setMessage("Creating your JAE HQ account...");

    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: username });

        await setDoc(doc(db, "users", credential.user.uid), {
            username,
            email,
            emoji: selectedEmoji,
            role: "member",
            membership: "JAE HQ Member",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        setMessage("Account created. Welcome to JAE HQ.", "success");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Signup failed:", error);
        setMessage(friendlyAuthError(error), "error");
        button?.removeAttribute("disabled");
    }
};

window.login = async function login() {
    const email = cleanText(document.getElementById("loginEmail")?.value).toLowerCase();
    const password = document.getElementById("loginPassword")?.value ?? "";
    const button = document.getElementById("loginButton");

    if (!email || !password) {
        setMessage("Please enter your email and password.", "error");
        return;
    }

    button?.setAttribute("disabled", "true");
    setMessage("Signing you in...");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Welcome back.", "success");

        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");

        if (next) {
            try {
                const nextUrl = new URL(next, window.location.origin);
                window.location.href = nextUrl.origin === window.location.origin
                    ? `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
                    : "index.html";
            } catch (redirectError) {
                console.warn("Ignored invalid login redirect:", redirectError);
                window.location.href = "index.html";
            }
        } else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Login failed:", error);
        setMessage(friendlyAuthError(error), "error");
        button?.removeAttribute("disabled");
    }
};

window.logout = async function logout() {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

window.resetPassword = async function resetPassword() {
    const inputEmail = cleanText(document.getElementById("loginEmail")?.value).toLowerCase();
    const email = inputEmail || auth.currentUser?.email;

    if (!email) {
        setMessage("Enter your account email first, then select reset password.", "error");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Please check your inbox.", "success");
    } catch (error) {
        console.error("Password reset failed:", error);
        setMessage(friendlyAuthError(error), "error");
    }
};

window.saveProfile = async function saveProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html?next=/profile.html";
        return;
    }

    const username = cleanText(document.getElementById("profileUsername")?.value);

    if (username.length < 2 || username.length > 30) {
        setMessage("Your username must be between 2 and 30 characters.", "error");
        return;
    }

    try {
        await updateDoc(doc(db, "users", user.uid), {
            username,
            emoji: selectedEmoji,
            updatedAt: serverTimestamp()
        });

        await updateProfile(user, { displayName: username });
        setMessage("Profile updated successfully.", "success");
    } catch (error) {
        console.error("Profile update failed:", error);
        setMessage("We could not save your profile. Please try again.", "error");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(`[data-emoji="${DEFAULT_EMOJI}"]`)?.classList.add("selected");

    if (document.body.dataset.page === "profile") {
        watchAuth(({ user, profile }) => {
            if (!user) {
                window.location.href = "login.html?next=/profile.html";
                return;
            }

            const usernameInput = document.getElementById("profileUsername");
            const emailInput = document.getElementById("profileEmail");
            const avatar = document.getElementById("profileAvatar");
            const membership = document.getElementById("profileMembership");
            const role = document.getElementById("profileRole");

            selectedEmoji = profile?.emoji || DEFAULT_EMOJI;
            window.selectEmoji(selectedEmoji);

            if (usernameInput) usernameInput.value = profile?.username || user.displayName || "";
            if (emailInput) emailInput.value = user.email || "";
            if (avatar) avatar.textContent = selectedEmoji;
            if (membership) membership.textContent = profile?.membership || "JAE HQ Member";
            if (role) role.textContent = profile?.role === "admin" ? "Administrator" : "Member";
        });
    }
});
