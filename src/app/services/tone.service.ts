import { Player, Transport, start } from 'tone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToneService {
  private _player: Player;
  private _initialized: boolean;

  constructor() {
    this._player = new Player('../../assets/sounds/up.wav').toDestination();
    this._initialized = false;
  }

  public start(bpm: number): void {
    start();
    this.changeSpeed(bpm);
    if (!this._initialized) {
      Transport.scheduleRepeat(
        (time: number) => {
          this._player.start(time);
        },
        '4n',
        '.2s'
      );
      this._initialized = true;
    }
    Transport.start();
  }

  public stop(): void {
    Transport.stop();
  }

  public mute(): void {
    this._player.mute = !this._player.mute;
  }

  public changeSpeed(bpm: number): void {
    Transport.bpm.value = bpm;
  }
}
