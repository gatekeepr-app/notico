interface MessageResponse {
  success: boolean;
  error?: string;
  notes?: Note[];
  result?: unknown;
  userId?: string;
  paired?: boolean;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  expiresAt?: number;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
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

export async function saveQuickNote(title: string, content: string) {
  return send({ type: "SAVE_QUICK_NOTE", title, content });
}

export async function getNotes() {
  return send({ type: "GET_NOTES" });
}
