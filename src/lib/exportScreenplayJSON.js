import fs from 'fs';
import path from 'path';
import { config } from './loadConfig.js';

/**
 * Exports a JSON of a screenplay
 * @param {Screenplay} screenplay 
 * @param {string} locale 
 */
function exportJSON(screenplay, locale = "de") {

    // Save summary PDF
    const sanitizedTitle = config[locale].title;
    const outputDir = './published';
    // JSON 
    try {
        // Convert the JSON object to a string
        const jsonData = JSON.stringify(screenplay, null, 2);
        const summaryJSONFile = path.join(outputDir, `${sanitizedTitle}.json`);

        // Write the JSON string to the file
        fs.writeFileSync(summaryJSONFile, jsonData, 'utf-8');

        console.log(`JSON: saved "${summaryJSONFile}"`);
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

export default exportJSON;