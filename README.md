## Book of Chords
Small mobile optimized progressive web app to add and quickly edit chords for songs so that you have them always in your pocket and not on paper. It is hosted with Firebase and can be found on: https://book-of-chords.firebaseapp.com/

## Features
- Login/Logout using your Google account
- Create/delete/modify Songs, add different sections with chords
- Search for Songs by name
- Metronome: Set the BPM for each song and have an integrated metronome 
- Upload pictures or PDF files to songs from your filesystem or directly from the camera. (Opt. on pc: drag and drop multiple files at the same time)
- Integrated PDF reader to access the pdf files you uploaded for the song
- Create Gigs, select from all your songs or filter by name
- Delete gigs
- Reorder the songs for your gig
- See and modify the chords and pictures from each song in your gig
- Play Mode for Gigs: See your chords or lyrics and metronome all at once, without toggling the songs to open
- Configure the font size and family for your chords for the best view on stage
- Install the PWA to have a native app experience
- Create or join a band
- Manage the band profile, members and more
- Upload setlists and share them with your band members
- Native notifications with FCM across multiple devices
- Automapping of your songs and chords to the songs of a setlist

## Open/potential features
```
- Enter a url to external page as chords as link and not text
```

## Known issues
```
- FIXED ✔: Updating chords of a song, without removing and readding the song to a gig, still shows old chords inside the gig view
- Open 🏗: Deleting a song does not remove the song from the gigs containing the removed song. 
- Open 🏗: Konzertmeister integration currently not working due to CORS restrictions of Konzertmeister
```

## Setup

You need to enter you firebase keys to environment.ts

```
git clone <this-repo>
npm i
ng s
```
