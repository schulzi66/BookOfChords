import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Band } from 'src/app/models/band';

export interface BottomSheetBandSelectionConfigInjectionToken {
    bands$: Observable<Band[]>;
    onSelectionCallback?: (selectedBand: Band) => void;
}

@Component({
    selector: 'app-bottom-sheet-band-selection',
    standalone: true,
    imports: [CommonModule, MatListModule],
    templateUrl: './bottom-sheet-band-selection.component.html',
    styleUrls: ['./bottom-sheet-band-selection.component.scss'],
})
export class BottomSheetBandSelectionComponent {
    public selectedBand: Band;

    public constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public token: BottomSheetBandSelectionConfigInjectionToken) {}

    public onSelectBand(band: Band): void {
        this.token.onSelectionCallback(band);
    }
}
