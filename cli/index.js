import Screenplayyy from "../lib/src/index.js";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import {
  ensureOutputDirectory,
  savePDF,
  saveMarkdown,
  readScreenplayFile,
} from "./io.js";

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
  marginLeft: 25,
  marginTop: 22,
  pageNumberMarginTop: 10,
};

// Resolve script root for relative paths
const scriptRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname)
);

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

// Default example folder path
const defaultExampleFolderPath = path.resolve(scriptRoot, "./../../example");

// Function to initialize a new project
async function initializeProject(targetFolder) {
  try {
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
      console.log(`Created folder: ${targetFolder}`);
    }

    const screenplayPath = path.join(targetFolder, "screenplay.txt");
    if (!fs.existsSync(screenplayPath)) {
      fs.writeFileSync(screenplayPath, demoScreenplayContent);
      console.log(`Created demo screenplay file at ${screenplayPath}`);
    }

    // List available languages for localization
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

    // Load the selected localization file
    const i18nCommon = loadLocalization(answers.language);

    // Build the config object with localization and layout
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

    // Write the config to file
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

// Function to render screenplay as Markdown
async function renderScreenplayToMarkdown(
  screenplayPath,
  config,
  outputFolderPath
) {
  try {
    const screenplayContent = fs.readFileSync(screenplayPath, "utf-8");
    const outputDir = ensureOutputDirectory(screenplayPath, outputFolderPath);
    const screenplay = Screenplayyy.parse(screenplayContent);
    const markdownContent = Screenplayyy.renderMarkdownFromScreenplay({
      screenplay,
      config,
    });
    saveMarkdown(markdownContent, outputDir, config.meta.title);
    console.log(`Screenplay rendered as Markdown at ${outputDir}`);
  } catch (err) {
    console.error("Error rendering screenplay to Markdown:", err.message);
  }
}

// Function to render screenplay as PDF
async function renderScreenplayToPDF(screenplayPath, config, outputFolderPath) {
  try {
    const script = readScreenplayFile(screenplayPath);
    const outputDir = ensureOutputDirectory(screenplayPath, outputFolderPath);
    const doc = Screenplayyy.render({ script, config });
    savePDF(doc, outputDir, config.meta.title);
    console.log(`Screenplay rendered as PDF at ${outputDir}`);
  } catch (err) {
    console.error("Error rendering screenplay to PDF:", err.message);
  }
}

// Main CLI function
async function main() {
  try {
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
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["Render to PDF", "Render to Markdown"],
        default: "Render to PDF",
      },
    ]);

    const inputFolderPath = answers.inputFolderPath || defaultExampleFolderPath;
    const destinationFolderPath = path.resolve(
      process.cwd(),
      answers.destinationFolderPath
    );
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

      const configContent = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent);

      if (answers.action === "Render to PDF") {
        await renderScreenplayToPDF(
          screenplayPath,
          config,
          destinationFolderPath
        );
      } else if (answers.action === "Render to Markdown") {
        await renderScreenplayToMarkdown(
          screenplayPath,
          config,
          destinationFolderPath
        );
      }
    }
  } catch (err) {
    console.error("An unexpected error occurred:", err.message);
  }
}

// Run the CLI
main();
