import { configIsValid } from "../../lib/src/utils/configIsValid";

export function isValidScreenplayFile(file: File): boolean {
  return file.name === "screenplay.txt" && file.type === "text/plain";
}

export function isValidConfigFile(file: File, content: string): boolean {
  if (file.name === "config.json" && file.type === "application/json") {
    const data = JSON.parse(content);
    return configIsValid(data);
  }
  return false;
}
