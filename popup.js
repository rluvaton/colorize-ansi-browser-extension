
chrome.tabs.query({active : true}).then(tabs => {
  console.log(tabs);
});

// function getMilestone(tabs) {
//   const div = document.createElement("div");
//   document.body.appendChild(div);
//   const url = tabs[0].url;
//   const origin = 'https://chromium-review.googlesource.com';
//   const search = `^${origin}/c/chromium/src/\\+/(\\d+)`;
//   const match = url.match(search);
//   if (match != undefined && match.length == 2) {
//     getMilestoneForRevId(match[1]).then(
//         (milestone) => milestone != '' ? (div.innerText = `m${milestone}`)
//                                        : window.close());
//   } else {
//     window.close();
//   }
// }

// async function getMilestoneForRevId(revId) {
//   const res = await fetch(`https://crrie.com/c/?r=${revId}`);
//   return await res.text();
// }
