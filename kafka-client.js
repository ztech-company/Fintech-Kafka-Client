function getKafkaClientFactory(kafkaConfig) {
  const { Kafka } = require("kafkajs");
  const kafka = new Kafka(kafkaConfig);

  return {
    getProducer: async () => {
      const producer = kafka.producer();
      await producer.connect();
      return Promise.resolve(producer);
    },
    getConsumer: async (consumerConfig = {},groupId="randomGroup") => {
      consumerConfig.groupId=groupId
      const consumer = kafka.consumer(consumerConfig);
      await consumer.connect();
      return Promise.resolve(consumer);
    },
  };
}

exports.getKafkaClientFactory = getKafkaClientFactory;
