console.log("ARCHIVES JS VERSION: STABLE BASE");

/* ===============================
 *   DOM REFERENCES
 * ================================ */

const output = document.getElementById("output");
const input = document.getElementById("command");

if (!output || !input) {
    throw new Error("Missing terminal elements");
}

/* ===============================
 *   SYSTEM STATE
 * ================================ */

let cwd = "/archives";
let clearance = "VISITOR";

/* ===============================
 *   FAKE FILE SYSTEM
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
 *   AMBIENT HUM SETUP
 * ================================ */

let hum = null;
let humEnabled = localStorage.getItem("hum") === "on";

document.addEventListener("DOMContentLoaded", function () {
    hum = document.getElementById("terminalHum");

    if (!hum) {
        console.warn("Terminal hum audio not found");
        return;
    }

    hum.volume = 0.15;

    if (humEnabled) {
        hum.play().catch(() => {});
    }
});

/* ===============================
 *   OUTPUT HELPER
 * ================================ */

function print(line = "") {
    output.textContent += line + "\n";
    output.scrollTop = output.scrollHeight;
}

/* ===============================
 *   INIT
 * ================================ */

print("> ARCHIVES NODE INITIALIZED");
print("> CLEARANCE: VISITOR");
print("> TYPE login | exit\n");

/* ===============================
 *   KEYBOARD: CTRL+C (INTERRUPT)
 * ================================ */

document.addEventListener("keydown", function (e) {
    if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "c" &&
        input.value.length > 0
    ) {
        e.preventDefault();
        print("^C");
        print("INTERRUPT RECEIVED");
        print("PROCESS HALTED\n");
        input.value = "";
    }
});

/* ===============================
 *   INPUT HANDLER
 * ================================ */

input.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const cmd = input.value.trim();
    print("> " + cmd);
    run(cmd);
    input.value = "";
});

/* ===============================
 *   KEYBOARD: ESC (ABORT SESSION)
 * ================================ */

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.activeElement === input) {
        print("\nSIGNAL LOST");
        print("RETURNING TO ENTRY NODE...\n");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 700);
    }
});

/* ===============================
 *   COMMAND ROUTER
 * ================================ */

function run(cmd) {

    /* ---- help ---- */
    if (cmd === "help") {
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
        return;
    }

    /* ---- hum ---- */
    if (cmd === "hum") {
        if (!hum) {
            print("AUDIO SYSTEM NOT AVAILABLE\n");
            return;
        }

        if (!humEnabled) {
            humEnabled = true;
            localStorage.setItem("hum", "on");
            hum.volume = 0.15;
            hum.play().catch(() => {});
            print("AMBIENT HUM: ENABLED\n");
        } else {
            humEnabled = false;
            localStorage.setItem("hum", "off");
            hum.pause();
            print("AMBIENT HUM: DISABLED\n");
        }
        return;
    }

    /* ---- exit / logout ---- */
    if (cmd === "exit" || cmd === "logout") {
        print("SESSION TERMINATED");
        print("RETURNING TO ENTRY NODE...\n");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 800);
        return;
    }

    /* ---- ls ---- */
    if (cmd === "ls") {
        const dir = fs[cwd];
        if (!dir) {
            print("ACCESS ERROR");
            return;
        }

        Object.keys(dir).forEach(function (name) {
            const item = dir[name];
            if (item.type === "dir") {
                print("[DIR ] " + name);
            } else {
                print("[ FILE: " + name.toUpperCase() + " ]");
            }
        });
        return;
    }

    /* ---- cd ---- */
    if (cmd.startsWith("cd ")) {
        const target = cmd.split(" ")[1];

        if (target === "..") {
            cwd = "/archives";
            print("MOVED TO /archives");
            return;
        }

        const next = cwd + "/" + target;
        if (fs[next]) {
            cwd = next;
            print("MOVED TO " + cwd);
        } else {
            print("NO SUCH DIRECTORY");
        }
        return;
    }

    /* ---- login ---- */
    if (cmd === "login") {
        if (clearance !== "VISITOR") {
            print("SESSION ALREADY ACTIVE");
            return;
        }

        print("AUTHENTICATING...");
        setTimeout(function () {
            clearance = "LEVEL_1";
            print("IDENTITY VERIFIED");
            print("CLEARANCE GRANTED: LEVEL_1\n");
            print("> TYPE help | ls | cd | open | hum | exit\n");
        }, 700);
        return;
    }

    /* ---- open ---- */
    if (cmd.startsWith("open ")) {
        const file = cmd.split(" ")[1];
        const item = fs[cwd] && fs[cwd][file];

        if (!item || item.type !== "file") {
            print("FILE NOT FOUND");
            return;
        }

        if (item.clearance === "LEVEL_1" && clearance === "VISITOR") {
            print("ACCESS DENIED");
            print("CLEARANCE INSUFFICIENT\n");
            return;
        }

        print("");
        print("[ OPENING FILE: " + file.toUpperCase() + " ]");
        print("STATUS: DECLASSIFIED (PARTIAL)");
        print(">> CONTENT STREAM AVAILABLE\n");
        return;
    }

    /* ---- fallback ---- */
    print("UNKNOWN COMMAND");
}
