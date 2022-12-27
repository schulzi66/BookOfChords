import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Subject } from 'rxjs';
import { User } from './../models/user';

@Injectable({ providedIn: 'root' })
export class MessagingService {
    private messageSource = new Subject();
    public currentMessage$ = this.messageSource.asObservable();

    constructor(private angularFirestore: AngularFirestore, private _angularFireMessaging: AngularFireMessaging) {}

    /**
     * getPermission
     */
    public getPermission(user: User): void {
        this._angularFireMessaging.requestToken.subscribe(
            token => {
                this.saveToken(user, token);
            },
            error => {
                console.log(error, 'Unable to get permisson to notify');
            },
        );
    }

    /**
     * receiveMessages
     */
    public receiveMessages() {
        this._angularFireMessaging.onMessage(payload => this.messageSource.next(payload));
    }

    private saveToken(user: User, token: string) {
        const currentTokens = user.fcmTokens || {};

        if (!currentTokens[token]) {
            const userRef = this.angularFirestore.collection('users').doc(user.uid);
            const tokens = { ...currentTokens, [token]: true };
            userRef.update({ fcmTokens: tokens });
        }
    }
}
