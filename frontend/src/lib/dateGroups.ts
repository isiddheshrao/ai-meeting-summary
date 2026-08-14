import type { Meeting } from "../types";

export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dayKey(iso) === dayKey(today.toISOString())) return "Today";
  if (dayKey(iso) === dayKey(tomorrow.toISOString())) return "Tomorrow";
  if (dayKey(iso) === dayKey(yesterday.toISOString())) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export interface MeetingGroup {
  key: string;
  label: string;
  isToday: boolean;
  isPast: boolean;
  meetings: Meeting[];
}

export function groupMeetingsByDay(meetings: Meeting[]): MeetingGroup[] {
  const todayKey = dayKey(new Date().toISOString());
  const groups = new Map<string, MeetingGroup>();

  for (const m of meetings) {
    const key = dayKey(m.start);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: dayLabel(m.start),
        isToday: key === todayKey,
        isPast: new Date(m.start) < new Date() && key !== todayKey,
        meetings: [],
      });
    }
    groups.get(key)!.meetings.push(m);
  }

  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.meetings[0].start).getTime() - new Date(b.meetings[0].start).getTime()
  );
}

export interface DayStripEntry {
  key: string;
  date: Date;
  weekday: string;
  dayNumber: number;
  isToday: boolean;
  hasMeetings: boolean;
}

export function buildDayStrip(meetings: Meeting[], rangeDays = 7): DayStripEntry[] {
  const meetingKeys = new Set(meetings.map((m) => dayKey(m.start)));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const entries: DayStripEntry[] = [];

  for (let offset = -rangeDays; offset <= rangeDays; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const key = dayKey(date.toISOString());
    entries.push({
      key,
      date,
      weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
      dayNumber: date.getDate(),
      isToday: offset === 0,
      hasMeetings: meetingKeys.has(key),
    });
  }

  return entries;
}
