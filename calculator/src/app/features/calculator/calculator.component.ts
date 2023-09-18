import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../../services/calculator/calculator.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {

  reactiveForm: FormGroup = this.initialForm();
  list$: Observable<{
    result: {
      id: string,
      firstNumber: number
      secoundNumber: number
      status: string
      result?: number
    }[]
  }> = this.calculatorService.get();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly calculatorService: CalculatorService
  ) { }

  initialForm() {
    return this.formBuilder.group({
      firstInput: ['', Validators.required],
      secoundInput: ['', Validators.required],
    })
  }

  send() {
    const value = this.reactiveForm.getRawValue();
    this.calculatorService.send(value)
      .subscribe(
        () => { this.reactiveForm.reset(); }
      );
  }
}
