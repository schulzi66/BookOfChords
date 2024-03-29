importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '149787186867',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    var notificationTitle = payload.data.title;
    var notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        data: {
            url: payload.data.click_action,
        },
        actions: [
            {
                action: 'open_url',
                title: 'Anzeigen',
            },
        ],
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener(
    'notificationclick',
    function (event) {
        event.notification.close();
        clients.openWindow(event.notification.data.url);
    },
    false,
);
