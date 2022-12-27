import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user';
import { SubscriptionHandler } from './../shared/helper/subscription-handler';

@Injectable({ providedIn: 'root' })
export class AuthService extends SubscriptionHandler implements OnDestroy {
    public user$: Observable<User>;
    public user: User;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
        super();
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            }),
        );
        this._subscriptions$.add(
            this.user$.subscribe((user: User) => {
                this.user = user;
            }),
        );
    }

    public ngOnDestroy(): void {
        this.user$ = null;
        super.ngOnDestroy();
    }

    public async googleSignIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        await this.oAuthLogin(provider);
        this.router.navigate(['/songs']);
    }

    private async oAuthLogin(provider) {
        const credential = await this.afAuth.signInWithPopup(provider);
        return await this.updateUserData(
            credential.user.uid,
            credential.user.email,
            (credential.additionalUserInfo.profile as any).name === undefined
                ? credential.user.displayName
                : (credential.additionalUserInfo.profile as any).name,
            credential.user.photoURL,
        );
    }

    private updateUserData(uid: string, email: string, displayName: string, photoURL: string): Promise<void> {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

        const data = {
            uid,
            email,
            displayName,
            photoURL,
        };

        return userRef.set(data, { merge: true });
    }

    public updateBandIdsForUserId(uid: string, bandIds: Array<string>): void {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
        userRef.update({
            bandIds: bandIds,
        });
    }

    public async signOut() {
        await this.afAuth.signOut();
        void this.router.navigate(['/login']);
        location.reload();
    }
}
