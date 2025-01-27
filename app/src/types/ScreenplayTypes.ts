export enum ScreenplayBeatType {
  Chapter = "chapter",
  Song = "song",
}

export interface ScreenplayEvent {
  type: string;
  text: string;
  character?: string;
  parenthetical?: string;
  textLines?: string[];
}

export interface ScreenplayScene {
  number: number;
  title: string;
  events?: ScreenplayEvent[];
}

export type ScreenplayStoryItem = {
  id: number;
  type: ScreenplayBeatType;
  item: {
    number: number;
    title?: string | null;
    subtitle?: string | null;
    text?: string | null;
    scenes?: ScreenplayScene[]; // scenes or verse
  };
};

export interface Screenplay {
  story: ScreenplayStoryItem[];
}

export interface ScreenplayConfig {
  meta?: Record<string, any>;
  report?: Record<string, any>;
  layout?: Record<string, any>;
  i18n?: Record<string, any>;
}
