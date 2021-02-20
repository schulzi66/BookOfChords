import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  public bpmFormControl: FormControl;

  constructor(public readonly toneService: ToneService) {
    this.playModeIcon = 'play_arrow';
    this.soundModeIcon = 'volume_up';
    this.isPlayMode = false;
    this.isTick = false;
  }

  public get isValid(): boolean {
    return this.bpmFormControl.valid;
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this._defaultBpm;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
    }
    this.bpmFormControl = new FormControl({ value: this.bpm, disabled: this.sliderDisabled }, [
      Validators.required,
      Validators.min(40),
      Validators.max(200)
    ]);
    if (this.showSoundMode) {
      this.toneService.isMuted$.subscribe((muted: boolean) => {
        muted ? (this.soundModeIcon = 'volume_off') : (this.soundModeIcon = 'volume_up');
      });
      this.showSoundMode ? this.toneService.unmute() : this.toneService.mute();
    }
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

  public changeSpeed(speed: number): void {
    if (this.isPlayMode) {
      this.stopMetronome();
    }
    this.bpm = speed;
    this.bpmFormControl.setValue(this.bpm);
    if (this.showSoundMode) {
      this.toneService.changeSpeed(this.bpm);
    }
    if (this.isPlayMode) {
      this.startMetronome();
    }
    this.onBpmChanged.emit(this.bpm);
  }

  public startMetronome(): void {
    if (this.showSoundMode) {
      this.toneService.start(this.bpm);
    } else {
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
