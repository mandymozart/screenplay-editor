import renderScreenplay from "../lib/renderScreenplay.js";

import fs from "fs";
import path from "path";
import inquirer from "inquirer";

// Main CLI function
async function main() {
  try {
    // Use inquirer to prompt the user for the folder path and publish path
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "inputFolderPath",
        message:
          "Enter the path to the folder containing screenplay and config files:",
        default: "example/",
        validate: (input) => {
          if (fs.existsSync(input)) {
            return true;
          }
          return "The specified folder does not exist. Please enter a valid path.";
        },
      },
      {
        type: "input",
        name: "destinationFolderPath",
        message:
          "Enter the path to the folder where the output should be published:",
        default: "published/",
      },
    ]);

    const inputFolderPath = answers.inputFolderPath;
    const destinationFolderPath = answers.destinationFolderPath;

    // Resolve paths for the required files
    const screenplayPath = path.join(inputFolderPath, "screenplay.txt");
    const configPath = path.join(inputFolderPath, "config.json");

    // Check if both files exist
    if (!fs.existsSync(screenplayPath)) {
      console.error(`Error: "screenplay.txt" not found in ${inputFolderPath}`);
      return;
    }

    if (!fs.existsSync(configPath)) {
      console.error(`Error: "config.json" not found in ${inputFolderPath}`);
      return;
    }

    // Read and parse the config file
    const configContent = fs.readFileSync(configPath, "utf-8");
    let config;
    try {
      config = JSON.parse(configContent);
    } catch (err) {
      console.error(
        "Error: Failed to parse config.json. Ensure it contains valid JSON."
      );
      return;
    }

    // Set options object
    const options = {
      screenplayPath,
      destinationFolderPath,
      config,
    };

    // Execute renderScreenplay
    console.log("Rendering screenplay...");
    await renderScreenplay(options);
    console.log("Screenplay rendered successfully.");
  } catch (err) {
    console.error("An unexpected error occurred:", err.message);
  }
}

// Mock renderScreenplay function (replace this with your actual implementation)
// async function renderScreenplay(options) {
//   console.log(`Mock rendering screenplay with options:`, options);
// }

// Run the CLI
main();
