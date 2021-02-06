import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'shared-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit, OnDestroy {
  private readonly defaultBpm: number = 40;
  private readonly minuteInMs: number = 60000;
  private timerHandle: number;

  @Input('showPlay') showPlay: boolean = true;
  @Input('bpm') bpm: number;
  @Input('sliderDisabled') sliderDisabled: boolean;
  @Input('subtitle') _subtitle: string;

  @ViewChild('bpmSlider') bpmSlider: ElementRef;
  @ViewChild('playBtn') playBtn: ElementRef;

  @Output('onBpmChanged') onBpmChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output('onStart') onStart: EventEmitter<void> = new EventEmitter<void>();
  @Output('onStop') onStop: EventEmitter<void> = new EventEmitter<void>();

  public playModeIcon: string = 'play_arrow';
  public isPlayMode: boolean;
  public isTick: boolean;

  public get subtitle(): string {
    return this._subtitle === undefined ? 'BPM' : this._subtitle;
  }

  constructor() {
    this.isPlayMode = false;
    this.isTick = false;
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this.defaultBpm;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
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
    if (this.isPlayMode) {
      this.startMetronome();
    }
    this.onBpmChanged.emit(this.bpm);
  }

  private startMetronome(): void {
    this.timerHandle = window.setInterval(() => {
      this.tick();
    }, this.minuteInMs / this.bpm);
    this.playModeIcon = 'pause';
  }

  private stopMetronome(): void {
    window.clearInterval(this.timerHandle);
    this.playModeIcon = 'play_arrow';
  }

  private tick(): void {
    this.isTick = true;
    window.setTimeout(() => {
      this.isTick = false;
    }, 100);
  }
}
