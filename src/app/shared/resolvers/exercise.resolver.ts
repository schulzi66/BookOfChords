import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ExercisesService } from 'src/app/exercises/services/exercises.service';
import { Exercise } from './../../models/exercise';

@Injectable({ providedIn: 'root' })
export class ExerciseResolver  {
    constructor(private _exerciseService: ExercisesService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Exercise> | Promise<Exercise> | Exercise {
        return this._exerciseService.exercises !== undefined
            ? this._exerciseService.exercises.find(x => x.id === route.params['id'])
            : this._exerciseService.exercises$
                  .pipe(map(exercises => exercises.find(exercise => exercise.id === route.params['id'])))
                  .pipe(first());
    }
}
