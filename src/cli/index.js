import renderScreenplay from "../lib/renderScreenplay.js";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";

// Default demo screenplay content
const demoScreenplayContent = `\
    # 1. Chapter 

    # Day one

1   SCENE 1
    
    Descriptive action is going here.

                            CHARACTER
                        (thinks loudly)
                Dialogs are my destiny.

                            NARRATOR (O.S.)
                I love monolog.
            
                            CHARACTER
                Really?

    Takes a sip of water.

                            CHARACTER (cont'd)
                        (clear voice)
                What about now?

2   OUTSIDE - DAY

    ...

---

    # 2. Chapter

    # REMATCH

3   STREET - NIGHT

    ...

    END
`;

// Default layout configuration
const defaultLayout = {
  lineHeight: 4.8,
  linePerPage: 55,
  marginRight: 10,
  marginLeft: 35,
  marginTop: 22,
  pageNumberMarginTop: 10,
};

// Resolve script root for relative paths
const scriptRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname)
);

const defaultExampleFolderPath = path.resolve(scriptRoot, "./../../example");

// Function to load the localization file
function loadLocalization(language) {
  const localizationPath = path.resolve(
    scriptRoot,
    `./locales/${language}/common.json`
  );
  if (fs.existsSync(localizationPath)) {
    return JSON.parse(fs.readFileSync(localizationPath, "utf-8"));
  } else {
    console.error(
      `Error: Localization file for "${language}" not found at ${localizationPath}.`
    );
    return {};
  }
}

// Function to initialize a new project
async function initializeProject(targetFolder) {
  try {
    // Ensure the target folder exists
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
      console.log(`Created folder: ${targetFolder}`);
    }

    // Create screenplay.txt if it doesn't exist
    const screenplayPath = path.join(targetFolder, "screenplay.txt");
    if (!fs.existsSync(screenplayPath)) {
      fs.writeFileSync(screenplayPath, demoScreenplayContent);
      console.log(`Created demo screenplay file at ${screenplayPath}`);
    }

    // Prompt user for config values
    const availableLanguages = fs
      .readdirSync(path.resolve(scriptRoot, "./locales"))
      .filter((folder) =>
        fs.existsSync(path.join(scriptRoot, "locales", folder, "common.json"))
      );

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the screenplay:",
        default: "Untitled",
      },
      {
        type: "input",
        name: "author",
        message: "Enter the author's name:",
        default: "Unknown",
      },
      {
        type: "list",
        name: "language",
        message: "Choose a language for localization:",
        choices: availableLanguages,
        default: "en",
      },
    ]);

    // Load the localization file
    const i18nCommon = loadLocalization(answers.language);

    // Build the config object
    const config = {
      meta: {
        title: answers.title,
        author: answers.author,
        status: "Draft",
        date: new Date().toLocaleDateString(),
        basedOn: "",
        basedOnFrom: "",
        type: "Script",
      },
      layout: defaultLayout,
      i18n: {
        common: i18nCommon,
      },
    };

    // Write config.json
    const configPath = path.join(targetFolder, "config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Created config file at ${configPath}`);

    console.log("Project initialization complete.");
  } catch (err) {
    console.error(
      "An error occurred during project initialization:",
      err.message
    );
  }
}

// Main CLI function
async function main() {
  try {
    // Prompt the user for input and destination folder paths
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "inputFolderPath",
        message:
          "Enter the path to the folder containing screenplay and config files (leave empty to use default):",
        default: process.cwd(),
      },
      {
        type: "input",
        name: "destinationFolderPath",
        message:
          "Enter the path to the folder where the output should be published:",
        default: "published/",
      },
    ]);

    const inputFolderPath = answers.inputFolderPath || defaultExampleFolderPath;

    // Determine the destination folder
    const usingDefaultExample = inputFolderPath === defaultExampleFolderPath;
    const destinationFolderPath = usingDefaultExample
      ? path.resolve(process.cwd(), "published") // Set to the current working directory plus '/published' if using example data
      : path.resolve(process.cwd(), answers.destinationFolderPath); // Relative to process.cwd()

    // Check if the input folder exists and contains required files
    const screenplayPath = path.join(inputFolderPath, "screenplay.txt");
    const configPath = path.join(inputFolderPath, "config.json");

    if (
      !fs.existsSync(inputFolderPath) ||
      !fs.existsSync(screenplayPath) ||
      !fs.existsSync(configPath) ||
      fs.readdirSync(inputFolderPath).length === 0
    ) {
      console.log(
        `The folder "${inputFolderPath}" does not exist or is missing required files. Initializing a new project...`
      );
      await initializeProject(inputFolderPath);
    } else {
      console.log("Existing project found. Proceeding with rendering...");

      // Read and parse the config file
      const configContent = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent);

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
    }
  } catch (err) {
    console.error("An unexpected error occurred:", err.message);
  }
}

// Run the CLI
main();
