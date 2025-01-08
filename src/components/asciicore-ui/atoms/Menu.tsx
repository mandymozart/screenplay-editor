import React from "react";
import styled from "@emotion/styled";

// Styled container for the menu
const Container = styled.pre`
  font-family: monospace;
  white-space: pre;
  background-color: var(--background-color);
  color: var(--text-color);
  display: inline-block;
`;

const Link = styled.span`
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: var(--text-color, #333);
    color: var(--background-color, #f9f9f9);
  }
`;

const generateMenu = (menu, handleAction) => {
  const totalWidth = 31;
  const horizontalLine = "─".repeat(totalWidth);
  const topBorder = `┌${horizontalLine}┐`;
  const bottomBorder = `└${horizontalLine}┘`;
  const divider = `├${horizontalLine}┤`;

  let output = `${topBorder}\n`;

  // Center-align the menu name
  const centeredName = menu.name.padStart(
    Math.floor((totalWidth + menu.name.length) / 2)
  ).padEnd(totalWidth);
  output += `│   ${centeredName}   │\n`;
  output += divider + "\n";

  menu.items.forEach((section, sectionIndex) => {
    if (section.label) {
      // Add group label with proper padding
      const paddedLabel = section.label.padEnd(totalWidth - 1);
      output += `│ ${paddedLabel}│\n`;
    }

    section.group.forEach((item) => {
      // Add placeholder for link with padding
      const placeholder = `{{${item.label}}}`;
      const remainingSpace = totalWidth - placeholder.length - 2; // Subtract 2 for borders
      output += `│ ${placeholder}${" ".repeat(remainingSpace)}│\n`;
    });

    if (sectionIndex < menu.items.length - 1) {
      output += divider + "\n";
    }
  });

  output += bottomBorder;

  // Convert placeholders to React components
  return output.split("\n").map((line, index) => {
    const match = line.match(/{{(.+?)}}/);

    if (match) {
      const label = match[1].trim();
      const item = menu.items
        .flatMap((section) => section.group)
        .find((groupItem) => groupItem.label.trim() === label);

      if (item) {
        // Replace placeholder with <Link> component
        const beforeLink = line.split(`{{${label}}}`)[0];
        const afterLink = " ".repeat(
          totalWidth - beforeLink.length - label.length - 3 // Subtract 3 for borders and spaces
        );

        return (
          <div key={index}>
            {beforeLink}
            <Link onClick={() => handleAction(item.action)}>{label}</Link>
            {afterLink}│
          </div>
        );
      }
    }

    return <div key={index}>{line}</div>;
  });
};

const Menu = ({ menu, onAction }) => {
  const handleAction = (action) => {
    if (onAction && typeof onAction === "function") {
      onAction(action);
    }
    console.log(action)
  };

  return <Container>{generateMenu(menu, handleAction)}</Container>;
};

export default Menu;
