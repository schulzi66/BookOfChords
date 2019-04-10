import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input('file') file: File;
  @Input('storageBucketPrefix') storageBucketPrefix: string;

  @Output('onUploadComplete') onUploadComplete: EventEmitter<string> = new EventEmitter<string>();

  public task: AngularFireUploadTask;
  public percentage: Observable<number>;
  public snapshot: Observable<any>;
  public downloadUrl: string;

  private _angularFireStorage: AngularFireStorage;
  private _angularFirestore: AngularFirestore;

  constructor(angularFireStorage: AngularFireStorage, angularFirestore: AngularFirestore) {
    this._angularFireStorage = angularFireStorage;
    this._angularFirestore = angularFirestore;
  }

  ngOnInit() {
    this.startUpload();
  }

  public startUpload(): void {
    //The storage path
    const storagePath = `${this.storageBucketPrefix}/${Date.now()}_${this.file.name}`;
    //Reference to storage bucket
    const ref = this._angularFireStorage.ref(storagePath);
    //The main Task
    this.task = this._angularFireStorage.upload(storagePath, this.file);
    //Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadUrl = await ref.getDownloadURL().toPromise();
        this._angularFirestore.collection('files').add({
          downloadUrl: this.downloadUrl,
          storagePath
        });
        this.onUploadComplete.emit(this.downloadUrl);
      })
    );
  }

  public isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
