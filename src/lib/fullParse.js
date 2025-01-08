import fs from 'fs';
import { config } from './loadConfig.js';
import { 
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
} from './regex.js';
import { i18next } from '../i18next.js';

/**
 * Parse a screenplay txt file to detect and add chapters, scenes, songs, and dialogue elements to the story.
 * @returns {Screenplay}
 */
function fullParse(locale = 'de') {
    i18next.changeLanguage(locale);

    const inputFile = config[locale].file || "./screenplay.txt";
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File "${inputFile}" not found.`);
        process.exit(1);
    }

    const script = fs.readFileSync(inputFile, 'utf-8');

    const screenplay = {
        story: [],
    };

    let currentChapter = null;
    let currentScene = null;
    let currentSong = null;
    let currentDialogue = null; // Tracks ongoing dialogue blocks
    let currentAction = null;   // Tracks ongoing action blocks
    let isSongLyrics = false;
    let globalSceneCount = 0;

    script.split('\n').forEach((line, index, lines) => {
        line = line.trimEnd();

        const chapterMatch = chapterRegex.exec(line);
        const songMatch = songRegex.exec(line);
        const sceneMatch = sceneRegex.exec(line);
        const actionMatch = actionRegex.exec(line);
        const pageBreakMatch = pageBreakRegex.exec(line);
        const characterMatch = characterRegex.exec(line);
        const dialogueTextMatch = dialogueTextRegex.exec(line);
        const parentheticalMatch = parentheticalRegex.exec(line);

        // Handle song lyrics
        if (isSongLyrics && currentSong) {
            if (chapterMatch || songMatch || pageBreakMatch) {
                screenplay.story.push(currentSong);
                currentSong = null;
                isSongLyrics = false;
            } else {
                currentSong.item.lyrics += line + '\n';
                return;
            }
        }

        // Detect chapters
        if (chapterMatch) {
            if (currentChapter) {
                if (currentScene) {
                    currentChapter.item.scenes.push(currentScene);
                    currentScene = null;
                }
                screenplay.story.push(currentChapter);
            }

            currentChapter = {
                id: screenplay.story.length + 1,
                type: 'chapter',
                item: {
                    number: parseInt(chapterMatch[1], 10),
                    title: null,
                    subtitle: null,
                    scenes: [],
                },
            };

            const titleLine = lines[index + 2]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                currentChapter.item.title = titleRegex.exec(titleLine)[1];
            }

            const subtitleLine = lines[index + 3]?.trim();
            if (subtitleLine && titleRegex.test(subtitleLine)) {
                currentChapter.item.subtitle = titleRegex.exec(subtitleLine)[1];
            }
            return;
        }

        // Detect songs
        if (songMatch) {
            if (currentChapter) {
                if (currentScene) {
                    currentChapter.item.scenes.push(currentScene);
                    currentScene = null;
                }
                screenplay.story.push(currentChapter);
                currentChapter = null;
            }
            if (currentSong) {
                screenplay.story.push(currentSong);
                currentSong = null;
            }

            currentSong = {
                id: screenplay.story.length + 1,
                type: 'song',
                item: {
                    number: parseInt(songMatch[1], 10),
                    title: null,
                    lyrics: '',
                },
            };

            const titleLine = lines[index + 2]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                currentSong.item.title = titleRegex.exec(titleLine)[1];
            }

            isSongLyrics = true;
            return;
        }

        // Detect scenes
        if (sceneMatch && currentChapter) {
            if (currentScene) {
                currentChapter.item.scenes.push(currentScene);
            }

            globalSceneCount++;

            currentScene = {
                number: globalSceneCount,
                title: sceneMatch[1].trim(),
                events: [],
            };
            return;
        }

        // Detect actions
        if (
            !characterMatch &&
            !parentheticalMatch &&
            !dialogueTextMatch &&
            actionMatch &&
            currentScene
        ) {
            if (!currentAction) {
                currentAction = {
                    type: 'Action',
                    text: actionMatch[1].trim(),
                };
            } else {
                currentAction.text += ' ' + actionMatch[1].trim();
            }
            return;
        }

        // Finalize the current action
        if ((!line.trim() || !actionMatch) && currentAction) {
            currentScene.events.push(currentAction);
            currentAction = null;
        }

        // Detect characters (start a dialogue block)
        if (characterMatch && currentScene) {
            if (currentDialogue) {
                currentScene.events.push(currentDialogue);
            }

            currentDialogue = {
                type: 'Dialogue',
                character: characterMatch[1].trim(),
                parenthetical: '',
                text: [],
            };
            return;
        }

        // Detect parentheticals
        if (parentheticalMatch && currentDialogue) {
            currentDialogue.parenthetical = parentheticalMatch[1];
            return;
        }

        // Detect dialogue text
        if (dialogueTextMatch && currentDialogue) {
            currentDialogue.text.push(dialogueTextMatch[1].trim());
            return;
        }

        // Finalize the current dialogue block
        if (!line.trim() && currentDialogue) {
            if(currentScene){
                // console.log(currentScene)
                currentScene.events.push(currentDialogue);
                currentDialogue = null;
            } else {
                console.log(currentScene, currentDialogue.text[0], currentChapter.item, line)
            }
        }

        // Detect page breaks
        if (pageBreakMatch) {
            return;
        }
    });

    // Finalize lingering items
    if (currentAction && currentScene) {
        currentScene.events.push(currentAction);
    }
    if (currentDialogue && currentScene) {
        currentScene.events.push(currentDialogue);
    }
    if (currentScene && currentChapter) {
        currentChapter.item.scenes.push(currentScene);
    }
    if (currentChapter) {
        screenplay.story.push(currentChapter);
    }
    if (currentSong) {
        screenplay.story.push(currentSong);
    }

    return screenplay;
}

export default fullParse;
