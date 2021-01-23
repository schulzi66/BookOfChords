import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

export enum BottomSheetUploaderAllowedTypes {
  PDF = 'application/pdf',
  SOUND = 'audio/*',
  IMAGE = 'image/*'
}

export interface BottomSheetUploaderConfigInjectionToken {
  typesToUpload: BottomSheetUploaderAllowedTypes[];
}

@Component({
  selector: 'app-bottom-sheet-uploader',
  templateUrl: './bottom-sheet-uploader.component.html',
  styleUrls: ['./bottom-sheet-uploader.component.scss']
})
export class BottomSheetUploaderComponent implements OnInit {
  public constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public token: BottomSheetUploaderConfigInjectionToken) {}

  ngOnInit() {}
  openLink(event: MouseEvent): void {
    console.log(this.token);
  }
}
