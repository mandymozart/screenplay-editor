import React, { useState } from "react";
import { Checkbox } from "../asciicore-ui";
import styled from "@emotion/styled";

const Container = styled.span`

`;

const LanguageSwitcher = () => {
  const [lang, setLang] = useState("en");

  const handleLangChange = (targetLang) => {
    setLang(targetLang); // Directly set the language to the selected one
  };

  return (
    <Container>
      <Checkbox
        checked={lang === "en"}
        onChange={() => handleLangChange("en")}
      />{" "}
      English
      <Checkbox
        checked={lang === "de"}
        onChange={() => handleLangChange("de")}
      />{" "}
      German
    </Container>
  );
};

export default LanguageSwitcher;
