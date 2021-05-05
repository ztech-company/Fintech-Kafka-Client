require("dotenv").config();

const { getKafkaClientFactory } = require("./kafka-client");
const KeyVault = require("keyvault-client");

const vaultName = process.env.VAULT_NAME || "gps-dev";
const secretName = process.env.SECRET_NAME || "KAFKA-AUTH";

const run = async () => {
  const kafkaConfig = await KeyVault(vaultName, secretName).catch(e=>({brokers: ["localhost:9092"]}));
  
  const kafkaFactory = getKafkaClientFactory(kafkaConfig);

  const producer = await kafkaFactory.getProducer();
  const consumer = await kafkaFactory.getConsumer({ groupId: "test-group" });

  // Producing
  // await producer.connect()
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello!" }],
  });

  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello2" }, { value: "Goodbye" }],
  });

  producer.disconnect()

  // Consuming
  // await consumer.connect()
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
