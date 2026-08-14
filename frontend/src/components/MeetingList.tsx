import type { Meeting } from "../types";
import { groupMeetingsByDay } from "../lib/dateGroups";
import { MEETING_LIST } from "../lib/copy";
import { CalendarIcon } from "./icons";

export function MeetingList({
  meetings,
  selectedId,
  isFiltered,
  onSelect,
}: {
  meetings: Meeting[];
  selectedId: string | null;
  isFiltered: boolean;
  onSelect: (m: Meeting) => void;
}) {
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
          <CalendarIcon className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-700">
          {isFiltered ? MEETING_LIST.emptyTitleFiltered : MEETING_LIST.emptyTitleDefault}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {isFiltered ? MEETING_LIST.emptySubtitleFiltered : MEETING_LIST.emptySubtitleDefault}
        </p>
      </div>
    );
  }

  const groups = groupMeetingsByDay(meetings);
  const now = new Date();

  return (
    <div className="pb-4">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur px-4 py-2 flex items-center gap-2">
            <span
              className={`text-xs font-semibold tracking-wide uppercase ${
                group.isToday ? "text-indigo-600" : group.isPast ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {group.label}
            </span>
            {group.isToday && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
            <span className="text-[11px] text-zinc-300 tabular-nums ml-auto">
              {group.meetings.length}
            </span>
          </div>
          <ul className="divide-y divide-zinc-100">
            {group.meetings.map((m) => {
              const isSelected = m.id === selectedId;
              const hasEnded = new Date(m.end) < now;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => onSelect(m)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                      isSelected ? "bg-indigo-50" : "hover:bg-white"
                    }`}
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? "bg-indigo-600" : hasEnded ? "bg-zinc-200" : "bg-zinc-300"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium truncate ${
                          isSelected ? "text-indigo-900" : hasEnded ? "text-zinc-400" : "text-zinc-800"
                        }`}
                      >
                        {m.title}
                      </span>
                      <span
                        className={`block text-xs mt-0.5 tabular-nums ${
                          hasEnded ? "text-zinc-300" : "text-zinc-400"
                        }`}
                      >
                        {new Date(m.start).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
