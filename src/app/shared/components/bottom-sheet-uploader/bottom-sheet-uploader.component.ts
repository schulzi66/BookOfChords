import { UploadResult } from '../../../models/upload-result';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MediaTypes } from 'src/app/models/media-types.enum';

export interface BottomSheetUploaderConfigInjectionToken {
  storageBucketPrefix: string;
  typesToUpload: MediaTypes[];
  onUploadCallback?: (result: UploadResult) => void;
}

@Component({
  selector: 'app-bottom-sheet-uploader',
  templateUrl: './bottom-sheet-uploader.component.html',
  styleUrls: ['./bottom-sheet-uploader.component.scss']
})
export class BottomSheetUploaderComponent {
  public files: { [key: string]: File[] };

  public constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public token: BottomSheetUploaderConfigInjectionToken) {
    this.files = {};
  }

  public onChange(fileList: FileList, type: MediaTypes): void {
    for (let i = 0; i < fileList.length; i++) {
      if (this.files[type] === undefined) {
        this.files[type] = [];
      }
      this.files[type].push(fileList.item(i));
    }
  }

  public uploadComplete($event: UploadResult): void {
    this.token.onUploadCallback($event);
  }
}
