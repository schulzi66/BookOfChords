import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user$: Observable<User>;

	constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap((user) => {
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	public googleSignIn() {
		const provider = new auth.GoogleAuthProvider();
		return this.oAuthLogin(provider);
	}

	private async oAuthLogin(provider) {
		const credential = await this.afAuth.auth.signInWithPopup(provider);
		return this.updateUserData(
			credential.user.uid,
			credential.user.email,
			(credential.additionalUserInfo.profile as any).name === undefined
				? credential.user.displayName
				: (credential.additionalUserInfo.profile as any).name,
			credential.user.photoURL
		);
	}

	private updateUserData(uid: string, email: string, displayName: string, photoURL: string) {
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

		const data = {
			uid,
			email,
			displayName,
			photoURL
		};

		return userRef.set(data, { merge: true });
	}

	// private updateUserData({ uid, email, displayName, photoURL }: User) {
	// 	const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

	// 	const data = {
	// 		uid,
	// 		email,
	// 		displayName,
	// 		photoURL
	// 	};

	// 	return userRef.set(data, { merge: true });
	// }

	//Refactor to use the currentUserObject and not make another call!
	public updateBandIdForUserId(uid: string, bandId: string): void {
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
		userRef.update({
			bandId: bandId
		});
	}

	public async signOut() {
		await this.afAuth.auth.signOut();
		return this.router.navigate([ '/' ]);
	}
}
