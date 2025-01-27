import { jsPDF } from "jspdf";
import { underlinedText } from "./plugins/underlinedText.js";
import { styledText } from "./plugins/styledText.js";
import { configIsValid } from "./utils/configIsValid.js";
import addReportPages from "./report.js";
import { parseAndRenderStyledText } from "./utils/renderHelpers.js";

// Plugins
jsPDF.API.underlinedText = underlinedText;
jsPDF.API.styledText = styledText;

/**
 * Render screenplay from object
 * @param {Object} options
 * @returns JSPdf Document
 */
function renderFromScreenplay({ screenplay, config }) {
  if (!configIsValid(config)) {
    console.error("Error: Invalid configuration. Aborting.");
    // process.exit(1);
  }
  const { meta, layout, i18n } = config;

  // Initialize jsPDF
  const doc = new jsPDF();
  doc.setFont("Courier");
  doc.setFontSize(12);

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

  function renderEvent(event, doc, x, y) {
    if (event.type === "Action") {
      parseAndRenderStyledText(doc, event.text, x, y);
    } else if (event.type === "Dialogue") {
      if (event.character) {
        doc.text(event.character, x, y);
        y += lineHeight;
      }
      if (event.parenthetical) {
        doc.text(`(${event.parenthetical})`, x + 10, y);
        y += lineHeight;
      }
      event.text.forEach((line) => {
        parseAndRenderStyledText(doc, line, x + 20, y);
        y += lineHeight;
      });
    }
    return y;
  }

  // Loop through each chapter
  screenplay.story.forEach((chapter) => {
    doc.underlinedText(
      `Kapitel ${chapter.item.number}: ${chapter.item.title}`,
      centerX,
      currentYPosition,
      { align: "center" }
    );
    currentYPosition += 2 * lineHeight;

    chapter.item.scenes.forEach((scene) => {
      doc.underlinedText(
        `Szene ${scene.number}: ${scene.title}`,
        centerX,
        currentYPosition,
        { align: "center" }
      );
      currentYPosition += 2 * lineHeight;

      scene.events.forEach((event) => {
        if (currentLine > linesPerPage) {
          doc.addPage();
          addPageNumber();
          currentYPosition = marginTop; // Reset y position for new page
          currentLine = 1; // Reset line counter
        }
        currentYPosition = renderEvent(
          event,
          doc,
          marginLeft,
          currentYPosition
        );
        currentYPosition += lineHeight;
        currentLine++;
      });
    });
  });

  // TODO: Add Report pages to doc if config.report.enabled === true
  // addReportPages(doc, screenplay, config)
  if (config.report?.enabled) {
    doc = addReportPages(screenplay, doc, config);
  }

  return doc;
}

export { renderFromScreenplay };
