import { Configuration } from 'src/app/models/configuration';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ToneService } from 'src/app/services/tone.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'shared-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit, OnDestroy {
  private readonly _defaultBpm: number = 40;
  private readonly _minuteInMs: number = 60000;
  private _timerHandle: number;
  private _countInBeats: number;

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

  constructor(public readonly toneService: ToneService, private _configurationService: ConfigurationService) {
    this.playModeIcon = 'play_arrow';
    this.soundModeIcon = 'volume_up';
    this.isPlayMode = false;
    this.isTick = false;
  }

  public get isValid(): boolean {
    return this.bpm !== undefined && this.bpm !== null && this.bpm >= 40 && this.bpm <= 240;
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this._defaultBpm;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
    }
    if (this.showSoundMode) {
      this.toneService.isMuted$.subscribe((muted: boolean) => {
        muted ? (this.soundModeIcon = 'volume_off') : (this.soundModeIcon = 'volume_up');
      });
      this.showSoundMode ? this.toneService.unmute() : this.toneService.mute();
    }
    this._configurationService.configuration$.subscribe((configuration: Configuration) => {
      this._countInBeats = configuration.countInBeats;
    });
  }

  ngOnDestroy(): void {
    this.stopMetronome();
  }

  public togglePlayMode(): void {
    this.isPlayMode = !this.isPlayMode;
    if (this.isPlayMode) {
      this.startMetronome();
    } else {
      this.onStop.emit();
      this.stopMetronome();
    }
  }

  public changeSpeed(speed: number): void {
    this.bpm = speed;
    if (this.showSoundMode) {
      this.toneService.changeSpeed(this.bpm);
    }
    this.onBpmChanged.emit(this.bpm);
  }

  public startMetronome(countIn: boolean = true): void {
    if (this.showSoundMode) {
      this.toneService.start(this.bpm, countIn ? this._countInBeats / 2 : null).then(() => this.onStart.emit());
    } else {
      this.onStart.emit();
      this._timerHandle = window.setInterval(() => {
        this.tick();
      }, this._minuteInMs / this.bpm);
    }
    this.playModeIcon = 'pause';
  }

  public stopMetronome(): void {
    this.showSoundMode ? this.toneService.stop() : window.clearInterval(this._timerHandle);
    this.playModeIcon = 'play_arrow';
  }

  private tick(): void {
    this.isTick = true;
    window.setTimeout(() => {
      this.isTick = false;
    }, 100);
  }
}
