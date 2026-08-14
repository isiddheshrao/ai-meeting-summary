import { useEffect, useRef } from "react";
import type { Meeting } from "../types";
import { buildDayStrip } from "../lib/dateGroups";

export function DateStrip({
  meetings,
  selectedKey,
  onSelectDay,
}: {
  meetings: Meeting[];
  selectedKey: string | null;
  onSelectDay: (key: string | null) => void;
}) {
  const days = buildDayStrip(meetings);
  const todayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  return (
    <div className="flex gap-1.5 overflow-x-auto px-3 py-3 border-b border-zinc-200 scrollbar-thin">
      {days.map((day) => {
        const isSelected = selectedKey === day.key;
        return (
          <button
            key={day.key}
            ref={day.isToday ? todayRef : undefined}
            onClick={() => onSelectDay(isSelected ? null : day.key)}
            className={`flex flex-col items-center justify-center shrink-0 w-11 h-14 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isSelected
                ? "bg-indigo-600 text-white"
                : day.isToday
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <span
              className={`text-[10px] font-medium uppercase tracking-wide ${
                isSelected ? "text-indigo-100" : "text-zinc-400"
              }`}
            >
              {day.weekday}
            </span>
            <span className="text-sm font-semibold tabular-nums mt-0.5">{day.dayNumber}</span>
            <span
              className={`mt-0.5 w-1 h-1 rounded-full ${
                day.hasMeetings ? (isSelected ? "bg-white" : "bg-indigo-500") : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
