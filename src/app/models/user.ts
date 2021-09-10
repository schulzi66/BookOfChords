export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  bandId?: string;
  bandIds?: Array<string>;

  fcmTokens?: { [token: string]: true };
}
