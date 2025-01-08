export function styledText (text, x, y, style = 'normal', options = {}) {
    this.setFont('Courier', style); // Set font to italic
    this.text(text, x, y, options); // Add the text
    this.setFont('Courier', 'normal'); // Reset to normal font after
};
