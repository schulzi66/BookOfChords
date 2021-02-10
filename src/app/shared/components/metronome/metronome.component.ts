import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ToneService } from 'src/app/services/tone.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'shared-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit, OnDestroy {
  @Input('subtitle') private _subtitle: string;
  private readonly _defaultBpm: number = 40;
  private readonly _minuteInMs: number = 60000;
  private _timerHandle: number;

  @Input('showPlay') public showPlay: boolean = true;
  @Input('showSoundMode') public showSoundMode: boolean = false;
  @Input('bpm') public bpm: number;
  @Input('sliderDisabled') public sliderDisabled: boolean;

  @ViewChild('bpmSlider') public bpmSlider: ElementRef;
  @ViewChild('playBtn') public playBtn: ElementRef;

  @Output('onBpmChanged') public onBpmChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output('onStart') public onStart: EventEmitter<void> = new EventEmitter<void>();
  @Output('onStop') public onStop: EventEmitter<void> = new EventEmitter<void>();

  public playModeIcon: string;
  public soundModeIcon: string;
  public isPlayMode: boolean;
  public isTick: boolean;

  constructor(private readonly _toneService: ToneService) {
    this.playModeIcon = 'play_arrow';
    this.soundModeIcon = 'volume_up';
    this.isPlayMode = false;
    this.isTick = false;
  }

  public get subtitle(): string {
    return this._subtitle === undefined ? 'BPM' : this._subtitle;
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this._defaultBpm;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
    }
    this._toneService.isMuted$.subscribe((muted: boolean) => {
      muted ? (this.soundModeIcon = 'volume_off') : (this.soundModeIcon = 'volume_up');
    });
  }

  ngOnDestroy(): void {
    this.stopMetronome();
  }

  public togglePlayMode(): void {
    this.isPlayMode = !this.isPlayMode;
    if (this.isPlayMode) {
      this.onStart.emit();
      this.startMetronome();
    } else {
      this.onStop.emit();
      this.stopMetronome();
    }
  }

  public toggleSoundMode(): void {
    this._toneService.toggleMute();
  }

  public changeSpeed(speed: number): void {
    if (this.isPlayMode) {
      this.stopMetronome();
    }
    this.bpm = speed;
    this._toneService.changeSpeed(this.bpm);
    if (this.isPlayMode) {
      this.startMetronome();
    }
    this.onBpmChanged.emit(this.bpm);
  }

  private startMetronome(): void {
    if (this.showSoundMode) {
      this._toneService.start(this.bpm);
    }
    this._timerHandle = window.setInterval(() => {
      this.tick();
    }, this._minuteInMs / this.bpm);
    this.playModeIcon = 'pause';
  }

  private stopMetronome(): void {
    if (this.showSoundMode) {
      this._toneService.stop();
    }
    window.clearInterval(this._timerHandle);
    this.playModeIcon = 'play_arrow';
  }

  private tick(): void {
    this.isTick = true;
    window.setTimeout(() => {
      this.isTick = false;
    }, 100);
  }
}
