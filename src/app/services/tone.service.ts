import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Injectable({
  providedIn: 'root'
})
export class ToneService extends SubscriptionHandler {
  private _isMuted$: BehaviorSubject<boolean>;
  private _isMuted: boolean;
  private _audioContext: AudioContext = null;
  private _unlocked: boolean = false;
  private _current16thNote: number; // What note is currently last scheduled?
  private _tempo: number = 120.0; // tempo (in beats per minute)
  private _lookahead: number = 25.0; // How frequently to call scheduling function
  private _scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec)
  private _nextNoteTime: number = 0.0; // when the next note is due.
  private _noteResolution: number = 2; // 0 == 16th, 1 == 8th, 2 == quarter note
  private _noteLength: number = 0.05; // length of "beep" (in seconds)
  private _notesInQueue = Array<{ note: number; time: number }>(); // the notes that have been put into the web audio,
  private _toneWorker: Worker = null; // The Web Worker used to fire timer messages
  private _osc: OscillatorNode;

  public constructor() {
    super();
    this._isMuted$ = new BehaviorSubject(false);
    this._subscriptions$.add(
      this.isMuted$.subscribe((value) => {
        this._isMuted = value;
      })
    );

    this._toneWorker = new Worker(new URL('./tone.worker', import.meta.url), { type: 'module' });
    this._toneWorker.onmessage = ({ data }) => {
      if (data == 'tick') {
        this.scheduler();
      }
    };
    this._toneWorker.postMessage({ interval: this._lookahead });
  }

  public get isMuted$(): Observable<boolean> {
    return this._isMuted$.asObservable();
  }

  public async start(bpm: number): Promise<void> {
    this._audioContext = new AudioContext();
    this._tempo = bpm;

    return new Promise<void>(async (resolve) => {
      if (!this._unlocked) {
        // play silent buffer to unlock the audio
        let buffer = this._audioContext.createBuffer(1, 1, 22050);
        let node = this._audioContext.createBufferSource();
        node.buffer = buffer;
        node.start(0);
        this._unlocked = true;
      }
      // start playing
      this._current16thNote = 0;
      this._nextNoteTime = this._audioContext.currentTime;
      this._toneWorker.postMessage('start');

      resolve();
    });
  }

  public pause(): void {
    this.stop();
  }

  public continue(): void {
    this._toneWorker.postMessage('start');
  }

  public stop(): void {
    this._toneWorker.postMessage('stop');
  }

  public toggleMute(): void {
    this._isMuted$.next(!this._isMuted);
  }

  public mute(): void {
    this._isMuted$.next(true);
  }

  public unmute(): void {
    this._isMuted$.next(false);
  }

  public changeSpeed(bpm: number): void {
    this._tempo = bpm;
  }

  public isValidBpm(bpm: number): boolean {
    return bpm !== undefined && bpm !== null && bpm >= 40 && bpm <= 300;
  }

  private scheduler(): void {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this._nextNoteTime < this._audioContext.currentTime + this._scheduleAheadTime) {
      this.scheduleNote(this._current16thNote, this._nextNoteTime);
      this.nextNote();
    }
  }

  private scheduleNote(beatNumber: number, time: number): void {
    // push the note on the queue, even if we're not playing.
    this._notesInQueue.push({ note: beatNumber, time: time });

    if (this._noteResolution == 1 && beatNumber % 2) return; // we're not playing non-8th 16th notes
    if (this._noteResolution == 2 && beatNumber % 4) return; // we're not playing non-quarter 8th notes

    // create an oscillator
    this._osc = this._audioContext.createOscillator();
    this._osc.connect(this._audioContext.destination);

    this._osc.frequency.value = 440.0;

    if (this._isMuted) {
      this._osc.frequency.value = 0;
    }

    this._osc.start(time);
    this._osc.stop(time + this._noteLength);
  }

  private nextNote(): void {
    // Advance current note and time by a 16th note...
    let secondsPerBeat = 60.0 / this._tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    this._nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

    this._current16thNote++; // Advance the beat number, wrap to zero
    if (this._current16thNote == 16) {
      this._current16thNote = 0;
    }
  }
}
