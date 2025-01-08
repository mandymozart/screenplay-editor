import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";

const Container = styled.button`
  margin: 0;
  padding: 0;
  background-color: transparent;
  color: var(--asciicore-ui-primary);
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-family: var(--asciicore-ui-font);
  font-size: var(--asciicore-ui-font-size);
  line-height: 1rem;
  transition: all 0.1s;
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;

  &::before,
  &::after {
    content: "";
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  &::before {
    content: "[";
    margin-right: 0.25rem; /* Adjust spacing inside brackets */
  }

  &::after {
    content: "]";
    margin-left: 0.25rem; /* Adjust spacing inside brackets */
  }

  &:hover,
  &.active {
    color: var(--asciicore-ui-background);
    background: var(--asciicore-ui-primary);
  }

  &.checked > span {
    content: "x"; /* Style for checked state */
  }
`;

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) onChange(newCheckedState);
  };

  return (
    <Container
      className={clsx({ checked: isChecked })}
      onClick={handleClick}
      aria-checked={isChecked}
      role="checkbox"
    >
      <span>{isChecked ? "x" : " "}</span>
    </Container>
  );
};

export default Checkbox;
