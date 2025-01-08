import React from 'react';
import './Song.css'

/** update needs beat id */
const Song = ({ song, beatId }) => {
  return (
    <div className="beat beat--song">
      <pre className="song">
        <div className="song-header">
          <div className="song-number">{`    # ${song.number}. Lied`}</div>
          <div className="song-title">    # {song.title}</div>
        </div>
        <div className="song-lyrics">
          {song.lyrics.split('\n').map((line, index) => (
            <div key={`lyric-${index}`} className="song-lyrics-line">
              {line}
            </div>
          ))}
        </div>
      </pre>
    </div>
  );
};

export default Song;
