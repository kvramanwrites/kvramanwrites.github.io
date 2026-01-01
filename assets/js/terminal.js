/* ===============================
 *   AUTHOR NODE — TERMINAL BOOT
 * ================================ */

/* ===============================
 *   ENVIRONMENT
 * ================================ */

const isTouch =
"ontouchstart" in window ||
navigator.maxTouchPoints > 0;

/* ===============================
 *   BOOT SEQUENCE LINES
 * ================================ */

const lines = [
    "> INITIALIZING AUTHOR NODE...",
"> IDENTITY: K. V. RAMAN",
"> ROLE: NARRATIVE ARCHITECT",
"> STATUS: ACTIVE",
"> NARRATIVES: CLASSIFIED",
"> LAST SIGNAL: LIVE",
"",
"> ACCESS LEVEL: VISITOR",
isTouch
? "> TAP SCREEN TO CONTINUE"
: "> TYPE 'ENTER' TO PROCEED"
];

/* ===============================
 *   DOM
 * ================================ */

const terminal = document.getElementById("terminal");
const actions  = document.getElementById("actions");

/* ===============================
 *   STATE
 * ================================ */

let lineIndex = 0;
let charIndex = 0;
let typingComplete = false;
let enterHandled = false;

/* ===============================
 *   TYPEWRITER ENGINE
 * ================================ */

function typeLine() {
    if (lineIndex >= lines.length) {
        onTypingComplete();
        return;
    }

    if (charIndex < lines[lineIndex].length) {
        terminal.textContent += lines[lineIndex][charIndex++];
        setTimeout(typeLine, 40);
    } else {
        terminal.textContent += "\n";
        lineIndex++;
        charIndex = 0;
        setTimeout(typeLine, 300);
    }
}

function onTypingComplete() {
    typingComplete = true;
    terminal.classList.add("cursor");
}

/* ===============================
 *   INPUT ADAPTERS
 * ================================ */

// Desktop: ENTER key
document.addEventListener("keydown", (e) => {
    if (!typingComplete || enterHandled) return;
    if (!isTouch && e.key === "Enter") {
        proceed();
    }
});

// Mobile / touch: TAP anywhere
document.addEventListener("click", () => {
    if (!typingComplete || enterHandled) return;
    if (isTouch) {
        proceed();
    }
});

/* ===============================
 *   TRANSITION
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

/* ===============================
 *   BOOT
 * ================================ */

typeLine();
