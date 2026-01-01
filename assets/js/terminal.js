const lines = [
    "> INITIALIZING AUTHOR NODE...",
"> IDENTITY: K. V. RAMAN",
"> ROLE: NARRATIVE ARCHITECT",
"> STATUS: ACTIVE",
"> NARRATIVES: CLASSIFIED",
"> LAST SIGNAL: LIVE",
"",
"> ACCESS LEVEL: VISITOR",
"> TYPE 'ENTER' TO PROCEED"
];

const terminal = document.getElementById("terminal");
const actions = document.getElementById("actions");

let lineIndex = 0;
let charIndex = 0;
let typingComplete = false;
let enterHandled = false;

/* ===============================
 *   TYPEWRITER
 * ================================ */

function typeLine() {
    if (lineIndex >= lines.length) {
        typingComplete = true;
        terminal.classList.add("cursor");

        // Mobile hint (non-intrusive)
        if (isTouchDevice()) {
            terminal.textContent += "\n> TAP SCREEN TO CONTINUE";
        }

        return;
    }

    if (charIndex < lines[lineIndex].length) {
        terminal.textContent += lines[lineIndex][charIndex];
        charIndex++;
        setTimeout(typeLine, 40);
    } else {
        terminal.textContent += "\n";
        lineIndex++;
        charIndex = 0;
        setTimeout(typeLine, 300);
    }
}

typeLine();

/* ===============================
 *   DEVICE DETECTION
 * ================================ */

function isTouchDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );
}

/* ===============================
 *   ENTER KEY (DESKTOP)
 * ================================ */

document.addEventListener("keydown", (e) => {
    if (!typingComplete || enterHandled) return;

    if (e.key === "Enter") {
        proceed();
    }
});

/* ===============================
 *   TAP / CLICK (MOBILE + FALLBACK)
 * ================================ */

document.addEventListener("click", () => {
    if (!typingComplete || enterHandled) return;

    if (isTouchDevice()) {
        proceed();
    }
});

/* ===============================
 *   PROCEED HANDLER
 * ================================ */

function proceed() {
    enterHandled = true;
    terminal.classList.remove("cursor");

    terminal.textContent += "\n> ENTER RECEIVED";
    terminal.textContent += "\n> ACCESS GRANTED\n";

    setTimeout(() => {
        window.location.href = "archives.html";
    }, 800);
}
