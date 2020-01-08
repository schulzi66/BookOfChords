import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { User } from './../models/user';

@Injectable({providedIn: 'root'})
export class MessagingService {        

    private firebaseMessaging = firebase.messaging();


    private messageSource = new Subject();
    public currentMessage$ = this.messageSource.asObservable();

    constructor(private angularFirestore: AngularFirestore) {}

    /**
     * getPermission
     */
    public getPermission(user: User): void {
        this.firebaseMessaging.requestPermission()
        .then(() => {
            console.log('notification permisson granted');
            return this.firebaseMessaging.getToken();            
        })
        .then(token => {
            console.log(token);
            this.saveToken(user, token);            
        })
        .catch((error) => {
            console.log(error, 'Unable to get permisson to notify');
        });        
    }

    /**
     * monitorRefresh
     */
    public monitorRefresh(user: User) {
        this.firebaseMessaging.onTokenRefresh(() => {
            this.firebaseMessaging.getToken().then(refreshedToken => {
                console.log('Token refreshed');
                this.saveToken(user, refreshedToken);                
            }).catch((error) => {
                console.log(error, 'Unable to retrieve new token');                
            });
        });
    }

    /**
     * receiveMessages
     */
    public receiveMessages() {
        this.firebaseMessaging.onMessage(payload => {
            console.log(payload);
            this.messageSource.next(payload);
        })
    }

    private saveToken(user: User, token: string) {
        const currentTokens = user.fcmTokens || { };

        if(!currentTokens[token]) {
            const userRef = this.angularFirestore.collection('users').doc(user.uid);
            const tokens = { ...currentTokens, [token]: true };
            userRef.update({ fcmTokens: tokens });
        }

    }
    
}