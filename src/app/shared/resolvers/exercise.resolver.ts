import { first, map } from 'rxjs/operators';
import { Exercise } from './../../models/exercise';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { ExercisesService } from 'src/app/exercises/services/exercises.service';

@Injectable({ providedIn: 'root' })
export class ExerciseResolver implements Resolve<Exercise> {
  constructor(private _exerciseService: ExercisesService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Exercise> | Promise<Exercise> | Exercise {
    return this._exerciseService.exercises !== undefined
      ? this._exerciseService.exercises.find((x) => x.id === route.params['id'])
      : this._exerciseService.exercises$
          .pipe(map((exercises) => exercises.find((exercise) => exercise.id === route.params['id'])))
          .pipe(first());
  }
}
