import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

exports.sendSetlistNotification = functions.firestore.document('/bands/{id}').onWrite(event => {
    const bandBefore = event.before.data();
    const bandAfter = event.after.data();

    //setlist has been added
    if (bandBefore && bandAfter && bandBefore.setlists.length < bandAfter.setlists.length) {
        const setlistId = bandAfter.setlists[bandAfter.setlists.length - 1].id;
        const url = setlistId
            ? `https://book-of-chords.firebaseapp.com/band/setlist/edit/${setlistId}`
            : 'https://book-of-chords.firebaseapp.com/band/';
        const payload = {
            data: {
                title: 'Neue Setlist!',
                body: 'Eine neue Setliste wurde angelegt',
                icon: 'https://book-of-chords.firebaseapp.com/assets/icons/icon-152x152.png',
                click_action: url,
            },
        };
        //get all token of band members to send notifications
        bandAfter['members'].forEach((member: any) => {
            admin
                .firestore()
                .collection('users')
                .doc(member.uid)
                .get()
                .then(snapshot => snapshot.data())
                .then(user => {
                    let tokens: any;
                    if (user && user.fcmTokens !== undefined) {
                        tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];
                    } else {
                        tokens = [];
                    }

                    if (!tokens.length && user) {
                        console.error('User has no token: ' + user.uid);
                        return;
                    }

                    //get correct language for notification
                    admin
                        .firestore()
                        .collection('configurations')
                        .doc(member.uid)
                        .get()
                        .then(snapshot => snapshot.data())
                        .then(config => {
                            if (config && config.lang && config.lang === 'en') {
                                payload.data.title = 'New Setlist!';
                                payload.data.body = 'A new setlist was created';
                            }
                            console.log(`Successful send to user: ${user}, with tokens: ${tokens}`);
                            return admin.messaging().sendToDevice(tokens, payload);
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        });
    }
});
