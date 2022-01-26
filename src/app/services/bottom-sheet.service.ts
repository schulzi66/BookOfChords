import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {
    BottomSheetBandSelectionComponent,
    BottomSheetBandSelectionConfigInjectionToken
} from '../shared/components/bottom-sheet-band-selection/bottom-sheet-band-selection.component';
import {
    BottomSheetUploaderComponent,
    BottomSheetUploaderConfigInjectionToken
} from '../shared/components/bottom-sheet-uploader/bottom-sheet-uploader.component';

@Injectable({
  providedIn: 'root'
})
export class BottomSheetService {
  public constructor(private _bottomSheet: MatBottomSheet) {}

  public showUpload(token: BottomSheetUploaderConfigInjectionToken): MatBottomSheetRef<BottomSheetUploaderComponent> {
    return this._bottomSheet.open(BottomSheetUploaderComponent, { data: token });
  }

  public showBandSelection(
    token: BottomSheetBandSelectionConfigInjectionToken
  ): MatBottomSheetRef<BottomSheetBandSelectionComponent> {
    return this._bottomSheet.open(BottomSheetBandSelectionComponent, { data: token });
  }
}
