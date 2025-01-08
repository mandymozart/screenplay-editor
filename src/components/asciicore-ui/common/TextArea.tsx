import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  display: inline-block;
  font-family: var(--asciicore-ui-font, monospace);
  color: var(--asciicore-ui-primary);
  text-align: left;

  &::before,
  &::after {
    display: block;
    content: "+${"-".repeat(props => props.width)}+";
    font-size: inherit;
    line-height: 1;
  }
`;

const TextAreaInput = styled.textarea`
  font-family: var(--asciicore-ui-font, monospace);
  font-size: var(--asciicore-ui-font-size, 1rem);
  color: var(--asciicore-ui-primary);
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  width: calc(${props => props.width}ch);
  height: calc(${props => props.height}em);
  line-height: 1;
  padding: 0;
  margin: 0;
  overflow: hidden;

  &::placeholder {
    color: var(--asciicore-ui-secondary);
  }
`;

const TextArea = ({ width = 20, height = 5, ...props }) => (
  <Container width={width}>
    <TextAreaInput width={width} height={height} {...props} />
  </Container>
);

export default TextArea;
