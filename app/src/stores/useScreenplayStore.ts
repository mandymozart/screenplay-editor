import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Screenplay,
  ScreenplayEvent,
  ScreenplayConfig,
} from "../types/ScreenplayTypes";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { defaultConfig } from "../constants";

// Define the Zustand store interface
interface ScreenplayState {
  screenplay: Screenplay | null;
  setScreenplay: (screenplay: Screenplay) => void;
  config: ScreenplayConfig | null;
  setConfig: (config: ScreenplayConfig) => void;
  clearAll: () => void;
  clearConfig: () => void;
  clearScreenplay: () => void;
  updateEvent: (
    beatId: number,
    sceneIndex: number,
    sceneEventIndex: number,
    updatedEvent: Partial<ScreenplayEvent>
  ) => void;
}

const useScreenplayStore = create<ScreenplayState>()(
  persist(
    (set) => ({
      screenplay: null,
      setScreenplay: (screenplay: Screenplay) => set({ screenplay }),
      config: defaultConfig,
      setConfig: (config: ScreenplayConfig) => set({ config }),
      clearAll: () => set({ screenplay: null, config: defaultConfig }),
      clearConfig: () => set({ config: defaultConfig }),
      clearScreenplay: () => set({ screenplay: null }),
      updateEvent: (
        beatId: number,
        sceneIndex: number,
        sceneEventIndex: number,
        updatedEvent: Partial<ScreenplayEvent>
      ) => {
        set((state) => {
          // Ensure screenplay exists
          if (!state.screenplay) return state;

          const updatedStory = state.screenplay.story.map((beat) => {
            // Match the beat by ID
            if (beat.id === beatId) {
              const updatedScenes = beat.item.scenes.map((scene, index) => {
                if (index === sceneIndex) {
                  const updatedEvents = scene.events.map((event, index) =>
                    index === sceneEventIndex
                      ? { ...event, ...updatedEvent }
                      : event
                  );
                  return { ...scene, events: updatedEvents };
                }
                return scene;
              });
              return { ...beat, item: { ...beat.item, scenes: updatedScenes } };
            }
            return beat;
          });

          return { screenplay: { ...state.screenplay, story: updatedStory } };
        });
      },
    }),
    {
      name: "screenplay-storage", // Local storage key
    }
  )
);

export default useScreenplayStore;

mountStoreDevtool("ScreenplayStore", useScreenplayStore);
