const DEFAULT_URL = "https://admirable-swan-348.convex.cloud";

async function getConvexUrl() {
  const result = await chrome.storage.local.get("convexUrl");
  return result.convexUrl || DEFAULT_URL;
}

async function convexMutation(path, args) {
  const url = await getConvexUrl();
  const res = await fetch(url + "/api/mutation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: args || {} }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex returned ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function convexQuery(path, args) {
  const url = await getConvexUrl();
  const res = await fetch(url + "/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: args || {} }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex returned ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLIP_NOTE") {
    convexMutation("notes:create", { title: message.title, content: message.content })
      .then((result) => sendResponse({ success: true, result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === "GET_NOTES") {
    convexQuery("notes:list", {})
      .then((notes) => sendResponse({ success: true, notes }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === "SAVE_QUICK_NOTE") {
    convexMutation("notes:create", { title: message.title, content: message.content })
      .then((result) => sendResponse({ success: true, result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === "SET_CONVEX_URL") {
    chrome.storage.local.set({ convexUrl: message.url })
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === "GET_CONVEX_URL") {
    getConvexUrl()
      .then((url) => sendResponse({ success: true, url }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === "GET_SELECTED_TEXT") {
    sendResponse({ success: true, text: "" });
    return false;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});

// Handle keyboard shortcut: execute script to get selection, then clip
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "clip-page") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return {
            title: document.title,
            url: window.location.href,
            selection: window.getSelection()?.toString().trim() || "",
          };
        },
      });

      const { title, url, selection } = results[0].result;
      const content = [
        `# [${title}](${url})`,
        "",
        selection ? `> ${selection}` : "",
        "",
        `Clipped from: ${url}`,
      ].join("\n");

      await convexMutation("notes:create", {
        title: `Clipped: ${title}`,
        content,
      });

      // Notify the content script to show feedback
      chrome.tabs.sendMessage(tab.id, { type: "CLIP_SUCCESS" }).catch(() => {});
    } catch (err) {
      console.error("Notico clip command failed:", err);
    }
  }
});
