let btn = document.createElement("button");
btn.id = "notico-clipper-btn";
btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Clip`;
btn.title = "Clip this page to Notico";

async function clipPage(selectedText) {
  const selection = selectedText || window.getSelection()?.toString().trim() || "";
  const content = [
    `# [${document.title}](${window.location.href})`,
    "",
    selection ? `> ${selection}` : "",
    "",
    "Clipped from: " + window.location.href,
  ].join("\n");

  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({
      type: "CLIP_NOTE",
      title: `Clipped: ${document.title}`,
      content,
    });

    if (response?.success) {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!`;
    } else {
      btn.textContent = "Failed: " + (response?.error || "unknown");
      console.error("Notico clip failed:", response?.error);
    }
  } catch (err) {
    btn.textContent = "Error";
    console.error("Notico clip error:", err);
  }

  setTimeout(() => {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Clip`;
    btn.disabled = false;
  }, 2500);
}

btn.addEventListener("click", async () => {
  await clipPage();
});

document.body.appendChild(btn);

// Listen for clip success from background (keyboard shortcut)
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CLIP_SUCCESS") {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!`;
    setTimeout(() => {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Clip`;
      btn.disabled = false;
    }, 2500);
  }
});
