import styled from "@emotion/styled";
import React, { useRef, useState, useEffect } from "react";

const Container = styled.div`
  font-family: var(--asciicore-ui-font, monospace);
  font-size: var(--asciicore-ui-font-size, 1rem);
  color: var(--asciicore-ui-primary);
  text-align: left;
  display: flex;
  width: 100%; /* Stretch across the container */
  margin: 0 auto;
  white-space: nowrap; /* Prevent line wrapping */
  overflow: hidden; /* Avoid overflow outside the container */
  position: fixed;
  z-index: 1;
  background: var(--asciicore-ui-background);
`;

const HeaderContent = styled.div`
  display: inline-block;
  white-space: nowrap;
`;

const Header = ({ children }) => {
  return (
    <Container>
      <HeaderContent>
        {children}
      </HeaderContent>
    </Container>
  );
};

export default Header;
