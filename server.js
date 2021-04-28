const { getKafkaClientFactory } = require("./kafka-client");
const { getConfig } = require("./config-getter");

const vaultName = process.env.vaultName ? process.env.vaultName : "giovanni";
const secretName = process.env.secretName ? process.env.secretName : "DEV-KEY";

const run = async () => {
  const kafkaFactory = getKafkaClientFactory(
    await getConfig(vaultName, secretName)
  );

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
