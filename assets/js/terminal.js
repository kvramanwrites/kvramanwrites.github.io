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

function typeLine() {
    if (lineIndex >= lines.length) {
        actions.classList.remove("hidden");
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
