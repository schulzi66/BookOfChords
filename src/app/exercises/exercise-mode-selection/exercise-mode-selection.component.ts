import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseModes } from 'src/app/models/exercise-mode.enum';

@Component({
  selector: 'app-exercise-mode-selection',
  templateUrl: './exercise-mode-selection.component.html',
  styleUrls: ['./exercise-mode-selection.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseModeSelectionComponent implements OnInit {
  public exercise: Exercise;

  public ExerciseModes = ExerciseModes;

  constructor(private readonly _activatedRoute: ActivatedRoute, public configurationService: ConfigurationService) {}

  ngOnInit() {
    this.exercise = this._activatedRoute.snapshot.data['exercise'];
  }
}
