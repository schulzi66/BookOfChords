import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {
  BottomSheetUploaderComponent,
  BottomSheetUploaderConfigInjectionToken
} from '../shared/components/bottom-sheet-uploader/bottom-sheet-uploader.component';

@Injectable({
  providedIn: 'root'
})
export class BottomSheetUploaderService {
  public constructor(private _buttomSheet: MatBottomSheet) {}

  public show(token: BottomSheetUploaderConfigInjectionToken): MatBottomSheetRef<BottomSheetUploaderComponent> {
    return this._buttomSheet.open(BottomSheetUploaderComponent, { data: token });
  }
}
