export type RootStackParamList = {
  Signup: undefined;
  Signin: undefined;
  Home: undefined;
  Loading: undefined;
};

export interface User {
  userId: string;
  email: string;
  name: string;
}

export enum Collections {
  USERS = 'users',
}
