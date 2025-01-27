import fs from "fs";
import path from "path";

function loadConfig() {
  const configPath = path.join(`./`, `config.json`);
  if (!fs.existsSync(configPath)) {
    console.error(`Error: config.json not found.`, configPath);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config;
}

export default loadConfig;
