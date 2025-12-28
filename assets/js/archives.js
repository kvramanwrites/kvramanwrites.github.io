console.log("ARCHIVES JS VERSION: STABLE BASE");

const output = document.getElementById("output");
const input = document.getElementById("command");

if (!output || !input) {
    throw new Error("Missing terminal elements");
}

let cwd = "/archives";
let clearance = "VISITOR";

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

function print(line = "") {
    output.textContent += line + "\n";
    output.scrollTop = output.scrollHeight;
}

/* INIT */
print("> ARCHIVES NODE INITIALIZED");
print("> CLEARANCE: VISITOR");
print("> TYPE ls | cd | open | login\n");

/* INPUT */
input.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const cmd = input.value.trim();
    print("> " + cmd);
    run(cmd);
    input.value = "";
});

/* COMMAND ROUTER */
function run(cmd) {

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
        }, 700);
        return;
    }

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

    print("UNKNOWN COMMAND");
}
