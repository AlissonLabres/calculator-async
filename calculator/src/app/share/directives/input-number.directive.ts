import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputNumber]'
})
export class InputNumberDirective {

  constructor(
    private readonly ngControl: NgControl,
    private readonly elementRef: ElementRef
  ) { }

  @HostListener('input') onInput() {
    const value = this.elementRef.nativeElement.value;
    this.ngControl.control?.patchValue(value.replace(/\D/g, ''));
  }
}
