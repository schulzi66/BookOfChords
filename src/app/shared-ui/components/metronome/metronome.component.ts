import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('showPlay') showPlay: boolean;
  @Input('bpm') bpm: number;
  @Input('sliderDisabled') sliderDisabled: boolean;
  private readonly defaultBpm: number = 40;
  private readonly minuteInMs: number = 60000;
  private timerHandle: number;

  @ViewChild('bpmSlider') bpmSlider: ElementRef;
  @ViewChild('playBtn') playBtn: ElementRef

  @Output('onBpmChanged') onBpmChanged: EventEmitter<number> = new EventEmitter<number>();

  public playModeIcon: string = 'play_arrow';
  public isPlayMode: boolean;
  public isTick: boolean;

  constructor() {
    this.isPlayMode = false;
    this.isTick = false;
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this.defaultBpm;
    }
    if (!this.showPlay) {
      this.showPlay = true;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
    }
  }

  ngAfterViewInit(): void {
    this.bpmSlider.nativeElement.value = (this.bpm - 40) / 4;
  }

  ngOnDestroy(): void {
    this.stopMetronome();
  }

  public togglePlayMode(): void {
    this.isPlayMode = !this.isPlayMode;
    this.isPlayMode ? this.startMetronome() : this.stopMetronome();
  }

  public changeSpeed(speed: number): void {
    if (this.isPlayMode) {
      this.stopMetronome();
    }
    this.bpm = speed * 4 + 40;
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
