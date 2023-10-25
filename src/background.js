"use strict";

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./dist/colorize.js"],
    });
  }
});

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.endsWith(".log")) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["./dist/colorize.js"],
    });
  }
});
