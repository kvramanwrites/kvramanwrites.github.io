console.log("ARCHIVES JS VERSION: STABLE BASE");

/* ===============================
 *   DOM
 * ================================ */

const output = document.getElementById("output");
const input  = document.getElementById("command");

if (!output || !input) {
    throw new Error("Missing terminal elements");
}

/* ===============================
 *   ENVIRONMENT
 * ================================ */

const isTouch =
"ontouchstart" in window ||
navigator.maxTouchPoints > 0;

/* ===============================
 *   SYSTEM STATE
 * ================================ */

let cwd = "/archives";
let clearance = "VISITOR";

/* ===============================
 *   FILE SYSTEM (SIMULATED)
 * ================================ */

const fs = {
    "/archives": {
        "whisper_protocol": { type: "file", clearance: "LEVEL_1" },
        "dossiers": { type: "dir" },
        "logs": { type: "dir" }
    },
    "/archives/dossiers": {
        "agents": { type: "dir" },
        "symbols": { type: "dir" }
    },
    "/archives/logs": {
        "build_log_01": { type: "file", clearance: "VISITOR" }
    }
};

/* ===============================
 *   OUTPUT API
 * ================================ */

function print(line = "") {
    output.textContent += line + "\n";
    output.scrollTop = output.scrollHeight;
}

function focusInput() {
    input.focus();
}

/* ===============================
 *   AMBIENT HUM
 * ================================ */

let hum = null;
let humEnabled = localStorage.getItem("hum") === "on";

document.addEventListener("DOMContentLoaded", () => {
    hum = document.getElementById("terminalHum");
    if (!hum) return;

    hum.volume = 0.15;
    if (humEnabled) hum.play().catch(() => {});
});

function toggleHum() {
    if (!hum) {
        print("AUDIO SYSTEM NOT AVAILABLE\n");
        return;
    }

    humEnabled = !humEnabled;
    localStorage.setItem("hum", humEnabled ? "on" : "off");

    if (humEnabled) {
        hum.play().catch(() => {});
        print("AMBIENT HUM: ENABLED\n");
    } else {
        hum.pause();
        print("AMBIENT HUM: DISABLED\n");
    }
}

/* ===============================
 *   INIT
 * ================================ */

print("> ARCHIVES NODE INITIALIZED");
print("> CLEARANCE: VISITOR");
print("> TYPE login | exit\n");

/* ===============================
 *   INPUT ADAPTERS
 * ================================ */

// ENTER → command execution
input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = input.value.trim();
    print("> " + cmd);
    run(cmd);
    input.value = "";
});

// CTRL+C → interrupt
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "c" && input.value.length) {
        e.preventDefault();
        print("^C");
        print("INTERRUPT RECEIVED");
        print("PROCESS HALTED\n");
        input.value = "";
    }
});

// ESC → abort
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.activeElement === input) {
        abortSession();
    }
});

// Mobile: tap anywhere → focus input
if (isTouch) {
    document.addEventListener("click", focusInput);
}

/* ===============================
 *   COMMANDS
 * ================================ */

const commands = {

    help() {
        if (clearance === "VISITOR") {
            print("ACCESS DENIED");
            print("AUTHENTICATION REQUIRED\n");
            return;
        }
        print("AVAILABLE COMMANDS:");
        print("  login        → authenticate session");
        print("  ls           → list directory contents");
        print("  cd <dir>     → change directory");
        print("  open <file>  → access file");
        print("  hum          → toggle ambient system audio");
        print("  exit         → terminate session");
        print("  ESC          → emergency abort\n");
    },

    login() {
        if (clearance !== "VISITOR") {
            print("SESSION ALREADY ACTIVE");
            return;
        }
        print("AUTHENTICATING...");
        setTimeout(() => {
            clearance = "LEVEL_1";
            print("IDENTITY VERIFIED");
            print("CLEARANCE GRANTED: LEVEL_1\n");
            print("> TYPE help | ls | cd | open | hum | exit\n");
        }, 700);
    },

    ls() {
        const dir = fs[cwd];
        if (!dir) return print("ACCESS ERROR");
        Object.entries(dir).forEach(([name, item]) => {
            print(item.type === "dir"
            ? `[DIR ] ${name}`
            : `[ FILE: ${name.toUpperCase()} ]`);
        });
    },

    cd(arg) {
        if (arg === "..") {
            cwd = "/archives";
            return print("MOVED TO /archives");
        }
        const next = `${cwd}/${arg}`;
        fs[next] ? (cwd = next, print(`MOVED TO ${cwd}`))
        : print("NO SUCH DIRECTORY");
    },

    open(file) {
        const item = fs[cwd]?.[file];
        if (!item || item.type !== "file") return print("FILE NOT FOUND");
        if (item.clearance === "LEVEL_1" && clearance === "VISITOR") {
            print("ACCESS DENIED");
            print("CLEARANCE INSUFFICIENT\n");
            return;
        }
        print("");
        print(`[ OPENING FILE: ${file.toUpperCase()} ]`);
        print("STATUS: DECLASSIFIED (PARTIAL)");
        print(">> CONTENT STREAM AVAILABLE\n");
    },

    hum: toggleHum,

    exit: abortSession,
    logout: abortSession
};

/* ===============================
 *   COMMAND ROUTER
 * ================================ */

function run(input) {
    const [cmd, arg] = input.split(" ");
    commands[cmd] ? commands[cmd](arg) : print("UNKNOWN COMMAND");
}

/* ===============================
 *   SESSION CONTROL
 * ================================ */

function abortSession() {
    print("\nSIGNAL LOST");
    print("RETURNING TO ENTRY NODE...\n");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 700);
}
