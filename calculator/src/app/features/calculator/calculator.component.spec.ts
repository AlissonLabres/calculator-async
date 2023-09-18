import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { CalculatorComponent } from './calculator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalculatorService } from '../../services/calculator/calculator.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

describe('CalculatorComponent', () => {
  it('should set first input', async () => {
    const user = await renderComponent();

    const first: HTMLInputElement = screen.getByTestId('firstInput');
    const secound: HTMLInputElement = screen.getByTestId('secoundInput');

    await user.type(first, '10');

    expect(first.value).toBe("10")
    expect(secound.value).toBe("")
  });

  it('should set secound input', async () => {
    const user = await renderComponent();

    const first: HTMLInputElement = screen.getByTestId('firstInput');
    const secound: HTMLInputElement = screen.getByTestId('secoundInput');

    await user.type(secound, '20');

    expect(secound.value).toBe("20")
    expect(first.value).toBe("")
  });

  it('should send values to service', async () => {
    const user = await renderComponent();
    const service: CalculatorService = TestBed.inject(CalculatorService);
    const serviceSpy = spyOn(service, 'send');

    const first: HTMLInputElement = screen.getByTestId('firstInput');
    const secound: HTMLInputElement = screen.getByTestId('secoundInput');
    const button: HTMLButtonElement = screen.getByTestId('submitCalculator');

    await user.type(first, '10');
    await user.type(secound, '20');
    await user.click(button);

    expect(serviceSpy).toHaveBeenCalled();
  });

  it('should not send values to service when field not has value', async () => {
    const user = await renderComponent();
    const service: CalculatorService = TestBed.inject(CalculatorService);
    const serviceSpy = spyOn(service, 'send');

    const first: HTMLInputElement = screen.getByTestId('firstInput');
    const button: HTMLButtonElement = screen.getByTestId('submitCalculator');

    await user.type(first, '10');
    await user.click(button);

    expect(serviceSpy).not.toHaveBeenCalled();
  });
});

class CalculatorServiceMock {
  send(): void { }
}

const renderComponent = async () => {
  const user = userEvent.setup();
  await render(CalculatorComponent, {
    providers: [
      {
        provider: CalculatorService,
        useClass: CalculatorServiceMock
      }
    ],
    imports: [ReactiveFormsModule, HttpClientModule]
  });

  return user;
}

