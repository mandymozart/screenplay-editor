import React from 'react';
import config from '../../../screenplay.config.js';
import './CoverPage.css';

const CoverPage = ({ lang = 'de' }) => {
  const screenplay = config[lang]; // Use selected language data

  if (!screenplay) {
    return <div>Error: Language not supported</div>;
  }

  return (
    <div className="cover-page">
      <pre>
        {`
${screenplay.title}

${screenplay.type}

von ${screenplay.author}

${screenplay.basedOn}
von ${screenplay.basedOnFrom}

${screenplay.status}
${screenplay.date}
        `}
      </pre>
    </div>
  );
};

export default CoverPage;
