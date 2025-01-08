import fs from 'fs';
import { jsPDF } from 'jspdf';
import path from 'path';
import { underlinedText } from '../plugins/underlinedText.js';
import { styledText } from '../plugins/styledText.js';
import { config } from './loadConfig.js';
import { t } from '../i18next.js';
import { layout } from './loadLayout.js';

jsPDF.API.underlinedText = underlinedText;
jsPDF.API.styledText = styledText;

const formattedNumber = (number, width) => number.toString().padStart(width, ' ');

/**
 * Renders a PDF Report of a screenplay
 * @param {Screenplay} screenplay 
 */
function renderReport(screenplay,locale = "de",listDialogues = false ) {

    // Initialize jsPDF
    const doc = new jsPDF();
    doc.setFont("Courier");
    doc.setFontSize(12);

    // Create summary PDF
    doc.text(`${t("screenplay")} Report`, layout.marginLeft, layout.marginTop);
    doc.text(`${config[locale].title} (${config[locale].type})`, layout.marginLeft, layout.marginLeft + layout.lineHeight);
    doc.text(`${t("writtenBy")} ${config[locale].author || 'Unbekannt'}`, layout.marginLeft, layout.marginLeft + 2 * layout.lineHeight);
    doc.text(`${config[locale].date || ''}`, layout.marginLeft, layout.marginLeft + 3 * layout.lineHeight);

    // Story Section
    if (screenplay.story.length > 0) {
        doc.text(t("story"), layout.marginLeft, layout.marginLeft + 6 * layout.lineHeight);
        let yPosition = layout.marginLeft + 8 * layout.lineHeight;
    
        // Introduce a global scene counter
        let sceneCounter = 1;
    
        screenplay.story.forEach(({ id, type, item }) => {
            if (type === 'chapter') {
                doc.text(`${item.title || ''} ${item.subtitle || ''} (${item.number}. ${t("chapter_one")})`, layout.marginLeft, yPosition);
                yPosition += layout.lineHeight;
    
                item.scenes.forEach((scene) => {
                    doc.text(`${formattedNumber(sceneCounter,3)}  ${scene}`, layout.marginLeft, yPosition);
                    yPosition += layout.lineHeight;
                    sceneCounter++; // Increment global scene counter
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                });
                yPosition += layout.lineHeight;
            } else if (type === 'song') {
                doc.text(`${item.title || ''} (${item.number}. ${t("song_one")})`, layout.marginLeft, yPosition);
                yPosition += 2*layout.lineHeight;
            }
    
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });
    }

    // Dialogues by Character Section
    if (Object.keys(screenplay.characters).length > 0) {
        doc.addPage();
        doc.text(t("character_other"), layout.marginLeft, layout.marginTop);
        let yPosition = layout.marginTop + 2*layout.lineHeight;

        Object.entries(screenplay.characters).forEach(([character, dialogues]) => {
            let isLyrics = false;
            if(character === ''){
                isLyrics = true;
                doc.styledText(t("lyrics"), layout.marginLeft, yPosition, 'bold');
            } else {
                doc.styledText(`${character}`, layout.marginLeft, yPosition, 'bold');
            }
            yPosition += layout.lineHeight;
            let dialogueCounter = 0;
            let lineCounter = 0;
            dialogues.forEach(({ id, options, parenthetical, text }) => {
                dialogueCounter++;
                if(listDialogues){
                    doc.text(`  ${t("dialogue_one")} ${id} ${options ? `(${options})` : ''}`, layout.marginLeft + 10, yPosition);
                    yPosition += layout.lineHeight;
                }
                if (parenthetical) {
                    if(listDialogues){
                        doc.text(`    (${parenthetical})`, layout.marginLeft + 20, yPosition);
                        yPosition += layout.lineHeight;
                    }
                }
                text.forEach((line) => {
                    lineCounter++;
                    if(listDialogues){
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
                yPosition = layout.marginTop;;
            }
            doc.text(`${dialogueCounter} ${t(isLyrics ? "verse" : "dialogue", {count: dialogueCounter})} & ${lineCounter} ${t("line",{count: lineCounter})}`, layout.marginLeft, yPosition);
            yPosition += 2*layout.lineHeight;
        });
    }

    // Save summary PDF
    const sanitizedTitle = config[locale].title;
    const outputDir = './published';
    const summaryFile = path.join(outputDir, `${sanitizedTitle} - Report.pdf`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    doc.save(summaryFile);
    console.log(`PDF: saved "${summaryFile}".`);
}

export default renderReport;

