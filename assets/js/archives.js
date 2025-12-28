let clearance = "VISITOR";
let loggedIn = false;


const output = document.getElementById("output");
const input = document.getElementById("command");

let cwd = "/archives";

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

print("> ARCHIVES NODE INITIALIZED");
print("> TYPE `ls` TO LIST FILES\n");

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const cmd = input.value.trim();
  print(`> ${cmd}`);
  handleCommand(cmd);
  input.value = "";
});

function handleCommand(cmd) {

    if (cmd === "login") {
        if (loggedIn) {
            return print("SESSION ALREADY ACTIVE");
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


    if (cmd === "ls") {
        const dir = fs[cwd];
        if (!dir) return print("ACCESS ERROR");

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


  if (cmd.startsWith("cd ")) {
    const target = cmd.split(" ")[1];
    if (target === "..") {
      cwd = "/archives";
      return print("MOVED TO /archives");
    }

    const next = `${cwd}/${target}`;
    if (fs[next]) {
      cwd = next;
      return print(`MOVED TO ${cwd}`);
    } else {
      return print("NO SUCH DIRECTORY");
    }
  }

  if (cmd.startsWith("open ")) {
      const file = cmd.split(" ")[1];
      const item = fs[cwd]?.[file];

      if (!item || item.type !== "file") {
          return print("FILE NOT FOUND");
      }

      if (clearance === "VISITOR" && item.clearance !== "VISITOR") {
          print("ACCESS DENIED");
          print("CLEARANCE INSUFFICIENT\n");
          return;
      }

      print(`\n[ OPENING FILE: ${file.toUpperCase()} ]`);
      print("STATUS: DECLASSIFIED (PARTIAL)\n");
      print(">> CONTENT STREAM AVAILABLE\n");
      return;
  }

