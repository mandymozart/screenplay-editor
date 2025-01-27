function parseAndRenderStyledText(doc, text, x, y) {
  const stylePatterns = [
    { regex: /\*\*\*(.+?)\*\*\*/, style: "bolditalic" }, // ***bolditalic***
    { regex: /\*\*(.+?)\*\*/, style: "italic" }, // **italic**
    { regex: /\*(.+?)\*/, style: "bold" }, // *bold*
    { regex: /_(.+?)_/, style: "underline" }, // _underlined_
  ];

  let currentX = x;

  while (text.length > 0) {
    const matches = stylePatterns
      .map(({ regex, style }) => {
        const match = regex.exec(text);
        return match ? { match, style, index: match.index } : null;
      })
      .filter(Boolean);

    if (matches.length > 0) {
      // Find the earliest match
      const { match, style } = matches.reduce((earliest, current) =>
        current.index < earliest.index ? current : earliest
      );

      // Render plain text before the match
      const plainText = text.slice(0, match.index);
      if (plainText) {
        currentX = renderPlainText(doc, plainText, currentX, y);
      }

      // Render the matched styled text
      const styledText = match[1]; // Captured group
      currentX = renderStyledText(doc, styledText, currentX, y, style);

      // Remove the processed part from the text
      text = text.slice(match.index + match[0].length);
    } else {
      // Render remaining text as plain text
      currentX = renderPlainText(doc, text, currentX, y);
      break;
    }
  }
}

function renderPlainText(doc, text, x, y) {
  doc.text(text, x, y);
  return x + doc.getTextWidth(text);
}

function renderStyledText(doc, text, x, y, style) {
  const textWidth = doc.getTextWidth(text);

  if (style === "underline") {
    const underlineThickness = 0.5;
    const underlineOffset = 1; // Adjust for font size and alignment

    // Render the text
    doc.text(text, x, y);

    // Draw the underline
    doc.setLineWidth(underlineThickness);
    doc.line(
      x,
      y + underlineOffset, // Position the underline below the text
      x + textWidth,
      y + underlineOffset
    );
  } else {
    // Use styledText for bold, italic, or bolditalic
    doc.styledText(text, x, y, style);
  }

  return x + textWidth;
}

export { parseAndRenderStyledText };
