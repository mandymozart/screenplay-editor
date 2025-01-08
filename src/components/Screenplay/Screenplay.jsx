import React from 'react';
import Chapter from './Chapter';
import Song from './Song';
import './Screenplay.css'
import CoverPage from './CoverPage';

const Screenplay = ({ screenplay }) => {
  return (
    <div className="screenplay">
      <CoverPage/>
      {screenplay.story.map((beat, index) => {
        if (beat.type === 'chapter') {
          return <Chapter key={`chapter-${index}`} chapter={beat.item} beatId={beat.id} />;
        } else if (beat.type === 'song') {
          return <Song key={`song-${index}`} song={beat.item} beatId={beat.id} />;
        }
        return null; // Skip unknown beat types
      })}
    </div>
  );
};

export default Screenplay;
