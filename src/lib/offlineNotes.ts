import type { NoteId } from "../types";

export type OfflineNoteOp =
  | { id: string; type: "create"; title: string; content?: string; tags?: string[]; createdAt: number; expiresAt: number }
  | { id: string; type: "update"; noteId: NoteId; title?: string; content?: string; tags?: string[]; isPinned?: boolean; isPublished?: boolean; createdAt: number; expiresAt: number }
  | { id: string; type: "remove"; noteId: NoteId; createdAt: number; expiresAt: number };

type OfflineNoteInput =
  | { type: "create"; title: string; content?: string; tags?: string[] }
  | { type: "update"; noteId: NoteId; title?: string; content?: string; tags?: string[]; isPinned?: boolean; isPublished?: boolean }
  | { type: "remove"; noteId: NoteId };

const dbName = "notico-offline";
const storeName = "note-ops";
const maxAgeMs = 10 * 60 * 1000;

function clampText(value: string | undefined, max: number) {
  return value ? value.slice(0, max) : value;
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function store(mode: IDBTransactionMode) {
  const db = await openDb();
  return db.transaction(storeName, mode).objectStore(storeName);
}

export async function queueNoteOp(op: OfflineNoteInput) {
  const objectStore = await store("readwrite");
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const safeOp = {
    ...op,
    title: "title" in op ? clampText(op.title, 200) : undefined,
    content: "content" in op ? clampText(op.content, 20000) : undefined,
  };
  return new Promise<void>((resolve, reject) => {
    const createdAt = Date.now();
    const request = objectStore.put({ ...safeOp, id, createdAt, expiresAt: createdAt + maxAgeMs });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getQueuedNoteOps() {
  const objectStore = await store("readonly");
  return new Promise<OfflineNoteOp[]>((resolve, reject) => {
    const request = objectStore.getAll();
    request.onsuccess = () => resolve((request.result as OfflineNoteOp[]).sort((a, b) => a.createdAt - b.createdAt));
    request.onerror = () => reject(request.error);
  });
}

export async function clearExpiredQueuedNoteOps() {
  const ops = await getQueuedNoteOps();
  const expired = ops.filter((op) => op.expiresAt <= Date.now());
  await Promise.all(expired.map((op) => deleteQueuedNoteOp(op.id)));
}

export async function deleteQueuedNoteOp(id: string) {
  const objectStore = await store("readwrite");
  return new Promise<void>((resolve, reject) => {
    const request = objectStore.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
