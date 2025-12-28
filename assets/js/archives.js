const output = document.getElementById("output");
const input = document.getElementById("command");

if (!output || !input) {
    throw new Error("Terminal DOM elements not found");
}

let cwd = "/archives";
let clearance = "VISITOR";
let loggedIn = false;

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

function print(text = "") {
    output.textContent += text + "\n";
    output.scrollTop = output.scrollHeight;
}

/* ===== INIT ===== */

print("> ARCHIVES NODE INITIALIZED");
print("> CLEARANCE: VISITOR");
print("> TYPE `ls` TO LIST FILES\n");

/* ===== INPUT HANDLER ===== */

input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const cmd = input.value.trim();
    print(`> ${cmd}`);
    handleCommand(cmd);
    input.value = "";
});

/* ===== COMMAND HANDLER ===== */

function handleCommand(cmd) {

    /* ---- ls ---- */
    if (cmd === "ls") {
        const dir = fs[cwd];
        if (!dir) {
            print("ACCESS ERROR");
            return;
        }

        Object.keys(dir).forEach(name => {
            const item = dir[name];
            if (item.type === "dir") {
                print(`[DIR ] ${name}`);
            } else {
                print(`[ FILE: ${name.toUpperCase()} ]`);
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

        const next = `${cwd}/${target}`;
        if (fs[next]) {
            cwd = next;
            print(`MOVED TO ${cwd}`);
        } else {
            print("NO SUCH DIRECTORY");
        }
        return;
    }

    /* ---- login ---- */
    if (cmd === "login") {
        if (loggedIn) {
            print("SESSION ALREADY ACTIVE");
            return;
        }

        print("AUTHENTICATING...");
        setTimeout(() => {
            loggedIn = true;
            clearance = "LEVEL_1";
            print("IDENTITY VERIFIED");
            print("CLEARANCE GRANTED: LEVEL_1\n");
        }, 800);
        return;
    }

    /* ---- open ---- */
    if (cmd.startsWith("open ")) {
        const file = cmd.split(" ")[1];
        const item = fs[cwd]?.[file];

        if (!item || item.type !== "file") {
            print("FILE NOT FOUND");
            return;
        }

        if (clearance === "VISITOR" && item.clearance !== "VISITOR") {
            print("ACCESS DENIED");
            print("CLEARANCE INSUFFICIENT\n");
            return;
        }

        print(`\n[ OPENING FILE: ${file.toUpperCase()} ]`);
        print("STATUS: DECLASSIFIED (PARTIAL)");
        print(">> CONTENT STREAM AVAILABLE\n");
        return;
    }

    /* ---- fallback ---- */
    print("UNKNOWN COMMAND");
}
