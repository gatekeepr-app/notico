interface MessageResponse {
  success: boolean;
  error?: string;
  notes?: Note[];
  tags?: Tag[];
  folders?: Folder[];
  result?: unknown;
  userId?: string;
  paired?: boolean;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  expiresAt?: number;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Folder {
  _id: string;
  name: string;
}

export function send(message: Record<string, unknown>): Promise<MessageResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (res) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(res || { success: false, error: "No response" });
      }
    });
  });
}

export async function getPairStatus() {
  return send({ type: "GET_PAIR_STATUS" });
}

export async function pairExtension(code: string) {
  return send({ type: "PAIR_EXTENSION", code });
}

export async function unpairExtension() {
  return send({ type: "UNPAIR_EXTENSION" });
}

export async function saveQuickNote(title: string, content: string, tags?: string[], folderId?: string) {
  return send({ type: "SAVE_QUICK_NOTE", title, content, tags, folderId });
}

export async function getNotes() {
  return send({ type: "GET_NOTES" });
}

export async function getTags() {
  return send({ type: "GET_TAGS" });
}

export async function getFolders() {
  return send({ type: "GET_FOLDERS" });
}
