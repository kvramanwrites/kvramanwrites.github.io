const output = document.getElementById("output");
const input = document.getElementById("command");

let cwd = "/archives";

const fs = {
  "/archives": {
    "whisper_protocol": "file",
    "dossiers": "dir",
    "logs": "dir"
  },
  "/archives/dossiers": {
    "agents": "dir",
    "symbols": "dir"
  },
  "/archives/logs": {
    "build_log_01": "file"
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
  if (cmd === "ls") {
    const dir = fs[cwd];
    if (!dir) return print("ACCESS ERROR");

    Object.keys(dir).forEach(name => {
      if (dir[name] === "dir") {
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
    if (fs[cwd]?.[file] === "file") {
      print(`\n[ OPENING FILE: ${file.toUpperCase()} ]`);
      print("STATUS: PARTIALLY DECLASSIFIED\n");
      print(">> CONTENT STREAM LOCKED\n");
      return;
    }
    return print("FILE NOT FOUND");
  }

  print("UNKNOWN COMMAND");
}
