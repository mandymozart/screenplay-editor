function getCharacterWidth() {
    let span = document.createElement("span");
    span.style.fontFamily = "var(--asciicore-ui-font";
    span.style.fontSize = "var(--asciicore-ui-font-size";
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.width = "auto";
    span.style.whiteSpace = "nowrap";
    span.style.padding = "0";
    span.style.margin = "0";
    span.style.letterSpacing = "0px";
    span.style.wordSpacing = "0px";
    span.innerText = "#";
    document.body.appendChild(span);
    
    let width = span.getBoundingClientRect().width;
    span.remove();
    
    return width;
}

export default getCharacterWidth;