// This file exports TypeScript types and interfaces used throughout the application.

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}

export interface Match {
  userId: string;
  matchedUserId: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface Profile {
  userId: string;
  interests: string[];
  questions: Record<string, string>;
}