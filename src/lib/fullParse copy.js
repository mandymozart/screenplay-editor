import fs from 'fs';
import { config } from './loadConfig.js';
import { i18next, t } from '../i18next.js';
import {createRegex, chapterRegex, songRegex, titleRegex, sceneRegex, actionRegex, pageBreakRegex} from './regex.js'

/**
 * Parse a screenplay txt file to a Screenplay
 * Ensures robust handling of missing chapters and scenes.
 * @returns {Screenplay} 
 */
function fullParse(locale = 'de') {
    i18next.changeLanguage(locale);

    // Read the script file
    const inputFile = config[locale].file || "./screenplay.txt";
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File "${inputFile}" not found.`);
        process.exit(1);
    }

    const script = fs.readFileSync(inputFile, 'utf-8');

    const screenplay = {
        story: [],
    };

    let currentChapter = null; // Tracks the active chapter
    let currentScene = null;   // Tracks the active scene
    let currentSong = null;    // Tracks the active song
    let isSongLyrics = false;  // Flag to track whether we are parsing song lyrics

    // Parse script line by line
    script.split('\n').forEach((line, index, lines) => {
        line = line.trimEnd(); // Remove trailing spaces

        // Handle song lyrics
        if (isSongLyrics && currentSong) {
            if (chapterRegex.test(line) || songRegex.test(line)) {
                // Finish the current song
                screenplay.story.push(currentSong);
                currentSong = null;
                isSongLyrics = false;
            } else {
                currentSong.item.lyrics += line + '\n'; // Collect raw lyrics
                return;
            }
        }

        // Ignore page breaks in song lyrics
        if (isSongLyrics && pageBreakRegex.test(line)) {
            return;
        }

        // Detect chapters
        const chapterMatch = chapterRegex.exec(line);
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

            // Capture title and subtitle from subsequent lines
            const titleLine = lines[index + 1]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                currentChapter.item.title = titleRegex.exec(titleLine)[1].trim();
            }
            const subtitleLine = lines[index + 2]?.trim();
            if (subtitleLine && titleRegex.test(subtitleLine)) {
                currentChapter.item.subtitle = titleRegex.exec(subtitleLine)[1].trim();
            }
            return;
        }

        // Detect songs
        const songMatch = songRegex.exec(line);
        if (songMatch) {
            if (currentChapter) {
                if (currentScene) {
                    currentChapter.item.scenes.push(currentScene);
                    currentScene = null;
                }
                screenplay.story.push(currentChapter);
                currentChapter = null;
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

            // Capture song title
            const titleLine = lines[index + 1]?.trim();
            if (titleLine && titleRegex.test(titleLine)) {
                currentSong.item.title = titleRegex.exec(titleLine)[1].trim();
            }

            isSongLyrics = true;
            return;
        }

        // Detect scenes
        const sceneMatch = sceneRegex.exec(line);
        if (sceneMatch) {
            if (!currentChapter) {
                console.warn(
                    `Warning: Scene "${sceneMatch[1].trim()}" encountered without an active chapter. Creating a placeholder chapter.`
                );

                // Create a dummy chapter
                currentChapter = {
                    id: screenplay.story.length + 1,
                    type: 'chapter',
                    item: {
                        number: screenplay.story.length + 1,
                        title: 'Untitled Chapter',
                        subtitle: null,
                        scenes: [],
                    },
                };
                screenplay.story.push(currentChapter);
            }

            if (currentScene) {
                currentChapter.item.scenes.push(currentScene);
            }

            currentScene = {
                number: currentChapter.item.scenes.length + 1,
                title: sceneMatch[1].trim(),
                events: [],
            };
            currentChapter.item.scenes.push(currentScene);
            return;
        }

        // Detect actions
        const actionMatch = actionRegex.exec(line);
        if (actionMatch && currentScene) {
            currentScene.events.push({
                type: 'Action',
                text: actionMatch[1].trim(),
            });
            return;
        }

        // Detect page breaks (for scenes)
        if (pageBreakRegex.test(line) && currentScene) {
            currentScene.events.push({
                type: 'PageBreak',
            });
            return;
        }
    });

    // Finalize lingering elements
    if (currentSong) {
        screenplay.story.push(currentSong);
    }
    if (currentScene) {
        currentChapter.item.scenes.push(currentScene);
    }
    if (currentChapter) {
        screenplay.story.push(currentChapter);
    }

    return screenplay;
}

export default fullParse;
