import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encode'
})
export class EncodeUriPipe implements PipeTransform {
  transform(url: string) {
    return encodeURIComponent(url);
  }
}
