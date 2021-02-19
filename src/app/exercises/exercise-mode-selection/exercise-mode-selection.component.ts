import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseModes } from 'src/app/models/exercise-mode.enum';
import { NavbarActionService } from 'src/app/services/navbar-action.service';

@Component({
  selector: 'app-exercise-mode-selection',
  templateUrl: './exercise-mode-selection.component.html',
  styleUrls: ['./exercise-mode-selection.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseModeSelectionComponent implements OnInit {
  public exercise: Exercise;
  public ExerciseModes = ExerciseModes;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _navbarActionService: NavbarActionService,
    private readonly _router: Router,
    public readonly configurationService: ConfigurationService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'edit',
        action: () => this._router.navigate(['/exercises/edit', this.exercise.id])
      }
    ]);
  }

  ngOnInit() {
    this.exercise = this._activatedRoute.snapshot.data['exercise'];
  }
}
