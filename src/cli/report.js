import exportHTML from "../lib/exportHTML.js";
import exportJSON from "../lib/exportJSON.js";
import fullParse from "../lib/fullParse.js";
import parse from "../lib/parse.js";
import renderReport from "../lib/renderReport.js";

function report(locale = 'de') {
    const screenplay = parse(locale)
    const screenplayFull = fullParse(locale)
    exportJSON(screenplayFull, locale)
    renderReport(screenplay,locale)

}
report("en");
report("de");
// const screenplayFull = fullParse('de')
// exportHTML(screenplayFull,'de')
export default report;