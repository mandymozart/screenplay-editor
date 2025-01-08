/* Deprecated */
import exportHTML from "../lib/exportHTML.js";
import fullParse from "../lib/fullParse.js";

const screenplayFull = fullParse("de");
exportHTML(screenplayFull, "de");
export default exportHTML;
