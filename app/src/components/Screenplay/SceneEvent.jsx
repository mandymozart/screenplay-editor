import React from 'react';
import Action from './Action';
import Dialogue from './Dialogue';
import './SceneEvent.css'

const SceneEvent = ({ event, beatId, sceneNumber, sceneIndex, sceneEventIndex }) => {
  if (event.type === 'Action') {
    return <Action initialText={event.text} 
    beatId={beatId}
    sceneNumber={sceneNumber}
    sceneIndex={sceneIndex}
    sceneEventIndex={sceneEventIndex} />;
  } else if (event.type === 'Dialogue') {
    return (
      <Dialogue
        character={event.character}
        parenthetical={event.parenthetical}
        text={event.text}
        beatId={beatId}
        sceneNumber={sceneNumber}
        sceneIndex={sceneIndex}
        sceneEventIndex={sceneEventIndex}
      />
    );
  }
  return null; // Skip unknown event types
};

export default SceneEvent;
