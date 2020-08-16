import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dropzone]'
})
export class DropzoneDirective {
  @Output('dropped') dropped = new EventEmitter<FileList>();
  @Output('hovered') hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event']) onDrop($event: any) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event']) onDragOver($event: any) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event']) onDragLeave($event) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}