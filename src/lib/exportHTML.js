import fs from 'fs';
import { config } from './loadConfig.js';
import path from 'path';
import { htmlFooter, htmlHeader } from './template.js';
import { i18next, t } from '../i18next.js';

const MAX_PAGE_LINES = 55;

/**
 * Render Screenplay to HTML
 * @param {Screenplay} screenplay 
 * @param {string} locale 
 * @returns {string} HTML content
 */
function renderHTML(screenplay, locale = 'de') {
  i18next.changeLanguage(locale);

  let lineCount = 1; // Initialize line count
  let pageCount = 1;
  const renderedOutput = [];
  function addLine(content) {
    if (lineCount >= MAX_PAGE_LINES) {
      pageCount++;
      lineCount = 1; // Reset line count
    }
    renderedOutput.push(content);
    lineCount++; // Increment line count for each line added
  }

  // Add chapters and scenes
  screenplay.story.forEach((beat) => {
    if (beat.type === "chapter") {
      renderedOutput.push(`<pre class="beat beat--chapter">`); // Add chapter wrapper
      renderedOutput.push(`<span class="chapter">`);
      addLine(`<span class="chapter chapter--number">\t# ${beat.item.number}. ${t("chapter_one")}</span>`);
      addLine(`<span class="chapter chapter--title">\t# ${beat.item.title}</span>`);
      if (beat.item.subtitle) {
        addLine(`<span class="chapter chapter--subtitle">\t# ${beat.item.subtitle}</span>`);
      }
      addLine(`</span>`);

      // Render scenes
      beat.item.scenes.forEach((scene) => {
        addLine(`<span class="event event--scene">${scene.number}\t${scene.title}</span>\n`);

        // Render events within a scene
        scene.events.forEach((event) => {
          if (event.type === "Action") {
            addLine(`<span class="event event--action">\t${event.text}</span>\n`);
          } else if (event.type === "Dialogue") {
            const parenthetical = event.parenthetical
              ? `<span class="event event--parenthetical">\n\t\t\t\t\t\t(${event.parenthetical})</span>`
              : "";
            const textBlock = event.text.map((line) => `\t\t\t\t${line}`).join("\n");
            addLine(`<span class="event event--character">\t\t\t\t\t\t\t${event.character}</span> ${parenthetical}`);
            textBlock.split("\n").forEach((line) => addLine(line)); // Handle multi-line dialogue
          }
        });
      });

      renderedOutput.push(`</pre>\n`); // Close chapter wrapper
      // Reset page count for the next section
      pageCount++;
      lineCount = 1;
    } else if (beat.type === "song") {
      renderedOutput.push(`<pre class="beat beat--song">`); // Add song wrapper
      renderedOutput.push(`<span class="song song--header">`);
      addLine(`<span class="song song--number">\t# ${beat.item.number}. ${t("song_one")}</span>`);
      addLine(`<span class="song song--title">\t# ${beat.item.title}</span>`);
      renderedOutput.push(`</span>`);

      // Add lyrics within the same wrapper
      const lyricsLines = beat.item.lyrics.split("\n");
      lyricsLines.forEach((line) => addLine(`<span class="song song--lyrics-line">${line}</span>`));

      renderedOutput.push(`</pre>\n`); // Close song wrapper
      // Reset page count for the next section
      pageCount++;
      lineCount = 1;
    }
  });

  renderedOutput.push(
    `<pre class="status">${pageCount} pages total <span>Page breaks not visible</span></pre>`
  );
  return renderedOutput.join("\n");
}

/**
 * Exports the screenplay to an HTML file.
 * @param {Screenplay} screenplay - The screenplay data.
 * @param {string} locale - The locale for the output.
 */
function exportHTML(screenplay, locale) {
  const renderedContent = renderHTML(screenplay, locale);
  const fullHtml = htmlHeader + renderedContent + htmlFooter;
  const sanitizedTitle = config[locale].title;
  const outputDir = './published';
  const outputFile = path.join(outputDir, `${sanitizedTitle}.html`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFile(outputFile, fullHtml, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`HTML: saved "${outputFile}".`);
    }
  });
}

export default exportHTML;
