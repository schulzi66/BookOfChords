import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService extends SubscriptionHandler implements OnDestroy {
  public exercises$: Observable<Exercise[]>;
  public exercises: Exercise[];

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    super();
    this.exercises$ = this._getExercisesForUser(this._authService.user.uid);
    this._subscriptions$.add(this.exercises$.subscribe((exercises: Exercise[]) => (this.exercises = exercises)));
  }

  ngOnDestroy(): void {
    this.exercises$ = null;
    super.ngOnDestroy();
  }

  public saveExercise(exercise: Exercise): Promise<void> {
    if (!exercise.id) {
      exercise.id = this._angularFirestore.createId();
    }
    return this._angularFirestore
      .collection<Exercise>('exercises')
      .doc(exercise.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(exercise))));
  }

  private _getExercisesForUser(uid: string): Observable<Exercise[]> {
    return this._angularFirestore
      .collection<Exercise>('exercises', (ref) => {
        return ref.where('uid', '==', uid);
      })
      .valueChanges();
  }
}
