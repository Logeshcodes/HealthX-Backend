import kafka from "./kafkaConfig";


import { userController , doctorController } from "../dependencyInjector";


async function consume() {
  
  
  const consumer = kafka.consumer({ groupId: "videoCall-service" });

  try {
    console.log("Connecting to videoCall-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-user",
        "add-doctor",
      ],
      fromBeginning: true,
    });

    console.log("videoCall-Service Consumer is running...");
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const messageValue = message.value
            ? JSON.parse(message.value.toString())
            : null;

          if (!messageValue) {
            console.warn(`Empty message received on topic: ${topic}`);
            return;
          }

          switch (topic) {
            case "add-user":
              await userController.addUser(messageValue);
              console.log("Processed add-user event:", messageValue);
              break;

              //doctor
            case "add-doctor":
              await doctorController.addDoctor(messageValue);
              console.log("Processed add-user event:", messageValue);
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
      "Error in videoCall-Service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;