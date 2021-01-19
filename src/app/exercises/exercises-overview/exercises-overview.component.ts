import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Exercise } from 'src/app/models/exercise';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ExercisesService } from '../services/exercises.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-exercises-overview',
  templateUrl: './exercises-overview.component.html',
  styleUrls: ['./exercises-overview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ExercisesOverviewComponent extends SubscriptionHandler implements OnInit {
  public exercises: Exercise[];
  public expandedExercise: Exercise; 
  public columnsToDisplay = ['name', 'currentBpm', 'nextBpm'];

  constructor(
    private _exercisesService: ExercisesService,
    private _router: Router,
    private _navbarActionService: NavbarActionService
  ) {
    super();
    console.log(Object.getOwnPropertyNames(Exercise));
    
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.createNewExercise()
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._exercisesService.exercises$.subscribe((exercises: Exercise[]) => {
        this.exercises = exercises;
      })
    );
  }

  public createNewExercise(): void {
    this._router.navigate(['/exercises/edit', -1]);
  }
}
