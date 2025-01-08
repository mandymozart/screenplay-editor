export function underlinedText(text, x, y, options = {}) {
    const { align = "left" } = options;
    const textWidth = this.getTextWidth(text);
    const pageWidth = this.internal.pageSize.getWidth();
    const underlineThickness = 0.5;
    const underlineOffset = 1;

    this.text(text, x, y, { align: align });

    // Adjust x for alignment
    if (align === "center") {
        x = (pageWidth - textWidth) / 2;
    } else if (align === "right") {
        x = pageWidth - textWidth - x;
    }

    // Add the text
    
    // Draw the underline
    this.setLineWidth(underlineThickness);
    this.line(x, y + underlineOffset, x + textWidth, y + underlineOffset);
}
