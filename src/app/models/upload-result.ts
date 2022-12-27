import { MediaTypes } from './media-types.enum';

export class UploadResult {
    downloadUrl: string;
    storagePath: string;
    mediaType: MediaTypes;
}
