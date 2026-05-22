import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { formatDate } from "../lib/utils";
import type { NoteId } from "../types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface CalendarPageProps {
  onSelectNote: (id: NoteId) => void;
}

export function CalendarPage({ onSelectNote }: CalendarPageProps) {
  const notes = useQuery(api.notes.list, {}) ?? [];
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const goPrev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setSelectedDay(null); };
  const goNext = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setSelectedDay(null); };

  const today = new Date();
  const isToday = (d: number) => year === today.getFullYear() && month === today.getMonth() && d === today.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay();
  const weeks: (number | null)[][] = [];
  let day = 1;
  for (let w = 0; w < 6; w++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < startDow) || day > daysInMonth) week.push(null);
      else week.push(day++);
    }
    weeks.push(week);
    if (day > daysInMonth) break;
  }

  const notesByDay = useMemo(() => {
    const map: Record<number, any[]> = {};
    for (const note of notes) {
      const d = new Date(note.updatedAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate();
        if (!map[dayNum]) map[dayNum] = [];
        map[dayNum].push(note);
      }
    }
    return map;
  }, [notes, year, month]);

  const dayNotes = selectedDay ? notesByDay[selectedDay] || [] : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-3 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text)]">
            {MONTHS[month]} {year}
          </h1>
          <div className="flex gap-1">
            <button onClick={goPrev} className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => { const n = new Date(); setYear(n.getFullYear()); setMonth(n.getMonth()); setSelectedDay(null); }} className="rounded-lg px-2 py-1.5 text-xs text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors font-medium">Today</button>
            <button onClick={goNext} className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider border-b border-[var(--color-border-subtle)]">
            {DAYS.map(d => <div key={d} className="py-2">{d}</div>)}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-[var(--color-border-subtle)] last:border-b-0">
              {week.map((d, di) => (
                <button
                  key={di}
                  onClick={() => d && setSelectedDay(d === selectedDay ? null : d)}
                  disabled={!d}
                  className={`relative min-h-[48px] md:min-h-[56px] p-1 text-xs transition-colors border-r border-[var(--color-border-subtle)] last:border-r-0 ${
                    d === selectedDay
                      ? "bg-[var(--color-accent-light)]"
                      : d ? "hover:bg-[var(--color-surface-subtle)]" : ""
                  } ${d ? "text-[var(--color-text)]" : ""}`}
                >
                  {d && (
                    <>
                      <span className={`inline-flex items-center justify-center w-7 h-7 text-xs rounded-full ${
                        d === selectedDay ? "bg-[var(--color-accent)] text-white font-semibold" : isToday(d) ? "border border-[var(--color-accent)] text-[var(--color-accent)] font-semibold" : ""
                      }`}>
                        {d}
                      </span>
                      {notesByDay[d]?.length > 0 && (
                        <div className="flex justify-center gap-0.5 mt-0.5">
                          {notesByDay[d].slice(0, 5).map((_: any, i: number) => (
                            <span key={i} className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {selectedDay && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-[var(--color-text)] mb-2">
              {MONTHS[month]} {selectedDay}, {year}
            </h2>
            {dayNotes.length === 0 ? (
              <p className="text-xs text-[var(--color-text-tertiary)] py-4 text-center">No notes on this day.</p>
            ) : (
              <div className="space-y-1">
                {dayNotes.map((note: any) => (
                  <button
                    key={note._id}
                    onClick={() => onSelectNote(note._id)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-border-subtle)]"
                  >
                    <FileText size={14} className="shrink-0 text-[var(--color-text-tertiary)]" />
                    <span className="text-sm text-[var(--color-text)] truncate flex-1">{note.title || "Untitled"}</span>
                    <span className="text-[10px] text-[var(--color-text-tertiary)]">{new Date(note.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
