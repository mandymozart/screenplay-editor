import React, { useState } from "react";
import "./Dialogue.css";

const DialogueContent = ({ character, parenthetical, text, status }) => {
  return (
    <pre
      className={`dialogue-content ${
        status === "Copied" ? "status-copied" : ""
      }`}
    >
      <div className="event event--character">
        {`\t\t\t\t\t\t\t`}
        {character}
      </div>
      {parenthetical && (
        <div className="event event--parenthetical">
          {`\t\t\t\t\t\t`}({parenthetical})
        </div>
      )}
      {text.map((line, index) => (
        <div key={`line-${index}`} className="event event--dialogue">
          {`\t\t\t\t`}
          {line}
        </div>
      ))}
    </pre>
  );
};

const Dialogue = ({ character, parenthetical, text }) => {
  const [status, setStatus] = useState("");

  const handleCopy = async () => {
    // Construct the text to copy
    const contentToCopy = `${character}\n${
      parenthetical ? `(${parenthetical})\n` : ""
    }${text.join("\n")}`;

    try {
      // Use the Clipboard API to copy the text
      await navigator.clipboard.writeText(contentToCopy);
      setStatus("Copied");
    } catch (error) {
      setStatus("Failed");
      console.error("Copy error:", error);
    }

    // Reset status after 3 seconds
    setTimeout(() => setStatus(""), 500);
  };

  return (
    <div className="dialogue">
      <button onClick={handleCopy} className="copy-button">
        {status ? <span className="status">{status}</span> : "Copy"}
      </button>
      <DialogueContent
        character={character}
        parenthetical={parenthetical}
        text={text}
        status={status}
      />
    </div>
  );
};

export default Dialogue;
