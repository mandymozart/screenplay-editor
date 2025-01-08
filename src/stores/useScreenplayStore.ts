import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Screenplay, Event } from '../types/ScreenplayTypes';
import { mountStoreDevtool } from 'simple-zustand-devtools';

// Define the Zustand store interface
interface ScreenplayState {
  screenplay: Screenplay | null;
  setScreenplay: (screenplay: Screenplay) => void;
  updateEvent: (
    beatId: number,
    sceneIndex: number,
    sceneEventIndex: number,
    updatedEvent: Partial<Event>
  ) => void;
}

const useScreenplayStore = create<ScreenplayState>()(
  persist(
    (set) => ({
      screenplay: null,
      setScreenplay: (screenplay: Screenplay) => set({ screenplay }),

      updateEvent: (
        beatId: number,
        sceneIndex: number,
        sceneEventIndex: number,
        updatedEvent: Partial<Event>
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
                    index === sceneEventIndex ? { ...event, ...updatedEvent } : event
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
      name: 'screenplay-storage', // Local storage key
    }
  )
);

export default useScreenplayStore;

if (import.meta.env.DEV) {
  mountStoreDevtool('ScreenplayStore', useScreenplayStore);
}