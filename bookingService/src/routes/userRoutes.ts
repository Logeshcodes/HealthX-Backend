import { Router } from "express";
import { userController } from "../config/dependencyInjector";
import authenticateToken from "../middlewares/UserAuthRoutes";
import { IsUser } from "../middlewares/RoleBasedAuth";
import { IsUserBlocked } from "../middlewares/blockedUsers";

const router = Router()

router.get(
    '/slotBooking/:email',
    IsUser,
    authenticateToken,
    IsUserBlocked,
     userController.getSlotBooking.bind(userController)
    );

router.get(
    '/slotDetails/:id', 
    IsUser,
    authenticateToken,
    IsUserBlocked,
    userController.getSlotDetailsById.bind(userController)
    );


router.get(
    "/payment-success/:txnid",
    userController.getAppointmentDetails.bind(userController)
  );

router.post(
    "/walletPayment",
    IsUser,
    authenticateToken,
    IsUserBlocked,
    userController.walletPayment.bind(userController)
  );

router.post(
    "/payment-success",
    userController.paymentSuccess.bind(userController)
);

router.post(
    "/cancelAppointment/:id",
    IsUser,
    authenticateToken,
    IsUserBlocked,
    userController.cancelAppointment.bind(userController)
);

router.post(
    "/payment-failure/",
    userController.paymentFailure.bind(userController)
);

router.get(
    "/appointments/:id",
    IsUser,
    authenticateToken,
    IsUserBlocked,
    userController.getAllAppointmentDetails.bind(userController)
);

router.get(
    "/appointmentData/:id",
    IsUser,
    authenticateToken,
    IsUserBlocked,
    userController.getAppointment.bind(userController)
);

const userRoutes = router ;

export default userRoutes ;