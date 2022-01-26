import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Band } from 'src/app/models/band';

export interface BottomSheetBandSelectionConfigInjectionToken {
  bands: Band[];
  onSelectionCallback?: (selectedBand: Band) => void;
}

@Component({
  selector: 'app-bottom-sheet-band-selection',
  templateUrl: './bottom-sheet-band-selection.component.html',
  styleUrls: ['./bottom-sheet-band-selection.component.scss']
})
export class BottomSheetBandSelectionComponent {
  public selectedBand: Band;

  public constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public token: BottomSheetBandSelectionConfigInjectionToken) {}

  public onSelectBand(band: Band): void {
      this.token.onSelectionCallback(band);
  }
}
