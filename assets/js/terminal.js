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

function typeLine() {
    if (lineIndex >= lines.length) {
        typingComplete = true;
        terminal.classList.add("cursor");
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

/* ===== ENTER KEY HANDLER ===== */

document.addEventListener("keydown", (e) => {
    if (!typingComplete || enterHandled) return;

    if (e.key === "Enter") {
        enterHandled = true;
        terminal.classList.remove("cursor");

        terminal.textContent += "\n> ENTER RECEIVED";
        terminal.textContent += "\n> ACCESS GRANTED\n";

        setTimeout(() => {
            window.location.href = "archives.html";
        }, 800);
    }
});

/* ===== CLICK FALLBACK ===== */

actions?.addEventListener("click", () => {
    if (typingComplete && !enterHandled) {
        window.location.href = "archives.html";
    }
});
