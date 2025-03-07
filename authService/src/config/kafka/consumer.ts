import kafka from "./kafkaConfig";


import { userController , doctorController  } from "../dependencyInjector";
import { AdminController } from "../../controllers/AdminController";

async function consume() {
  
  const adminController=new AdminController()
  const consumer = kafka.consumer({ groupId: "auth-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "update-password-user",
        "update-profile-user",
        "block-user",

        "update-password-doctor",
        "update-profile-doctor",
        "block-doctor",
        
       
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
            case "update-password-user":
              await userController.updatePassword(messageValue);
              console.log("Processed add-user event:", messageValue);
              break;

            case "update-profile-user":
              await userController.updateProfile(messageValue);
              console.log("Processing update - user event:", messageValue);
              break;
            case "block-user":
              await userController.blockUser(messageValue);
              console.log("Processing block-user event:", messageValue);
              break;

              //doctor

              case "update-password-doctor":
                await doctorController.updatePassword(messageValue);
                console.log("Processed add-password doctor event:", messageValue);
                break;
              
                case "update-profile-doctor":
                  await doctorController.updateProfile(messageValue);
                  console.log("Processed updateProfile doctor event:", messageValue);
                  break;

                case "block-doctor":
                    await doctorController.blockDoctor(messageValue);
                    console.log("Processing block-user event:", messageValue);
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