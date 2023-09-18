import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { HttpClientModule } from '@angular/common/http';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';

describe('Service: Calculator', async () => {

  it('Should testing service', async () => {
    const user = await renderService();

    const service: CalculatorService = TestBed.inject(CalculatorService);
    const serviceSpy = spyOn(service, 'send');

    const button: HTMLButtonElement = screen.getByTestId('submitCalculator');
    await user.click(button);

    expect(serviceSpy).toHaveBeenCalledTimes(1);
  })
});

@Component({
  template: `<button (click)="send()" data-testid="submitCalculator">Send calculator</button>`,
})
export class TestComponent {
  constructor(private service: CalculatorService) { }

  send() {
    this.service.send({ firstNumber: '10', secoundNumber: '20' }).subscribe();
  }

  getList() {
    this.service.get().subscribe();
  }
}

const renderService = async () => {
  const user = userEvent.setup();
  await render(TestComponent, {
    providers: [CalculatorService],
    imports: [HttpClientModule]
  });

  return user;
}
