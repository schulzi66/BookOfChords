import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Injectable({
    providedIn: 'root',
})
export class ExercisesService extends SubscriptionHandler implements OnDestroy {
    public exercises$: Observable<Exercise[]>;
    public exercises: Exercise[];

    constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
        super();
        this.exercises$ = this.getExercisesForUser(this._authService.user.uid);
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

    public deleteExercise(exerciseId: string): Promise<void> {
        return this._angularFirestore.collection<Exercise>('exercises').doc(exerciseId).delete();
    }

    private getExercisesForUser(uid: string): Observable<Exercise[]> {
        return this._angularFirestore
            .collection<Exercise>('exercises', ref => {
                return ref.where('uid', '==', uid).orderBy('name', 'asc');
            })
            .valueChanges();
    }
}
