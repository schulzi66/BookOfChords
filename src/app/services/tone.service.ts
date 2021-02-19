import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Observable, BehaviorSubject } from 'rxjs';
import { Player, Transport, start } from 'tone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToneService extends SubscriptionHandler {
  private _player: Player;
  private _isMuted$: BehaviorSubject<boolean>;
  private _initialized: boolean;

  constructor() {
    super();
    this._player = new Player('../../assets/sounds/up.wav').toDestination();
    this._initialized = false;
    this._isMuted$ = new BehaviorSubject(false);
    this._subscriptions$.add(
      this.isMuted$.subscribe((value) => {
        this._player.mute = value;
      })
    );
  }

  public get isMuted$(): Observable<boolean> {
    return this._isMuted$.asObservable();
  }

  public async start(bpm: number): Promise<void> {
    await start();
    this.changeSpeed(bpm);
    if (!this._initialized) {
      Transport.scheduleRepeat((time: number) => {
        this._player.start(time);
      }, '4n');
      this._initialized = true;
    }
    Transport.start();
  }

  public stop(): void {
    Transport.stop();
  }

  public toggleMute(): void {
    this._isMuted$.next(!this._player.mute);
  }

  public mute(): void {
    this._isMuted$.next(true);
  }

  public unmute(): void {
    this._isMuted$.next(false);
  }

  public changeSpeed(bpm: number): void {
    Transport.bpm.value = bpm;
  }
}
