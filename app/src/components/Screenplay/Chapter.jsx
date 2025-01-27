import React from 'react';
import Scene from './Scene';
import './Chapter.css';

const Chapter = ({ chapter, beatId }) => {
    return (
        <div className="beat beat--chapter">
            <div className="chapter">
                <pre className="chapter-header">
                    <div className="chapter-number">{`    # ${chapter.number}. Kapitel`}</div>
                    <div className="chapter-title">{`    # ${chapter.title}`}</div>
                    {chapter.subtitle && (
                        <div className="chapter-subtitle">{`    # ${chapter.subtitle}`}</div>
                    )}
                </pre>
                <div className="chapter-scenes">
                    {chapter.scenes.map((scene, index) => (
                        <Scene key={`scene-${index}`} 
                        scene={scene} 
                        beatId={beatId} 
                        sceneIndex={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chapter;
