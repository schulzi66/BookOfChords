import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  public user$: Observable<User>;
  public user: User;

  private _subscriptions$: Subscription;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this._subscriptions$ = new Subscription();

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this._subscriptions$.add(
      this.user$.subscribe((user: User) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.user$ = null;
    this._subscriptions$.unsubscribe();
  }

  public async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    await this.oAuthLogin(provider);
    this.router.navigate(['/songs']);
  }

  public async anonymSignIn() {
    const credential = await this.afAuth.signInAnonymously();
    await this.updateUserData(credential.user.uid, null, 'Anonymous', null);
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
      credential.user.photoURL
    );
  }

  private updateUserData(uid: string, email: string, displayName: string, photoURL: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }

  // Refactor to use the currentUserObject and not make another call!
  public updateBandIdForUserId(uid: string, bandId: string): void {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    userRef.update({
      bandId: bandId
    });
  }

  public async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }
}
