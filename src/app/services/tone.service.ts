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
  private _isTick: boolean;

  constructor() {
    super();
    this._player = new Player('../../assets/sounds/up.wav').toDestination();
    this._initialized = false;
    this._isTick = false;
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

  public get isTick(): boolean {
    return this._isTick;
  }

  public async start(bpm: number): Promise<void> {
    await start();
    this.changeSpeed(bpm);
    if (!this._initialized) {
      Transport.scheduleRepeat((time: number) => {
        this._isTick = true;
        this._player.start(time);
      }, '4n');
      Transport.scheduleRepeat(
        (_: number) => {
          this._isTick = false;
        },
        '4n',
        '4t'
      );
      this._initialized = true;
    }
    Transport.start();
  }

  public stop(): void {
    Transport.stop();
    this._isTick = false;
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
