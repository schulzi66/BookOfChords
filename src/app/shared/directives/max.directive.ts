import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  selector: '[max]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true }]
})
export class MaxDirective implements Validator {

  @Input() max: number;

  validate(control: AbstractControl): { [key: string]: any } {    
    return Validators.max(this.max)(control)    
  }
}