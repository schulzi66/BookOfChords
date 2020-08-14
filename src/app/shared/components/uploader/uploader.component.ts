import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  @Input('storageBucketPrefix') storageBucketPrefix: string;
  @Output('onUploadComplete') onUploadComplete: EventEmitter<string> = new EventEmitter<string>();

  public isHovering: boolean;
  public files: File[] = [];

  constructor() {}

  ngOnInit() {}

  public toggleHover(isHovering: boolean): void {
    this.isHovering = isHovering;
  }

  public onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  public uploadComplete($event: string): void {
    this.onUploadComplete.emit($event);
  }
}
