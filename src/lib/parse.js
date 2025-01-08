import fs from 'fs';
import { config } from './loadConfig.js';
import { i18next, t } from '../i18next.js';

/**
 * Parse a screenplay txt file to a Screenplay
 * TODO Missing Actions, Transitions, Page Breaks (they might be useful 
 * for a meta layout tool)
 * @returns {Screenplay} 
 */
function parse(locale = 'de') {

    i18next.changeLanguage(locale)
    // Read the script file
    const inputFile = config[locale].file || "./screenplay.txt";
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File "${inputFile}" not found.`);
        process.exit(1);
    }

    const script = fs.readFileSync(inputFile, 'utf-8');

    function createRegex(type) {
        const term = t(type+='_one'); // Get the translated term for the given type
        return new RegExp(`^#\\s*(\\d+)\\.\\s*${term}$`);
    }

    // Regex Patterns
    const chapterRegex = createRegex("chapter"); // Matches translated "chapter" term
    const songRegex = createRegex("song");       // Matches translated "song" term
    const titleRegex = /^#\s+(.+)$/;
    const sceneRegex = /^\d{1,3}\s+(.+)$/;
    // const characterRegex = /^[ \t]{25,30}([a-zA-Z0-9: ]+)(?:\s*\((.+)\))?$/;
    const characterRegex = /^(?! {48}[A-Z0-9\s\p{P}]+$)[ \t]{25,30}([\p{L}0-9: ]+)(?:\s*\((.+)\))?$/u;

    const parentheticalRegex = /^\s*\((.+)\)\s*$/;
    const dialogueTextRegex = /^\s{16,}(.+)$/; // Indented dialogue text

    const screenplay = {
        story: [],
        characters: {},
        dialogues: [],
    };

    let currentItem = null;
    let currentDialogue = null;
    let dialogueId = 1;

    // Parse script line by line
    script.split('\n').forEach((line, index, lines) => {
        // Detect chapters
        const chapterMatch = chapterRegex.exec(line.trim());
        if (chapterMatch) {
            if (currentItem) {
                screenplay.story.push({
                    id: screenplay.story.length + 1,
                    type: 'chapter',
                    item: currentItem,
                });
            }
            currentItem = {
                number: chapterMatch[1],
                title: null,
                subtitle: null,
                scenes: [],
            };

            const titleLine = lines[index + 2]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                currentItem.title = titleRegex.exec(titleLine)[1].trim();
            }

            const subtitleLine = lines[index + 3]?.trim();
            if (subtitleLine && titleRegex.test(subtitleLine)) {
                currentItem.subtitle = titleRegex.exec(subtitleLine)[1].trim();
            }
            return;
        }

        // Detect songs
        const songMatch = songRegex.exec(line.trim());
        if (songMatch) {
            if (currentItem) {
                screenplay.story.push({
                    id: screenplay.story.length + 1,
                    type: 'chapter',
                    item: currentItem,
                });
                currentItem = null;
            }
            const song = {
                number: songMatch[1],
                title: null,
            };

            const titleLine = lines[index + 2]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                song.title = titleRegex.exec(titleLine)[1].trim();
            }

            screenplay.story.push({
                id: screenplay.story.length + 1,
                type: 'song',
                item: song,
            });
            return;
        }

        // Detect scenes
        const sceneMatch = sceneRegex.exec(line);
        if (sceneMatch) {
            if (currentItem) {
                currentItem.scenes.push(sceneMatch[1].trim());
            }
            return;
        }

        // Detect characters and dialogues
        const characterMatch = characterRegex.exec(line);
        if (characterMatch) {
            if (currentDialogue) {
                screenplay.dialogues.push(currentDialogue);
            }

            const characterName = characterMatch[1].trimEnd();
            const options = characterMatch[2] || '';
            if (!screenplay.characters[characterName]) {
                screenplay.characters[characterName] = [];
            }

            currentDialogue = {
                id: dialogueId++,
                character: characterName,
                options,
                parenthetical: '',
                text: [],
            };
            screenplay.characters[characterName].push(currentDialogue); // Associate dialogue with character
            return;
        }

        // Detect parenthetical
        const parentheticalMatch = parentheticalRegex.exec(line.trim());
        if (parentheticalMatch && currentDialogue) {
            currentDialogue.parenthetical = parentheticalMatch[1];
            return;
        }

        // Detect dialogue text
        const dialogueTextMatch = dialogueTextRegex.exec(line);
        if (dialogueTextMatch && currentDialogue) {
            currentDialogue.text.push(dialogueTextMatch[1].trim());
            return;
        }

        // End of dialogue block
        if (!line.trim() && currentDialogue) {
            screenplay.dialogues.push(currentDialogue);
            currentDialogue = null;
        }
    });

    if (currentDialogue) {
        screenplay.dialogues.push(currentDialogue);
    }

    if (currentItem) {
        screenplay.story.push({
            id: screenplay.story.length + 1,
            type: 'chapter',
            item: currentItem,
        });
    }
    return screenplay
}

export default parse;
