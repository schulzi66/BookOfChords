import { Exercise } from 'src/app/models/exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseDetailsComponent implements OnInit {
  public exercise: Exercise;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _navbarActionService: NavbarActionService,
    private readonly _router: Router
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
