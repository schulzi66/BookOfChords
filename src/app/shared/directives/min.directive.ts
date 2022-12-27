import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    selector: '[min]',
    standalone: true,
    providers: [{ provide: NG_VALIDATORS, useExisting: MinDirective, multi: true }],
})
export class MinDirective implements Validator {
    @Input() min: number;

    validate(control: AbstractControl): { [key: string]: any } {
        return Validators.min(this.min)(control);
    }
}
