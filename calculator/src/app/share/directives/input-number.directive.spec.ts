import { render, screen, fireEvent } from '@testing-library/angular';
import { InputNumberDirective } from './input-number.directive';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

describe('Directive: InputNumber', () => {
  it('should instance Directive and not accept value different of number', async () => {
    const { fixture } = await renderDirective();

    const first: HTMLInputElement = screen.getByTestId('firstInput');
    first.value = 'Hello.@31';
    first.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    fixture.detectChanges();
    expect(first.value).toBe("31")
  });
});

@Component({
  template: `<input
    inputNumber
    type="text"
    data-testid="firstInput"
    [(ngModel)]="value"
  />`,
})
class TestComponent {
  value = '';
}

const renderDirective = async () => {
  return render(TestComponent, {
    imports: [FormsModule],
    declarations: [InputNumberDirective],
  });
}
