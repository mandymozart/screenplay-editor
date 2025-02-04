```
 _______  _______  _______  _______  _______  _        _______  _        _______
(  ____ \(  ____ \(  ____ )(  ____ \(  ____ \( (    /|(  ____ )( \      (  ___  )|\     /|
| (    \/| (    \/| (    )|| (    \/| (    \/|  \  ( || (    )|| (      | (   ) |( \   / )
| (_____ | |      | (____)|| (__    | (__    |   \ | || (____)|| |      | (___) | \ (_) /
(_____  )| |      |     __)|  __)   |  __)   | (\ \) ||  _____)| |      |  ___  |  \   /
      ) || |      | (\ (   | (      | (      | | \   || (      | |      | (   ) |   ) (
/\____) || (____/\| ) \ \__| (____/\| (____/\| )  \  || )      | (____/\| )   ( |   | |
\_______)(_______/|/   \__/(_______/(_______/|/    )_)|/       (_______/|/     \|   \_/
```

# Modules

screenplay (lib)
screenplay-app
screenplay-cli
screenplay-server

# Configuration

To build a screenplay, you need to have a folder with your `screenplay.txt` and `config.json`.

See `example/` for reference.

### Structure

```json
{
  "meta": {
    "title": "Katzenpabst - Das Erwachen",
    "author": "Tilman Porschütz",
    "status": "ENTWURF",
    "date": "November 2024",
    "basedOn": "Basiert auf Liedern",
    "basedOnFrom": "Mandy Mozart",
    "type": "Graphik Novelle"
  },
  "layout": {
    "lineHeight": 4.8,
    "linePerPage": 55,
    "marginRight": 10,
    "marginLeft": 35,
    "marginTop": 22,
    "pageNumberMarginTop": 10
  },
  "i18n": {
    "common": {
      "screenplay": "Drehbuch",
      "untitled": "Ohne Titel",
      "writtenBy": "Geschrieben von",
      "by": "von",
      "story": "Geschichte",
      "chapter_one": "Kapitel",
      "chapter_other": "Kapitel",
      "scene_one": "Szene",
      "scene_other": "Szenen",
      "song_one": "Lied",
      "song_other": "Lieder",
      "character_one": "Charakter",
      "character_other": "Charaktere",
      "transition_one": "Übergang",
      "transition_other": "Übergänge",
      "line_one": "Zeile",
      "line_other": "Zeilen",
      "dialogue_one": "Dialog",
      "dialogue_other": "Dialoge",
      "action_one": "Regieanweisung",
      "action_other": "Regieanweisungen",
      "verse_one": "Strophe",
      "verse_other": "Strophen",
      "lyrics": "Liedtexte"
    }
  }
}
```

# Available Scripts

These `npm run` scripts are available in the project.

---

### Installation

```bash
npm install
```

Installs all necessary dependencies for the project.

---

### Development Scripts

#### Start Development Server

```bash
npm run dev
```

Starts the React frontend for viewing and testing the screenplay.

#### Build Frontend

```bash
npm run build
```

Compiles the frontend into a production-ready build.

#### Start Express Server

```bash
npm run start:server
```

Starts an Express.js server to serve the application.

#### Watch Frontend

```bash
npm run watch:frontend
```

Watches files in the `./src` directory for changes and restarts the server if a watched file is modified.

---

# Writing Guide

This guide outlines how to format your screenplay following Hollywood-inspired conventions, adjusted for compatibility with the parser. Each element's indentation and rules are clarified for both **tabs** and **spaces** usage.

---

## General Formatting Rules

1. **File Format**: Save your screenplay as a plain text file (`.txt`).
2. **Line Breaks**: Use a single line break to separate elements.
3. **Indentation**:
   - Actions: **1 tab** or **4 spaces**.
   - Dialogue: **2 tabs** or **16 spaces**.
   - Characters: **3 tabs** or **25–30 spaces**.
   - Parentheticals: **2 tabs** or **16 spaces** (1 tab or 4 spaces less than the character line).

---

## Elements of the Screenplay

### Chapters

- **Definition**: Chapters organize the screenplay and are marked with `# Kapitel` followed by the chapter number.
- **Format**:
  ```
  # 1. Kapitel
  ```
- **Optional Title and Subtitle**:
  - Title: Defined on the second line after the chapter heading.
  - Subtitle: Defined on the third line after the chapter heading.
  - Example:
    ```
    # 1. Kapitel
    # Der Beginn
    # Eine neue Ära
    ```

---

### Scenes

- **Definition**: Scenes represent narrative blocks and start with a number followed by the a tab and a scene heading.
- **Format**:
  ```
  1   INT. LIVING ROOM - NIGHT
  ```
- **Rules**:
  - The numbering should be sequential.
  - Use descriptors:
    - **INT.** for interior scenes.
    - **EXT.** for exterior scenes.
  - Location and time are written in uppercase.

---

### Actions

- **Definition**: Actions describe the visual or narrative elements within a scene.
- **Format**:
  - Indent each action line with **1 tab** or **4 spaces**.
  - Example:
    ```
    The door creaks open. A shadowy figure steps into the dimly lit room.
    ```

---

### Characters

- **Definition**: A character's name is indented using **3 tabs** or **25–30 spaces**, written in uppercase.
- **Optional Tags**:
  - Add **(cont'd)**, **(V.O.)**, **(subtitle)**, or **(O.S.)** after the character's name to indicate dialogue continuation, voice-over, subtitle, or off-screen delivery.
  - Example:
    ```
                            JOHN (cont'd) (V.O.)
    ```

---

### Dialogue

- **Definition**: Dialogue is spoken text by a character, indented with **2 tabs** or **16 spaces**.
- **Format**:
  ```
                This is where the dialogue text goes.
  ```
- **Rules**:
  - Dialogue follows the character's name.
  - Example:
    ```
                            JOHN
                This is where John's dialogue text goes.
    ```

---

### Parentheticals

- **Definition**: Parentheticals provide short instructions on how dialogue is delivered. They appear on a new line, indented **1 tab less** than the character's name.
- **Format**:
  ```
                        (whispering)
  ```
- **Rules**:
  - Must follow the character's name but precede the dialogue.
  - Indentation: **2 tabs** or **16 spaces**.
  - Example:
    ```
                            JOHN
                        (whispering)
                I don't think this is a good idea.
    ```

---

### Songs

- **Definition**: Songs are blocks marked by `# Lied` followed by the song number.
- **Format**:
  ```
    # 1. Lied
    # Title of the Song
  ```
- **Lyrics**:

  - Add lyrics line by line after the title.
  - Indent using **1 tab** or **4 spaces**.
  - Example:

    ```
    # 1. Lied
    # The Beginning

            Verse 1: The sun rises over the hill,
            A new day begins with a thrill.
    ```

---

### 8. **Page Breaks**

- **Definition**: Page breaks divide the screenplay and are represented by three or more dashes (`---`).
- **Format**:
  ```
  ---
  ```

---

## Example of a Complete Screenplay Section

```
# 1. Kapitel
# Der Anfang

1 INT. LIVING ROOM - NIGHT

    The door creaks open. A shadowy figure steps into the dimly lit room.

                        JOHN (V.O.)
                    (whispering)
            Who's there?

    A loud crash is heard in the kitchen.

# 1. Lied
# The Shadow's Song

        Verse 1: A figure in the dark,
        Waiting for the spark.
---

2 EXT. FOREST - DAY

    Birds chirp as the sun filters through the tall trees.
```

---

## Summary of Indentation Rules

Here’s the updated table with a row for **Songs** under **Non-conventional**:

| **Element**          | **Add. markup**  | **Indent** | **Tabs** | **Spaces** | **Special Rules**                                                             |
| -------------------- | ---------------- | ---------- | -------- | ---------- | ----------------------------------------------------------------------------- |
| **Conventional**     |                  |            |          |            |                                                                               |
| Scene                | None             | No         |          |            | Must be written in **UPPERCASE**.                                             |
| Action               | None             | Yes        | 1        | 4          |                                                                               |
| Character            | None             | Yes        | 7        | 28         | Must be written in **UPPERCASE**.                                             |
| Dialogue             | None             | Yes        | 6        | 24         | Follows immediately after character.                                          |
| Parenthetical        | None             | Yes        | 2        | 16         | Enclosed in **()** and indented less.                                         |
| Transition           | None             | Yes        | 12       | 48         | Must be written in **UPPERCASE**.                                             |
| **Non-conventional** |                  |            |          |            |                                                                               |
| Chapter              | `# {n}. Kapitel` | Yes        | 1        |            | Prefixed by `# Kapitel` followed by number.                                   |
| Lyrics               | None             | Yes        | 1        | 4          | Line-by-line text for songs.                                                  |
| Songs                | `# {n}. Lied`    | Yes        | 1        |            | Prefixed by `# Lied` followed by number. Song titles appear on the next line. |
| Page Break           | `---`            | No         |          |            | Represented by three or more dashes.                                          |

By following these conventions, your `screenplay.de.txt` will align with professional scriptwriting standards and ensure proper parsing by the system.

### Special decorators

`*Bold*`, `**Italic**`, `***Bold-Italic***`, `_Underline_`

## Editor

Currently implemented:

- Copy plain text to your clip board of the following types `Action`, `Dialogue` (contains `Parenthetical` and `Character`), `Scene`,

## Generative text and NLP features

Here is a list of the dependencies specified in your `package.json` file, along with links to their respective GitHub repositories:

Here’s the revised list, combining packages with a shared namespace and providing concise descriptions:

---

## Dependencies

- **@emotion** ([GitHub Repository](https://github.com/emotion-js/emotion))

  - `@emotion/css`: CSS-in-JS library.
  - `@emotion/react`: Emotion's React package.
  - `@emotion/styled`: Styled API for Emotion.

- **@vitejs** ([GitHub Repository](https://github.com/vitejs/vite/tree/main/packages/plugin-react))

  - `@vitejs/plugin-react`: Vite plugin for React support.

- **clsx** ([GitHub Repository](https://github.com/lukeed/clsx)): Utility for constructing `className` strings conditionally.
- **express** ([GitHub Repository](https://github.com/expressjs/express)): Minimalist web framework for Node.js.
- **i18next** ([GitHub Repository](https://github.com/i18next/i18next)): Internationalization framework.
- **jspdf** ([GitHub Repository](https://github.com/parallax/jsPDF)): PDF document generation.
- **jsprintmanager** ([GitHub Repository](https://github.com/neodynamic/JSPrintManager)): Advanced client-side printing.
- **react** ([GitHub Repository](https://github.com/facebook/react)): UI library for building interfaces.
  - Includes `react-dom`: DOM-specific React rendering.
- **rita** ([GitHub Repository](https://github.com/dhowe/RiTa)): Simplified NLP toolkit.
- **zustand** ([GitHub Repository](https://github.com/pmndrs/zustand)): Lightweight state management.
  - Includes `simple-zustand-devtools`: Devtools extension.

---

## DevDependencies

- **@eslint** ([GitHub Repository](https://github.com/eslint/eslint))

  - `@eslint/js`: JavaScript linting implementation.
  - Includes React-specific plugins:
    - `eslint-plugin-react`: React linting rules.
    - `eslint-plugin-react-hooks`: Rules for React Hooks.
    - `eslint-plugin-react-refresh`: Rules for React Refresh.

- **@types/react** ([GitHub Repository](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react))

  - Includes `@types/react-dom`: TypeScript definitions for React DOM.

- **globals** ([GitHub Repository](https://github.com/sindresorhus/globals)): Global variables and environments for ESLint.
- **instagram-scraper** ([GitHub Repository](https://github.com/rarcega/instagram-scraper)): Tool for scraping Instagram photos and videos.
- **nodemon** ([GitHub Repository](https://github.com/remy/nodemon)): Monitors changes and restarts Node.js apps.
- **vite** ([GitHub Repository](https://github.com/vitejs/vite)): Next-generation frontend tooling.

---

This list combines packages by namespace, shortens descriptions, and links to relevant GitHub repositories.
