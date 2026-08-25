import { useState, useEffect, useCallback } from "react";
import {
  getPairStatus,
  pairExtension,
  unpairExtension,
  saveQuickNote,
  getNotes,
  getTags,
  getFolders,
  type Note,
  type Tag,
  type Folder,
} from "./lib/messages";
import { Link, Send, Trash2, Tag, FolderOpen, X } from "lucide-react";

function PairScreen({ onPaired }: { onPaired: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePair = async () => {
    if (code.length !== 6) {
      setError("Enter a 6-character code");
      return;
    }
    setLoading(true);
    setError("");
    const res = await pairExtension(code.toUpperCase());
    if (res.success) {
      onPaired();
    } else {
      setError(res.error || "Invalid code");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
        <Link size={20} className="text-white" />
      </div>
      <h2 className="text-base font-semibold">Pair Extension</h2>
      <p className="text-xs text-text-secondary max-w-[220px] leading-relaxed">
        Generate a pairing code from the Notico website (Profile page) and
        paste it below.
      </p>
      <input
        type="text"
        maxLength={6}
        placeholder="XXXXXX"
        value={code}
        onChange={(e) =>
          setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
        }
        onKeyDown={(e) => e.key === "Enter" && handlePair()}
        className="w-48 text-center text-lg font-semibold tracking-widest font-mono border-2 border-border rounded-lg px-3 py-2 outline-none focus:border-accent"
      />
      <button
        onClick={handlePair}
        disabled={loading}
        className="w-48 bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {loading ? "Pairing..." : "Pair"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function MainScreen({ onUnpaired }: { onUnpaired: () => void }) {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [newTag, setNewTag] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"ok" | "error">("ok");
  const [saving, setSaving] = useState(false);

  const loadNotes = useCallback(async () => {
    const res = await getNotes();
    if (res.success && res.notes) {
      setNotes(res.notes.slice(0, 10));
    }
  }, []);

  const loadTags = useCallback(async () => {
    const res = await getTags();
    if (res.success && res.tags) {
      setTags(res.tags);
    }
  }, []);

  const loadFolders = useCallback(async () => {
    const res = await getFolders();
    if (res.success && res.folders) {
      setFolders(res.folders);
    }
  }, []);

  useEffect(() => {
    loadNotes();
    loadTags();
    loadFolders();
  }, [loadNotes, loadTags, loadFolders]);

  const handleSave = async () => {
    const text = content.trim();
    if (!text) return;
    setSaving(true);
    const title =
      text.split("\n")[0].replace(/^#\s*/, "").slice(0, 40) || "Quick note";
    const allTags = selectedTags.includes(newTag.trim()) ? selectedTags : newTag.trim() ? [...selectedTags, newTag.trim()] : selectedTags;
    const res = await saveQuickNote(title, text, allTags.length > 0 ? allTags : undefined, selectedFolder || undefined);
    if (res.success) {
      setContent("");
      setSelectedTags([]);
      setNewTag("");
      setStatus("Saved! (expires in 10 min)");
      setStatusType("ok");
      loadNotes();
      loadTags();
    } else {
      setStatus("Failed: " + (res.error || "unknown"));
      setStatusType("error");
    }
    setSaving(false);
  };

  const toggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleUnpair = async () => {
    if (!confirm("Unpair this extension?")) return;
    await unpairExtension();
    onUnpaired();
  };

  return (
    <div className="flex flex-col h-full px-3 py-3 gap-2">
      <h1 className="text-sm font-semibold">Notico</h1>
      <p className="text-[10px] text-text-secondary text-center">
        Paste anything. Saves for 10 min. Cmd+Enter to save.
      </p>

      <div className="flex items-center gap-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        <span className="text-xs text-green-700 font-medium">Paired</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
        }}
        placeholder="Paste or type something..."
        className="flex-1 min-h-[80px] border border-border rounded-lg px-2 py-1.5 text-xs font-mono resize-y outline-none focus:border-accent bg-white"
      />

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Tag size={11} className="text-text-secondary shrink-0" />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="flex-1 text-[11px] border border-border rounded px-2 py-1 outline-none focus:border-accent bg-white"
          />
        </div>
        {(tags.length > 0 || selectedTags.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {tags.filter((t) => !selectedTags.includes(t.name)).slice(0, 6).map((t) => (
              <button
                key={t.name}
                onClick={() => toggleTag(t.name)}
                className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-text-secondary hover:bg-accent-light hover:text-accent transition-colors"
              >
                {t.name}
              </button>
            ))}
            {selectedTags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-accent-light text-accent"
              >
                {t}
                <X size={8} />
              </button>
            ))}
          </div>
        )}
      </div>

      {folders.length > 0 && (
        <div className="flex items-center gap-1.5">
          <FolderOpen size={11} className="text-text-secondary shrink-0" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="flex-1 text-[11px] border border-border rounded px-2 py-1 outline-none focus:border-accent bg-white truncate"
          >
            <option value="">No folder</option>
            {folders.map((f) => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-1.5 bg-accent text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        <Send size={12} />
        {saving ? "Saving..." : "Save Note"}
      </button>

      {status && (
        <p
          className={`text-[11px] ${
            statusType === "error" ? "text-red-500" : "text-text-secondary"
          }`}
        >
          {status}
        </p>
      )}

      <div className="flex-1 overflow-y-auto space-y-1.5 mt-1">
        {notes.length === 0 && (
          <p className="text-[11px] text-text-secondary text-center py-4">
            No recent notes
          </p>
        )}
        {notes.map((n) => {
          const mins = n.expiresAt
            ? Math.max(0, Math.round((n.expiresAt - Date.now()) / 60000))
            : null;
          return (
            <div
              key={n._id}
              className="p-2 border border-border rounded-lg bg-white"
            >
              <h3 className="text-xs font-medium truncate">
                {n.title || "Untitled"}
              </h3>
              <p className="text-[10px] text-text-secondary truncate mt-0.5">
                {(n.content || "").replace(/[#*[\]>]/g, "").slice(0, 80)}
              </p>
              {mins !== null && (
                <span
                  className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded ${
                    mins <= 0
                      ? "bg-red-50 text-red-500"
                      : "bg-accent-light text-accent"
                  }`}
                >
                  {mins <= 0 ? "expired" : `${mins}m left`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleUnpair}
        className="flex items-center justify-center gap-1.5 border border-red-200 text-red-500 rounded-lg px-3 py-1.5 text-[11px] font-medium hover:bg-red-50 transition-colors mt-1"
      >
        <Trash2 size={11} />
        Unpair
      </button>
    </div>
  );
}

export function App() {
  const [paired, setPaired] = useState<boolean | null>(null);

  useEffect(() => {
    getPairStatus().then((res) => {
      setPaired(res.success && res.paired);
    });
  }, []);

  if (paired === null) {
    return (
      <div className="flex items-center justify-center h-screen text-xs text-text-secondary">
        Loading...
      </div>
    );
  }

  return paired ? (
    <MainScreen onUnpaired={() => setPaired(false)} />
  ) : (
    <PairScreen onPaired={() => setPaired(true)} />
  );
}
