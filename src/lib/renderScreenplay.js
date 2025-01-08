import fs from "fs";
import { jsPDF } from "jspdf";
import path from "path";
import { underlinedText } from "./../plugins/underlinedText.js";
import { styledText } from "./../plugins/styledText.js";
import { configIsValid } from "./configIsValid.js";

// Plugins
jsPDF.API.underlinedText = underlinedText;
jsPDF.API.styledText = styledText;

// Read the script file
async function renderScreenplay(options) {
  const { screenplayPath, destinationFolderPath, config } = options;
  if (!configIsValid(config)) {
    console.error("Error: Invalid configuration. Aborting.");
    process.exit(1);
  }
  const { meta, layout, i18n } = config;

  if (!fs.existsSync(screenplayPath)) {
    console.error(`Error: File "${screenplayPath}" not found.`);
    process.exit(1);
  }

  const script = fs.readFileSync(screenplayPath, "utf-8");

  // Initialize jsPDF
  const doc = new jsPDF();
  doc.setFont("Courier");
  doc.setFontSize(12);

  const lines = script.split("\n");

  const lineHeight = layout.lineHeight || 4.8; // Line height in units
  const linesPerPage = layout.linePerPage || 55; // Maximum lines per page
  const marginLeft = layout.marginLeft || 35; // Add some margin from the edge
  const marginRight = layout.marginRight || 10; // Add some margin from the edge
  const marginTop = layout.marginTop || 22;
  const pageNumberMarginTop = layout.pageNumberMarginTop || 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleYOffset = 80 + marginTop;

  const xOffset = pageWidth - marginLeft;
  const centerX = pageWidth / 2; // Calculate the center of the page
  let currentLine = 1; // Counter for the current line
  let currentPage = 0; // Page number
  let currentYPosition = marginTop; // Starting position for text

  // Meta
  const title = meta.title || i18n.common.untitled;
  // Add cover page
  doc.underlinedText(title, centerX, titleYOffset, { align: "center" });
  doc.text(`${meta.type}`, centerX, titleYOffset + 2 * lineHeight, {
    align: "center",
  });
  if (meta.author) {
    doc.text(i18n.common.writtenBy, centerX, titleYOffset + 5 * lineHeight, {
      align: "center",
    });
    doc.text(`${meta.author}`, centerX, titleYOffset + 7 * lineHeight, {
      align: "center",
    });
  }
  if (meta.status) {
    doc.text(`${meta.status}`, centerX, titleYOffset + 11 * lineHeight, {
      align: "center",
    });
  }
  if (meta.date) {
    doc.text(`${meta.date}`, centerX, titleYOffset + 12 * lineHeight, {
      align: "center",
    });
  }
  if (meta.basedOn) {
    doc.text(`${meta.basedOn}`, centerX, titleYOffset + 15 * lineHeight, {
      align: "center",
    });
  }
  if (meta.basedOnFrom) {
    doc.text(`${meta.basedOnFrom}`, centerX, titleYOffset + 16 * lineHeight, {
      align: "center",
    });
  }

  doc.addPage();

  function addPageNumber() {
    currentPage++;
    doc.text(
      `${title}   ${currentPage}.`,
      pageWidth - marginRight,
      pageNumberMarginTop,
      { align: "right" }
    );
  }

  addPageNumber();

  // Parse styled text from the line
  function parseAndRenderStyledText(doc, text, x, y) {
    const stylePatterns = [
      { regex: /\*\*\*(.+?)\*\*\*/, style: "bolditalic" }, // ***bolditalic***
      { regex: /\*\*(.+?)\*\*/, style: "italic" }, // **italic**
      { regex: /\*(.+?)\*/, style: "bold" }, // *bold*
      { regex: /_(.+?)_/, style: "underline" }, // _underlined_
    ];

    let currentX = x;

    while (text.length > 0) {
      const matches = stylePatterns
        .map(({ regex, style }) => {
          const match = regex.exec(text);
          return match ? { match, style, index: match.index } : null;
        })
        .filter(Boolean);

      if (matches.length > 0) {
        // Find the earliest match
        const { match, style } = matches.reduce((earliest, current) =>
          current.index < earliest.index ? current : earliest
        );

        // Render plain text before the match
        const plainText = text.slice(0, match.index);
        if (plainText) {
          currentX = renderPlainText(doc, plainText, currentX, y);
        }

        // Render the matched styled text
        const styledText = match[1]; // Captured group
        currentX = renderStyledText(doc, styledText, currentX, y, style);

        // Remove the processed part from the text
        text = text.slice(match.index + match[0].length);
      } else {
        // Render remaining text as plain text
        currentX = renderPlainText(doc, text, currentX, y);
        break;
      }
    }
  }

  function renderPlainText(doc, text, x, y) {
    doc.text(text, x, y);
    return x + doc.getTextWidth(text);
  }

  function renderStyledText(doc, text, x, y, style) {
    const textWidth = doc.getTextWidth(text);

    if (style === "underline") {
      const underlineThickness = 0.5;
      const underlineOffset = 1; // Adjust for font size and alignment

      // Render the text
      doc.text(text, x, y);

      // Draw the underline
      doc.setLineWidth(underlineThickness);
      doc.line(
        x,
        y + underlineOffset, // Position the underline below the text
        x + textWidth,
        y + underlineOffset
      );
    } else {
      // Use styledText for bold, italic, or bolditalic
      doc.styledText(text, x, y, style);
    }

    return x + textWidth;
  }

  // Loop through each line
  lines.forEach((line) => {
    // Check for page break trigger
    if (/^---+$/g.test(line)) {
      // Add a new page
      doc.addPage();
      addPageNumber();
      currentYPosition = marginTop; // Reset y position for new page
      currentLine = 1; // Reset line counter
      return;
    }

    // If the current line exceeds the lines per page, add a new page
    if (currentLine > linesPerPage) {
      doc.addPage();
      addPageNumber();
      currentYPosition = marginTop; // Reset y position for new page
      currentLine = 1; // Reset line counter
    }

    if (line.trimStart().startsWith("#")) {
      // Remove the '#' for display and underline the line
      const actLine = line.trimStart().substring(1).trim(); // Trim removes extra spaces
      doc.underlinedText(actLine, centerX, currentYPosition, {
        align: "center",
      });
    } else {
      // Render the line with parsed styles
      parseAndRenderStyledText(
        doc,
        line,
        marginLeft,
        currentYPosition,
        lineHeight,
        marginLeft
      );
    }

    currentYPosition += lineHeight; // Move to the next line position
    currentLine++; // Increment the line counter
  });

  // Generate output file name based on the title in meta
  const inputDir = path.dirname(screenplayPath);
  const sanitizedTitle = meta.title || "Untitled";

  // Compute the output directory by combining the inputDir and destinationFolderPath
  const outputDir = destinationFolderPath
    ? path.resolve(inputDir, destinationFolderPath)
    : inputDir;

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate the output file path
  const outputFile = path.join(outputDir, `${sanitizedTitle}.pdf`);

  // Save the document
  doc.save(outputFile);
  console.log(`PDF saved at "${outputFile}".`);
}

export default renderScreenplay;
