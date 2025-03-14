import kafka from "./kafkaConfig";
import { Partitioners } from "kafkajs";

async function produce(topic: string, value: object): Promise<void> {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    console.log("Connecting to User-Service Producer...");
    await producer.connect();

    const messageValue = typeof value === "object" ? JSON.stringify(value) : value;
    console.log(`Sending message to topic: ${topic} => ${messageValue}`);

    await producer.send({topic, messages: [{ value: messageValue }],});

    console.log("Message sent successfully from User-Producer.");
  } catch (error) {
    console.error("Error in User-Producer:");
  } finally {
    await producer.disconnect();
    console.log("User-Producer disconnected.");
  }
}

export default produce;