const {parseAnsi} = require('./ansi-parser');

const parser = new DOMParser();

function decodeHtmlEntity(str) {
    const dom = parser.parseFromString(
        "<!doctype html><body>" + str,
        "text/html"
    );

    return dom.body.textContent;
}

function createCode(item, extraStyle) {
    const pre = document.createElement("pre");

    const newContent = document.createTextNode(decodeHtmlEntity(item.text));
    pre.appendChild(newContent);

    pre.style = item.css + "; " + extraStyle;
    pre.style.display = "inline";
    pre.style.margin = "0";

    return pre;
}

function colorText(el, t, extraStyle) {
    const spans = parseAnsi(t);

    for (const span of spans) {
        el.appendChild(createCode(span, extraStyle));
    }
}

const og = document.querySelector("pre");
const ogStyle = og.computedStyleMap();
const marginTop = ogStyle.get("margin-top");
const marginBottom = ogStyle.get("margin-bottom");
const marginRight = ogStyle.get("margin-right");
const marginLeft = ogStyle.get("margin-left");
const text = og.innerHTML;

const container = document.createElement("div");
container.style.display = "inline";
container.style.marginTop = marginTop + "";
container.style.marginBottom = marginBottom + "";
container.style.marginRight = marginRight + "";
container.style.marginLeft = marginLeft + "";

colorText(container, text, og.style.cssText);

og.parentNode.replaceChildren(container);
