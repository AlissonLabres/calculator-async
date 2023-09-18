import axios from "axios";

describe('Calculator Integration', () => {
  
  it('Should calculator some', async () => {
    const response = await axios.post('http://localhost:3000/calculater', { "firstNumber": 10, "secoundNumber": 10 })

    expect(response.status).toBe(202);
  });

});