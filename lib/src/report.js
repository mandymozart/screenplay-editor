import { jsPDF } from "jspdf";
import { underlinedText } from "./plugins/underlinedText.js";
import { styledText } from "./plugins/styledText.js";
import parse from "./parse.js";

jsPDF.API.underlinedText = underlinedText;
jsPDF.API.styledText = styledText;

const formattedNumber = (number, width) =>
  number.toString().padStart(width, " ");

/**
 * Adds report pages to an existing PDF document based on the screenplay data.
 * @param {Screenplay} screenplay - The screenplay object containing story and character information.
 * @param {jsPDF} doc - The jsPDF instance to add pages to.
 * @param {Object} config - Configuration object containing meta, layout, and i18n properties.
 * @returns {jsPDF} - The updated jsPDF document with report pages added.
 */
function addReportPages(script, doc, config) {
  const screenplay = parse(script, config);
  const { meta, layout, i18n, report } = config;

  doc.text(
    `${i18n.common.screenplay} Report`,
    layout.marginLeft,
    layout.marginTop
  );
  doc.text(
    `${meta.title} (${meta.type})`,
    layout.marginLeft,
    layout.marginTop + layout.lineHeight
  );
  doc.text(
    `${i18n.common.writtenBy} ${meta.author || i18n.common.unknownAuthor}`,
    layout.marginLeft,
    layout.marginTop + 2 * layout.lineHeight
  );
  doc.text(
    `${meta.date || ""}`,
    layout.marginLeft,
    layout.marginTop + 3 * layout.lineHeight
  );

  // Story Section
  if (screenplay.story.length > 0) {
    doc.text(
      i18n.common.story,
      layout.marginLeft,
      layout.marginTop + 6 * layout.lineHeight
    );
    let yPosition = layout.marginTop + 8 * layout.lineHeight;

    let sceneCounter = 1;

    screenplay.story.forEach(({ _, type, item }) => {
      if (type === "chapter") {
        doc.text(
          `${item.title || ""} ${item.subtitle || ""} (${item.number}. ${
            i18n.common.chapter_one
          })`,
          layout.marginLeft,
          yPosition
        );
        yPosition += layout.lineHeight;

        item.scenes.forEach((scene) => {
          doc.text(
            `${formattedNumber(sceneCounter, 3)}  ${scene}`,
            layout.marginLeft,
            yPosition
          );
          yPosition += layout.lineHeight;
          sceneCounter++;
          if (yPosition > 270) {
            doc.addPage();
            yPosition = layout.marginTop;
          }
        });
        yPosition += layout.lineHeight;
      } else if (type === "song") {
        doc.text(
          `${item.title || ""} (${item.number}. ${i18n.common.song_one})`,
          layout.marginLeft,
          yPosition
        );
        yPosition += 2 * layout.lineHeight;
      }

      if (yPosition > 270) {
        doc.addPage();
        yPosition = layout.marginTop;
      }
    });
  }

  // Dialogues by Character Section
  if (Object.keys(screenplay.characters).length > 0) {
    doc.addPage();
    doc.text(i18n.common.character_other, layout.marginLeft, layout.marginTop);
    let yPosition = layout.marginTop + 2 * layout.lineHeight;

    Object.entries(screenplay.characters).forEach(([character, dialogues]) => {
      let isLyrics = character === "";
      if (isLyrics) {
        doc.styledText(
          i18n.common.lyrics,
          layout.marginLeft,
          yPosition,
          "bold"
        );
      } else {
        doc.styledText(`${character}`, layout.marginLeft, yPosition, "bold");
      }
      yPosition += layout.lineHeight;
      let dialogueCounter = 0;
      let lineCounter = 0;
      dialogues.forEach(({ id, options, parenthetical, text }) => {
        dialogueCounter++;
        if (report.listDialogues) {
          doc.text(
            `  ${i18n.common.dialogue_one} ${id} ${
              options ? `(${options})` : ""
            }`,
            layout.marginLeft + 10,
            yPosition
          );
          yPosition += layout.lineHeight;
        }
        if (parenthetical && report.listDialogues) {
          doc.text(`    (${parenthetical})`, layout.marginLeft + 20, yPosition);
          yPosition += layout.lineHeight;
        }
        text.forEach((line) => {
          lineCounter++;
          if (report.listDialogues) {
            doc.text(`    ${line}`, layout.marginLeft + 20, yPosition);
            yPosition += layout.lineHeight;
          }
        });
        if (yPosition > 270) {
          doc.addPage();
          yPosition = layout.marginTop;
        }
      });
      if (yPosition > 270) {
        doc.addPage();
        yPosition = layout.marginTop;
      }
      doc.text(
        `${dialogueCounter} ${
          i18n.common[isLyrics ? "verse_other" : "dialogue_other"]
        } & ${lineCounter} ${i18n.common.line_other}`,
        layout.marginLeft,
        yPosition
      );
      yPosition += 2 * layout.lineHeight;
    });
  }

  return doc;
}

export default addReportPages;
