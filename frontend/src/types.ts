export interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
}

export interface MeetingNotes {
  summary: string;
  decisions: string[];
  actionItems: { text: string; owner: string | null }[];
}
