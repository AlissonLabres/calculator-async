import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  constructor(private readonly httpClient: HttpClient) { }

  send(value: any) {
    const sendNumbers = {
      "firstNumber": value.firstInput,
      "secoundNumber": value.secoundInput
    };

    return this.httpClient.post("http://localhost:3000/calculater", sendNumbers);
  }

  get() {
    return this.httpClient.get<{
      result: {
        id: string,
        firstNumber: number
        secoundNumber: number
        status: string
        result?: number
      }[]
    }>("http://localhost:3000/calculater");
  }

}
