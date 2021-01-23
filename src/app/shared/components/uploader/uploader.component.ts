import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadResult } from 'src/app/models/upload-result';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  @Input('storageBucketPrefix') storageBucketPrefix: string;
  @Output('onUploadComplete') onUploadComplete: EventEmitter<UploadResult> = new EventEmitter<UploadResult>();

  public isHovering: boolean;
  public files: File[] = [];

  constructor(public configurationService: ConfigurationService) {}

  ngOnInit() {}

  public toggleHover(isHovering: boolean): void {
    this.isHovering = isHovering;
  }

  public onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  public uploadComplete($event: UploadResult): void {
    this.onUploadComplete.emit($event);
  }
}
