import kafka from "./kafkaConfig";
import { userController , doctorController } from "../dependencyInjector";

async function consume() {
  
  const consumer = kafka.consumer({ groupId: "user-service" });

  try {
    console.log("Connecting to User-Service Consumer...\n");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-user",
        "password-reset-user",
        "wallet-payment-user",

        "add-doctor",
        "password-reset-doctor",
        "verification-request",
        "add-slot",
        "remove-slot",

        "update-cancelAppointment-user-wallet",
        "update-cancelAppointment-doctor-wallet",
      ],
      fromBeginning: true,
    });

    console.log("User-Service Consumer is running...\n");
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const messageValue = message.value? JSON.parse(message.value.toString()): null;
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
              console.log("Processing password-reset-user event:", messageValue);
              break;

            case "wallet-payment-user":
              await userController.updateWallet(messageValue);
              console.log("Processing wallet-payment-user-appointment event:", messageValue);
              break;
              
            case "update-cancelAppointment-user-wallet":
              await userController.updateWallet(messageValue);
              console.log("Processing update-cancelAppointment-user-wallet event:", messageValue);
              break;

              //doctor
              case "add-doctor":
                await doctorController.addDoctor(messageValue);
                console.log("Processed add-doctor event:", messageValue);
                break;

            case "password-reset-doctor":
              await doctorController.passwordReset(messageValue);
              console.log("Processing password-reset-doctor event:", messageValue);
              break;

            case "verification-request":
              await doctorController.VerificationRequest(messageValue);
              console.log("Processing verification-request event:", messageValue);
              break;

            case "add-slot":
              await doctorController.createSlot(messageValue);
              console.log("Processing add-slot event:", messageValue);
              break;

            case "remove-slot":
              await doctorController.removeSlot(messageValue);
              console.log("Processing remove-slot event:", messageValue);
              break;

            case "update-cancelAppointment-doctor-wallet":
              await doctorController.updateWallet(messageValue);
              console.log("Processing update-cancelAppointment-doctor-wallet event:", messageValue);
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
  } catch (error) {
    console.error("Error in User-Service Consumer:");
  }
}

export default consume;