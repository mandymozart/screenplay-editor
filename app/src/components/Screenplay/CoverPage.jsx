import React from "react";
import "./CoverPage.css";
import useScreenplayStore from "../../stores/useScreenplayStore";

const CoverPage = () => {
  const { config } = useScreenplayStore();

  if (!config) {
    return <div>Error: Config missing</div>;
  }
  const { meta } = config;
  if (!meta) return <div>Error: Meta missing in config</div>;

  return (
    <div className="cover-page">
      <pre>
        {`
${meta.title}

${meta.type}

${meta.author}

${meta.basedOn}
${meta.basedOnFrom}

${meta.status}
${meta.date}
        `}
      </pre>
    </div>
  );
};

export default CoverPage;
