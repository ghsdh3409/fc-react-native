export type RootStackParamList = {
  Signup: undefined;
};

export interface User {
  userId: string;
  email: string;
  name: string;
}

export enum Collections {
  USERS = 'users',
}
