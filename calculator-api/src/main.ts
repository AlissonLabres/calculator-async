import express, { Request, Response } from 'express';
import cors from 'cors';
import { Schema, model, connect, ObjectId } from 'mongoose';
import amqp from "amqplib";

const application = express();
application.use(express.json());
application.use(cors());

const queue = 'Calculator'

enum StatusEnum {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  DONE = 'DONE'
}

interface CalculationInterface {
  number1: number,
  number2: number,
  status: StatusEnum,
  result?: number,
  _id?: ObjectId
}

const calculationSchema = new Schema<CalculationInterface>({
  number1: { type: Number, required: true },
  number2: { type: Number, required: true },
  result: { type: Number, required: false },
  status: {
    type: String,
    enum: StatusEnum,
    default: StatusEnum.PENDING,
    required: true
  },
});

var connectionDatabase: any;
const connectMongo = async () => {
  if (!connectionDatabase) {
    connectionDatabase = await connect('mongodb://localhost:27017/calculation');
  }

  return connectionDatabase;
}

var connectionRabbitmq: any;
const connectRabbitmq = async () => {
  if (!connectionDatabase) {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    connectionRabbitmq = await connection.createChannel();
  }

  return connectionRabbitmq;
}

const Calculation = model<CalculationInterface>('Calculation', calculationSchema);

const updateDatabase = async ({ firstNumber, secoundNumber }: { firstNumber: number, secoundNumber: number }) => {
  await connectMongo();
  const calculationModel = new Calculation({
    number1: firstNumber,
    number2: secoundNumber
  });

  return calculationModel.save();
}

const publishMessage = async (calculationEntity: CalculationInterface) => {
  const channel = await connectRabbitmq();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(calculationEntity)));
}

const getCalculations = async () => {
  await connectMongo();
  return Calculation.find({});
}

const toDto = (calculationModel: CalculationInterface[]) => {
  const mapper = calculationModel.map((model) => ({
    "id": model._id,
    "firstNumber": model.number1,
    "secoundNumber": model.number2,
    "status": model.status,
    "result": model.result
  }));

  return { result: mapper };
}

application.post('/calculater', async (request: Request, response: Response) => {
  console.log(
    '[INICIO] | Valores para Calcular [firstNumber: {%s}][secoundNumber: {%s}]',
    request.body.firstNumber,
    request.body.secoundNumber
  );
  const calculationEntity = await updateDatabase(request.body);
  console.log("[MONGODB] | Valores armazenados no banco [message: {%s}]: ", calculationEntity);

  await publishMessage(calculationEntity);
  console.log("[RABBITMQ] | Mensagem encaminhada na Fila [message: {%s}]: ", calculationEntity);

  console.log(
    '[FINAL] | Valores para Calcular [firstNumber: {%s}][secoundNumber: {%s}]',
    request.body.firstNumber,
    request.body.secoundNumber
  );
  response.status(202).json();
});

application.get('/calculater', async (request: Request, response: Response) => {
  console.log('[INICIO] | Obter valores');
  const calculationModel = await getCalculations();
  console.log("[MONGODB] | Valores obtidos no banco [message: {%s}]: ", JSON.stringify(calculationModel));
  console.log('[FINAL] | Valores obtidos');
  response.status(200).json(toDto(calculationModel));
});

application.listen(3000, async () => {
  console.log("Application started");
})
