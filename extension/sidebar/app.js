function showPair() {
  document.getElementById("pair-screen").style.display = "flex";
  document.getElementById("main-screen").style.display = "none";
}
function showMain() {
  document.getElementById("pair-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "flex";
}
function send(msg) {
  return new Promise(function(resolve) {
    chrome.runtime.sendMessage(msg, function(res) {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(res || { success: false, error: "No response" });
      }
    });
  });
}

async function loadNotes() {
  var res = await send({ type: "GET_NOTES" });
  var list = document.getElementById("note-list");
  if (!res.success || !res.notes || !res.notes.length) {
    list.innerHTML = '<p style="font-size:11px;color:#86868b;text-align:center;padding:16px;">No recent notes</p>';
    return;
  }
  list.innerHTML = res.notes.slice(0, 10).map(function(n) {
    var age = "";
    if (n.expiresAt) {
      var mins = Math.max(0, Math.round((n.expiresAt - Date.now()) / 60000));
      age = mins <= 0 ? '<span class="tag" style="background:#fef2f2;color:#ef4444;">expired</span>' :
            '<span class="tag">' + mins + 'm left</span>';
    }
    return '<div class="note-item">' +
      '<h3>' + (n.title || "Untitled") + '</h3>' +
      '<p>' + (n.content || "").replace(/[#*[\]>]/g, "").slice(0, 80) + '</p>' +
      age +
    '</div>';
  }).join("");
}

document.getElementById("save-btn").addEventListener("click", async function() {
  var input = document.getElementById("note-input");
  var content = input.value.trim();
  if (!content) return;
  var btn = document.getElementById("save-btn");
  var statusEl = document.getElementById("save-status");
  btn.disabled = true; btn.textContent = "Saving...";
  var title = content.split("\n")[0].replace(/^#\s*/, "").slice(0, 40) || "Quick note";
  var res = await send({ type: "SAVE_QUICK_NOTE", title: title, content: content });
  if (res.success) {
    input.value = "";
    statusEl.textContent = "Saved! (expires in 10 min)";
    statusEl.className = "status";
    loadNotes();
  } else {
    statusEl.textContent = "Failed: " + (res.error || "unknown");
    statusEl.className = "status error";
  }
  btn.disabled = false; btn.textContent = "Save Note";
});

document.getElementById("note-input").addEventListener("keydown", function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    document.getElementById("save-btn").click();
  }
});

document.getElementById("pair-btn").addEventListener("click", async function() {
  var code = document.getElementById("pair-code-input").value.trim().toUpperCase();
  var statusEl = document.getElementById("pair-status");
  var btn = document.getElementById("pair-btn");
  if (code.length !== 6) { statusEl.textContent = "Enter a 6-character code"; return; }
  btn.disabled = true; btn.textContent = "Pairing..."; statusEl.textContent = "";
  var res = await send({ type: "PAIR_EXTENSION", code: code });
  if (res.success) { showMain(); loadNotes(); }
  else { statusEl.textContent = res.error || "Invalid code"; }
  btn.disabled = false; btn.textContent = "Pair";
});

document.getElementById("pair-code-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") document.getElementById("pair-btn").click();
});
document.getElementById("pair-code-input").addEventListener("input", function(e) {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});

document.getElementById("unpair-btn").addEventListener("click", async function() {
  if (!confirm("Unpair this extension?")) return;
  await send({ type: "UNPAIR_EXTENSION" });
  showPair();
});

document.addEventListener("DOMContentLoaded", function() {
  showPair();
  send({ type: "GET_PAIR_STATUS" }).then(function(res) {
    if (res.success && res.paired) { showMain(); loadNotes(); }
  }).catch(function() {});
});
