export type RootStackParamList = {
  Signup: undefined;
  Signin: undefined;
  Home: undefined;
  Loading: undefined;
  Chat: {
    userIds: string[];
    other: User;
  };
};

export interface User {
  userId: string;
  email: string;
  name: string;
  profileUrl?: string;
}

export enum Collections {
  USERS = 'users',
  CHATS = 'chats',
  MESSAGES = 'messages',
}

export interface Chat {
  id: string;
  userIds: string[];
  users: User[];
}

export interface Message {
  id: string;
  user: User;
  text: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  createdAt: Date;
}

export interface FirestoreMessageData {
  text: string;
  user: User;
  createdAt: Date;
}
