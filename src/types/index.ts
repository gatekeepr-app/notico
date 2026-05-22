import type { Doc, Id } from "../../convex/_generated/dataModel";

export type Note = Doc<"notes">;
export type Folder = Doc<"folders">;
export type NoteId = Id<"notes">;
export type FolderId = Id<"folders">;

export interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}
