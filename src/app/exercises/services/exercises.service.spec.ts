/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExercisesService } from './exercises.service';

describe('Service: Exercises', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExercisesService]
    });
  });

  it('should ...', inject([ExercisesService], (service: ExercisesService) => {
    expect(service).toBeTruthy();
  }));
});
