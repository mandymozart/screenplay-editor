import { jsPDF } from "jspdf";
import { underlinedText } from "./plugins/underlinedText.js";
import { styledText } from "./plugins/styledText.js";
import { configIsValid } from "./utils/configIsValid.js";
import { parseAndRenderStyledText } from "./utils/renderHelpers.js";
import addReportPages from "./report.js";

// Plugins
jsPDF.API.underlinedText = underlinedText;
jsPDF.API.styledText = styledText;

// Read the script file
/**
 *
 * @param {RenderOptions} options
 * @returns JSPdf Document
 */
function render({ script, config }) {
  if (!configIsValid(config)) {
    console.error("Error: Invalid configuration. Aborting.");
    // process.exit(1);
  }
  const { meta, layout, i18n } = config;

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

  // TODO: Add Report pages to doc if config.report.enabled === true
  // addReportPages(doc, screenplay, config)
  if (config.report?.enabled) {
    doc = addReportPages(script, doc, config);
  }

  return doc;
}

export { render };
