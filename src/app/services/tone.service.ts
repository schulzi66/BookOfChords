import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Observable, BehaviorSubject } from 'rxjs';
import { Player, Transport, start } from 'tone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToneService extends SubscriptionHandler {
  private _player: Player;
  private _countInPlayer: Player;
  private _isMuted$: BehaviorSubject<boolean>;
  private _mainScheduleId: number;
  private _countInScheduleId: number;

  constructor() {
    super();
    this._player = new Player('../../assets/sounds/up.wav').toDestination();
    this._countInPlayer = new Player('../../assets/sounds/down.wav').toDestination();
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

  public async start(bpm: number, countIn?: number): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await start();
      this.changeSpeed(bpm);
      if (countIn) {
        this._countInScheduleId = Transport.scheduleRepeat(
          (time: number) => {
            this._countInPlayer.start(time);
          },
          '4n',
          0,
          countIn + 'm'
        );

        Transport.scheduleOnce(() => {
          resolve();
        }, countIn + 'm');

        this._mainScheduleId = Transport.scheduleRepeat(
          (time: number) => {
            this._player.start(time);
          },
          '4n',
          countIn + 'm'
        );
      } else {
        this._mainScheduleId = Transport.scheduleRepeat((time: number) => {
          this._player.start(time);
        }, '4n');
        resolve();
      }
      Transport.start();
    });
  }

  public stop(): void {
    Transport.clear(this._mainScheduleId);
    Transport.clear(this._countInScheduleId);
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
