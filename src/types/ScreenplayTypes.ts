export interface Event {
    type: string;
    text: string;
    character?: string;
    parenthetical?: string;
    textLines?: string[]; // For multi-line dialogues
}

export interface Scene {
    number: number;
    title: string;
    events: Event[];
}

export interface Chapter {
    id: number;
    type: 'chapter';
    item: {
        number: number;
        title: string;
        subtitle?: string | null;
        scenes: Scene[];
    };
}

export interface Song {
    id: number;
    type: 'song';
    item: {
        number: number;
        title: string;
        lyrics: string;
    };
}

export type ScreenplayItem = Chapter | Song;

export interface Screenplay {
    items: ScreenplayItem[];
}
