function createRegex(term) {
    return new RegExp(`^\\s*#\\s*(\\d+)\\.\\s*${term}$`);
}
// function createRegex(type,t) {
//     const term = t(type + '_one'); // Get the translated term for the given type
//     return new RegExp(`^#\\s*(\\d+)\\.\\s*${term}$`);
// }

// Regex Patterns
const chapterRegex = createRegex("Kapitel"); // Matches translated "chapter" term
const songRegex = createRegex("Lied");       // Matches translated "song" term
const titleRegex = /^#\s+(.+)$/;
const sceneRegex = /^\d+\s+(.+)$/;           // Matches "1 INT./EXT. ..."
const actionRegex = /^(?:\t| {4})(?!#|\()(?!\s*$)(.+)$/;
const pageBreakRegex = /^---+/;              // Matches page breaks
const characterRegex = /^(?! {48}[A-Z0-9\s\p{P}]+$)[ \t]{25,30}([\p{L}0-9: ]+)(?:\s*\((.+)\))?$/u;
const parentheticalRegex = /^\s*\((.+)\)\s*$/;
const dialogueTextRegex = /^\s{16,}(.+)$/; // Indented dialogue text


export { 
    createRegex, 
    chapterRegex, 
    songRegex, 
    titleRegex, 
    sceneRegex, 
    actionRegex, 
    pageBreakRegex,
    characterRegex,
    parentheticalRegex,
    dialogueTextRegex
};