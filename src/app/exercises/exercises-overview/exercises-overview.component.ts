import { filter } from 'rxjs/operators';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Exercise } from 'src/app/models/exercise';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-exercises-overview',
  templateUrl: './exercises-overview.component.html',
  styleUrls: ['./exercises-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExercisesOverviewComponent extends SubscriptionHandler implements OnInit {
  public filteredExercises: Exercise[];
  private _exercises: Exercise[];

  constructor(
    private readonly _exercisesService: ExercisesService,
    private readonly _router: Router,
    private readonly _navbarActionService: NavbarActionService
  ) {
    super();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.createNewExercise()
      },
      {
        order: 200,
        icon: 'casino',
        action: () => this.chooseRandomExercise()
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._exercisesService.exercises$.subscribe((exercises: Exercise[]) => {
        this._exercises = exercises;
        this.filteredExercises = exercises;
      })
    );
  }

  public createNewExercise(): void {
    this._router.navigate(['/exercises/edit', -1]);
  }

  public searchForExercise(searchString: string): void {
    this.filteredExercises = this._exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  public clearSearch(): void {
    this.filteredExercises = this._exercises;
  }

  private chooseRandomExercise(): void {
    this._router.navigate(['/exercises/mode', this._exercises[Math.floor(Math.random() * this._exercises.length)].id]);
  }
}
