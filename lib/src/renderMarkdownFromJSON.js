import { configIsValid } from "./utils/configIsValid.js";

/**
 * Render screenplay from object to Markdown
 * @param {Object} options
 * @returns {String} Markdown content
 */
function renderMarkdownFromScreenplay({ screenplay, config }) {
  if (!configIsValid(config)) {
    console.error("Error: Invalid configuration. Aborting.");
    return null;
  }

  const { meta, i18n } = config;

  // Start building Markdown content
  let markdown = `# ${meta.title || i18n.common.untitled}\n\n`;
  markdown += `**${i18n.common.writtenBy}**: ${meta.author || "Unknown"}\n`;
  markdown += `**${i18n.common.status}**: ${meta.status || "Draft"}\n`;
  markdown += `**${i18n.common.date}**: ${
    meta.date || new Date().toLocaleDateString()
  }\n\n`;
  markdown += "---\n\n";

  // Loop through chapters
  screenplay.story.forEach((chapter) => {
    markdown += `### ${i18n.common.chapter_one} ${chapter.item.number}: ${chapter.item.title}\n\n`;

    chapter.item.scenes.forEach((scene) => {
      markdown += `#### ${i18n.common.scene_one} ${scene.number}\n ${scene.title}\n\n`;

      scene.events.forEach((event) => {
        if (event.type === "Action") {
          markdown += `${event.text}\n\n`;
        } else if (event.type === "Dialogue") {
          if (event.character) {
            markdown += `**${event.character}**\n`;
          }
          if (event.parenthetical) {
            markdown += `*(${event.parenthetical})*\n`;
          }
          event.text.forEach((line) => {
            markdown += `${line}\n`;
          });
          markdown += `\n`;
        }
      });
    });

    markdown += "---\n\n";
  });

  return markdown;
}

export { renderMarkdownFromScreenplay };
