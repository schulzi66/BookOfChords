import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@ngneat/transloco';
import { ToneService } from 'src/app/services/tone.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'shared-metronome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    TranslocoModule,
  ],
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent extends SubscriptionHandler implements OnInit, OnDestroy {
  private readonly _defaultBpm: number = 40;
  private readonly _minuteInMs: number = 60000;
  private _timerHandle: number;
  private _started: boolean;

  @Input('showPlay') public showPlay: boolean = true;
  @Input('showSoundMode') public showSoundMode: boolean = false;
  @Input('bpm') public bpm: number;
  @Input('sliderDisabled') public sliderDisabled: boolean;

  @ViewChild('bpmSlider') public bpmSlider: ElementRef;
  @ViewChild('playBtn') public playBtn: ElementRef;

  @Output('onBpmChanged') public onBpmChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output('onStart') public onStart: EventEmitter<void> = new EventEmitter<void>();
  @Output('onPause') public onPause: EventEmitter<void> = new EventEmitter<void>();
  @Output('onContinue') public onContinue: EventEmitter<void> = new EventEmitter<void>();
  @Output('onStop') public onStop: EventEmitter<void> = new EventEmitter<void>();

  public playModeIcon: string;
  public soundModeIcon: string;
  public isPlayMode: boolean;
  public isTick: boolean;

  constructor(public readonly toneService: ToneService) {
    super();
    this.playModeIcon = 'play_arrow';
    this.soundModeIcon = 'volume_up';
    this.isPlayMode = false;
    this.isTick = false;
    this._started = false;
  }

  public get isValid(): boolean {
    return this.toneService.isValidBpm(this.bpm);
  }

  ngOnInit(): void {
    if (!this.bpm) {
      this.bpm = this._defaultBpm;
    }
    if (!this.sliderDisabled) {
      this.sliderDisabled = false;
    }
    if (this.showSoundMode) {
      this._subscriptions$.add(
        this.toneService.isMuted$.subscribe((muted: boolean) => {
          muted ? (this.soundModeIcon = 'volume_off') : (this.soundModeIcon = 'volume_up');
        })
      );
      this.showSoundMode ? this.toneService.unmute() : this.toneService.mute();
    }
  }

  ngOnDestroy(): void {
    this.stopMetronome();
  }

  public togglePlayMode(): void {
    this.isPlayMode = !this.isPlayMode;
    if (!this._started) {
      this.startMetronome(true);
      this._started = true;
    } else {
      if (this.isPlayMode) {
        this.startMetronome(false);
      } else {
        this.onPause.emit();
        this.showSoundMode ? this.toneService.stop() : window.clearInterval(this._timerHandle);
        this.playModeIcon = 'play_arrow';
      }
    }
  }

  public changeSpeed(speed: number): void {
    this.bpm = speed;
    if (this.showSoundMode) {
      this.toneService.changeSpeed(this.bpm);
    }
    this.onBpmChanged.emit(this.bpm);
  }

  public startMetronome(emitStart: boolean): void {
    if (this.showSoundMode) {
      this.toneService.start(this.bpm).then(() => {
        if (emitStart) {
          this.onStart.emit();
        } else {
          this.onContinue.emit();
        }
      });
    } else {
      this.onStart.emit();
      this._timerHandle = window.setInterval(() => {
        this.tick();
      }, this._minuteInMs / this.bpm);
    }
    this.playModeIcon = 'pause';
  }

  public stopMetronome(): void {
    this.onStop.emit();
    this.isPlayMode = false;
    this.showSoundMode ? this.toneService.stop() : window.clearInterval(this._timerHandle);
    this.playModeIcon = 'play_arrow';
    this._started = false;
  }

  private tick(): void {
    this.isTick = true;
    window.setTimeout(() => {
      this.isTick = false;
    }, 100);
  }
}
