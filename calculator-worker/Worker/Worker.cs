using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace calculator_worker;

public class CalculatorEntity
{
    public int number1 { get; set; }
    public int number2 { get; set; }
    public int result { get; set; }
    public string status { get; set; }
    public string _id { get; set; }
}

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly int _intervaloMensagemWorkerAtivo;
    private readonly string _queue;

    public Worker(ILogger<Worker> logger, IConfiguration configuration)
    {

        _logger = logger;
        _queue = Convert.ToString(configuration["Queue"]);
        _intervaloMensagemWorkerAtivo = Convert.ToInt32(configuration["IntervaloMensagemWorkerAtivo"]);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[WORKER] | Worker iniciado.");

        ConnectionFactory factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@localhost:5672/")
        };

        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(queue: _queue,
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += Consumer_Received;

        channel.BasicConsume(queue: _queue,
            autoAck: true,
            consumer: consumer);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(_intervaloMensagemWorkerAtivo, stoppingToken);
        }
    }

    private void Consumer_Received(object sender, BasicDeliverEventArgs e)
    {
        _logger.LogInformation($"[INICIO] | Mensagem recebida para processar " + Encoding.UTF8.GetString(e.Body.ToArray()));

        CalculatorEntity calculatorEntity = JsonConvert.DeserializeObject<CalculatorEntity>(Encoding.UTF8.GetString(e.Body.ToArray()));
        calculatorEntity.result = Process(calculatorEntity.number1, calculatorEntity.number2);
        calculatorEntity.status = UpdateStatus(calculatorEntity.status);
        _logger.LogInformation($"[WORKER] | Mensagem processada " + JsonConvert.SerializeObject(calculatorEntity).ToString());

        UpdateMessage(calculatorEntity);
    }

    private int Process(int number1, int number2)
    {
        return number1 + number2;
    }

    private string UpdateStatus(string value)
    {
        if (value == "PENDING")
        {
            return "DONE";
        }

        return "ERROR";
    }

    private void UpdateMessage(CalculatorEntity calculatorEntity)
    {
        var client = new MongoClient("mongodb://localhost:27017");
        var database = client.GetDatabase("calculation");
        var collection = database.GetCollection<BsonDocument>("calculations");
        var filtro = Builders<BsonDocument>.Filter.Eq(filter => filter["_id"], ObjectId.Parse(calculatorEntity._id));

        var update = Builders<BsonDocument>.Update.Set(c => c["status"], calculatorEntity.status).Set(c => c["result"], calculatorEntity.result);
        var resultado = collection.FindOneAndUpdate(filtro, update);

        if (resultado != null)
        {
            _logger.LogInformation($"[MONGODB] | Mensagem atualizada no banco " + JsonConvert.SerializeObject(calculatorEntity).ToString());
        }
        else
        {
            _logger.LogInformation($"[MONGODB] | Erro ao atualizada no banco " + JsonConvert.SerializeObject(calculatorEntity).ToString());
        }
    }
}
