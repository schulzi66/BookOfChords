import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StringArrayLines'
})
export class StringArrayLinesPipe implements PipeTransform {

  transform(value: string[], args?: any): string {
    let returnValue:string = null;
    if(value === undefined) {      
      return returnValue = ``;
    } else {
      returnValue = ``;
      for (let index = 0; index < value.length; index++) {        
        returnValue += index + 1 === value.length ? `${value[index]}` : `${value[index]}\n`
      }      
      return returnValue;
    }
  }

}
