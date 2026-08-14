import type { Meeting } from "../types";
import { CaptureControls } from "./CaptureControls";
import { PasteTranscript } from "./PasteTranscript";
import { UsersIcon } from "./icons";

export function MeetingDetail({
  meeting,
  onRecordingReady,
  onTranscriptPasted,
}: {
  meeting: Meeting;
  onRecordingReady: (blob: Blob) => void;
  onTranscriptPasted: (text: string) => void;
}) {
  const hasEnded = new Date(meeting.end) < new Date();

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">{meeting.title}</h2>
      <p className="text-sm text-zinc-500 mt-1 tabular-nums">
        {new Date(meeting.start).toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
        {" – "}
        {new Date(meeting.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
      </p>
      {meeting.attendees.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 text-sm text-zinc-500">
          <UsersIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">{meeting.attendees.join(", ")}</span>
        </div>
      )}
      <div className="mt-4">
        {hasEnded ? (
          <PasteTranscript onSubmit={onTranscriptPasted} />
        ) : (
          <CaptureControls onRecordingReady={onRecordingReady} />
        )}
      </div>
    </div>
  );
}
