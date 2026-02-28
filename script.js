document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Username dan Password wajib diisi!");
        return;
    }

    // Contoh validasi dummy
    if (username === "Hani Handayani" && password === "29022004") {
        alert("Login berhasil!");
        window.location.replace("birthday-hani/index.html");

    } else {
        alert("LU SIAPAA?!");
    }
});

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const pupil = document.querySelector(".pupil");

togglePassword.addEventListener("click", () => {

    // Toggle tipe input
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.add("active");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("active");
    }

    // Animasi kedip
    togglePassword.classList.add("blink");
    setTimeout(() => {
        togglePassword.classList.remove("blink");
    }, 200);
});


// Pupil bergerak mengikuti mouse
document.addEventListener("mousemove", (e) => {
    const eyeRect = togglePassword.getBoundingClientRect();
    const centerX = eyeRect.left + eyeRect.width / 2;
    const centerY = eyeRect.top + eyeRect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const radius = 4;

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    pupil.style.transform = `translate(${x}px, ${y}px)`;
});
