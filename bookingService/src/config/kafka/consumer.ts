import kafka from "./kafkaConfig";
import { userController, doctorController } from "../dependencyInjector";

async function consume() {
  const consumer = kafka.consumer({ groupId: "booking-service" });

  try {
    console.log("Connecting to booking-service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-user",
        "add-doctor",
        "update-profile-user",
        "update-profile-doctor",
      ],
      fromBeginning: true,
    });

    console.log("booking-service Consumer is running...\n");
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const rawMessage = message.value?.toString();

          if (!rawMessage) {
            console.warn(`Empty message received on topic: ${topic}`);
            return;
          }

          const cleanedMessage = rawMessage.trim();
          const messageValue = JSON.parse(cleanedMessage);

          switch (topic) {
            case "add-user":
              await userController.addUser(messageValue);
              console.log("Processed add-user event:", messageValue);
              break;

            case "update-profile-user":
              await userController.updateProfile(messageValue);
              console.log("Processing update-profile-user event:", messageValue);
              break;
            case "add-doctor":
              await doctorController.addDoctor(messageValue);
              console.log("Processed add-doctor event:", messageValue);
              break;
            case "update-profile-doctor":
              await doctorController.updateProfile(messageValue);
              console.log(
                "Processed update-profile-doctor event:",
                messageValue
              );
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
