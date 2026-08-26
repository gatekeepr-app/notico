import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { registerSW } from "virtual:pwa-register";
import { api } from "../../convex/_generated/api";
import { useToast } from "./Toast";
import { useAuth } from "./auth/AuthProvider";
import { clearExpiredQueuedNoteOps, deleteQueuedNoteOp, getQueuedNoteOps } from "../lib/offlineNotes";

export function PwaManager() {
  const { token } = useAuth();
  const { toast } = useToast();
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const removeNote = useMutation(api.notes.remove);
  const [updateReady, setUpdateReady] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateReady(() => () => updateSW(true));
        toast("New Notico version ready");
      },
      onOfflineReady() {
        toast("Notico is ready offline");
      },
    });
  }, [toast]);

  useEffect(() => {
    const sync = async () => {
      if (!token || !navigator.onLine) return;
      await clearExpiredQueuedNoteOps();
      const ops = await getQueuedNoteOps();
      for (const op of ops) {
        if (op.type === "create") await createNote({ title: op.title, content: op.content, tags: op.tags, token });
        if (op.type === "update") await updateNote({ noteId: op.noteId, title: op.title, content: op.content, tags: op.tags, isPinned: op.isPinned, isPublished: op.isPublished, token });
        if (op.type === "remove") await removeNote({ noteId: op.noteId, token });
        await deleteQueuedNoteOp(op.id);
      }
      if (ops.length) toast(`Synced ${ops.length} offline ${ops.length === 1 ? "change" : "changes"}`);
    };
    const onOnline = () => { toast("Back online"); void sync(); };
    const onOffline = () => toast("Offline: notes will sync later");
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    void sync();
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [createNote, removeNote, toast, token, updateNote]);

  if (!updateReady) return null;

  return (
    <div className="fixed inset-x-3 bottom-18 z-50 mx-auto flex max-w-sm flex-col gap-2 md:bottom-4">
      {updateReady && (
        <button
          onClick={() => void updateReady()}
          className="rounded-2xl border border-[#123d83]/20 bg-[#fff9ed] px-4 py-3 text-sm font-black text-[#123d83] shadow-xl shadow-[#123d83]/10"
        >
          Refresh for latest version
        </button>
      )}
    </div>
  );
}
