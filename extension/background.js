const CONVEX_URL = "https://admirable-swan-348.convex.cloud";

async function getAuthToken() {
  const result = await chrome.storage.local.get("authToken");
  return result.authToken || null;
}

async function convexMutation(path, args) {
  const res = await fetch(CONVEX_URL + "/api/mutation", {
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
  const res = await fetch(CONVEX_URL + "/api/query", {
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
  if (message.type === "SAVE_QUICK_NOTE") {
    getAuthToken()
      .then(async (token) => {
        if (!token) return sendResponse({ success: false, error: "Not paired" });
        const result = await convexMutation("notes:create", {
          title: message.title,
          content: message.content,
          token,
        });
        sendResponse({ success: true, result });
      })
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "GET_NOTES") {
    getAuthToken()
      .then(async (token) => {
        if (!token) return sendResponse({ success: false, error: "Not paired" });
        const notes = await convexQuery("notes:list", { token });
        sendResponse({ success: true, notes });
      })
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "PAIR_EXTENSION") {
    convexQuery("pairing:validate", { code: message.code })
      .then(async (result) => {
        if (result.valid) {
          await chrome.storage.local.set({ userId: result.userId, paired: true });
          sendResponse({ success: true, userId: result.userId });
        } else {
          sendResponse({ success: false, error: result.error });
        }
      })
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "UNPAIR_EXTENSION") {
    chrome.storage.local.remove(["userId", "paired", "authToken"])
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "GET_PAIR_STATUS") {
    chrome.storage.local.get(["userId", "paired"]).then((result) => {
      sendResponse({ success: true, paired: !!result.paired && !!result.userId, userId: result.userId });
    });
    return true;
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});
