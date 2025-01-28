import parse from "./parse.js";
import loadConfig from "./loadConfig.js";
import { render } from "./render.js";
import { renderMarkdownFromScreenplay } from "./renderMarkdownFromJSON.js";
import { renderFromScreenplay } from "./renderFromJSON.js";

// Optionally, group them in a namespace
export default {
  loadConfig,
  parse,
  render,
  renderFromScreenplay,
  renderMarkdownFromScreenplay,
};
