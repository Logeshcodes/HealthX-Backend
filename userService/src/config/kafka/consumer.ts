import kafka from "./kafkaConfig";


import { userController , doctorController } from "../dependencyInjector";


async function consume() {
  
  
  const consumer = kafka.consumer({ groupId: "user-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-user",
        "password-reset-user",
        "add-doctor",
        "password-reset-doctor",
        "verification-request",
        "add-slot",
        "remove-slot",
      ],
      fromBeginning: true,
    });

    console.log("User-Service Consumer is running...");
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

            case "password-reset-user":
              await userController.passwordReset(messageValue);
              console.log("Processing add-user event:", messageValue);
              break;

              //doctor
            case "add-doctor":
              await doctorController.addDoctor(messageValue);
              console.log("Processed add-user event:", messageValue);
              break;

            case "password-reset-doctor":
              await doctorController.passwordReset(messageValue);
              console.log("Processing add-doctor event:", messageValue);
              break;

            case "verification-request":
              await doctorController.VerificationRequest(messageValue);
              console.log("Processing add-doctor event:", messageValue);
              break;
            case "add-slot":
              await doctorController.createSlot(messageValue);
              console.log("Processing add-slot event:", messageValue);
              break;
            case "remove-slot":
              await doctorController.removeSlot(messageValue);
              console.log("Processing remove-slot event:", messageValue);
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
      "Error in User-Service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;