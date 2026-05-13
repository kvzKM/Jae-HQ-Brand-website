let selectedEmoji = "🦋";

function selectEmoji(emoji) {
    selectedEmoji = emoji;

    document.getElementById("selectedEmoji").innerHTML =
        Selected: ${emoji};
}

function signup() {
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user exists
    const exists = users.find(user => user.username === username);

    if (exists) {
        alert("Username already exists!");
        return;
    }

    users.push({
    username,
    password,
    emoji: selectedEmoji,
    membership: "Dreamer"
});
    
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! Please login.");
    window.location.href = "login.html";
}

function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (user) {
        localStorage.setItem("loggedInUser", username);
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid username or password");
    }
}
