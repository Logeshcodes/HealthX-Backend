import kafka from "./kafkaConfig";


import { userController , doctorController } from "../dependencyInjector";


async function consume() {
  
  
  const consumer = kafka.consumer({ groupId: "booking-service" });

  try {
    console.log("Connecting to booking-service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "slot-booked",
        
      ],
      fromBeginning: true,
    });

    console.log("booking-service Consumer is running...");
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {




          const rawMessage = message.value?.toString();
    console.log("Raw message received:", rawMessage);

    if (!rawMessage) {
      console.warn(`Empty message received on topic: ${topic}`);
      return;
    }

    
    const cleanedMessage = rawMessage.trim();
    const messageValue = JSON.parse(cleanedMessage);
    
    console.log("Parsed message:", messageValue);

    switch (topic) {
      case "slot-booked":
        await userController.updateSlot(messageValue);
        console.log("Processed slot-booked event:", messageValue);
        break;

      default:
        console.warn(`No handler for topic: ${topic}`);
    }





          
        } catch (error: any) {
          console.error(
            `Error processing message from topic ${topic}:`,
            error.message
          );
        }
      },
    });
  } catch (error: any) {
    console.error(
      "Error in booking-service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;