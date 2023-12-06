export interface ThreadParticipant {
  id: number;
  participants_emails: string[];
  last_message_content: string;
  last_message_user: string;
}

export interface Message {
  id: number;
  content: string;
  content_type: string;
  upload: string;
  timestamp: string;
  thread: number;
  user: number;
}

export enum MessageType {
  Text = "text",
  Image = "image",
  Voice = "voice",
}
