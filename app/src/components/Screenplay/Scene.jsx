import React from 'react';
import SceneEvent from './SceneEvent';
import './Scene.css'

const Scene = ({ scene, beatId, sceneIndex }) => {
    return (
        <div className="scene">
            <div className="scene-title">{`${scene.number}\t${scene.title}`}</div>
            <div className="scene-events">
                {scene.events.map((event, index) => (
                    <SceneEvent 
                    key={`event-${index}`} 
                    event={event} 
                    beatId={beatId}
                    sceneNumber={scene.number}
                    sceneIndex={sceneIndex}
                    sceneEventIndex={index}/>
                ))}
            </div>
        </div>
    );
};

export default Scene;
