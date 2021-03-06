export interface User {
	uid: string;
	email: string;
	photoURL?: string;
	displayName?: string;
    bandId?: string;
    
    fcmTokens?: { [token: string]: true };
}
