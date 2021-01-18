import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class SubscriptionHandler implements OnDestroy {
  protected _subscriptions$: Subscription;

  constructor() {
    this._subscriptions$ = new Subscription();
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
}
