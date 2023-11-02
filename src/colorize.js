import {parseAnsi} from "./ansi-parser/index.js";

let idCounter = 0;

function generateId() {
  return `colorize-ansi-${idCounter++}`;
}

const commonClassesMap = new Map();

function getClassNameForItemStyle(item) {
  if (!item.css) {
    return;
  }

  let className = commonClassesMap.get(item.css);

  if (className) {
    return className;
  }

  className = generateId();

  commonClassesMap.set(item.css, className);

  // This is done to avoid creating a lot of CSS rules which can consume a lot of memory when there are a lot of pre elements
  commonStyle.innerHTML += `
#${uniqueContainerId} > pre.${className} {
    ${item.css}
}`;

  return className;
}

function createCodeHtml(item) {
  const className = getClassNameForItemStyle(item);

  // For some reason the new lines are not rendered in the pre element, so we need to replace them with <br>
  item.text = item.text.replace(/\n/g, "<br>");

  return (
    "<pre" +
    (className ? ` class="${className}"` : "") +
    ">" +

    // No worries of XSS here, it's already escaped as we take the html content as is
    item.text +
    "</pre>"
  );
}

async function colorTextHtml({ el, getText }) {
  let i = 0;
  const spans = parseAnsi(getText);

  const CHUNK_SIZE = 10000;
  let childrenChunk = "";

  for (const span of spans) {
    childrenChunk += createCodeHtml(span);
    i++;

    if (i % CHUNK_SIZE === 0) {
      el.innerHTML += childrenChunk;
      childrenChunk = "";

      // Avoid blocking the main thread
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  if (childrenChunk) {
    el.innerHTML += childrenChunk;
  }
}

let ansiContainer;
let ogStyle;
let cssText;

// To avoid keeping the original pre element in memory
{
  const og = document.querySelector("pre");
  ansiContainer = og.parentNode;
  ogStyle = og.computedStyleMap();
  cssText = og.style.cssText;
}
const marginTop = ogStyle.get("margin-top");
const marginBottom = ogStyle.get("margin-bottom");
const marginRight = ogStyle.get("margin-right");
const marginLeft = ogStyle.get("margin-left");

const uniqueContainerId = generateId();

// Common style to avoid recreating it for each pre, it will save a lot of memory when there are a lot of pre elements
const commonStyle = document.createElement("style");
commonStyle.innerHTML = `
#${uniqueContainerId} > pre {
    ${cssText};
    display: inline;
    margin: 0;
}`;
document.head.appendChild(commonStyle);

const container = document.createElement("div");
container.style.display = "inline";
container.style.marginTop = `${marginTop}`;
container.style.marginBottom = `${marginBottom}`;
container.style.marginRight = `${marginRight}`;
container.style.marginLeft = `${marginLeft}`;
container.id = uniqueContainerId;

ansiContainer.append(container);

colorTextHtml({
  el: container,
  getText() {
    const og = document.querySelector("pre");
    const text = og.innerHTML;

    // To avoid a lot of memory usage
    og.parentNode.removeChild(og);

    return text;
  },
});
