import { reviewController } from "../config/dependencyInjector";
import authenticateToken from "../helpers/DoctorAuthRoutes";
import { Router } from "express";

const router = Router();

router.post("/addReview", reviewController.createReview.bind(reviewController));
router.post("/likeReview", reviewController.likeReview.bind(reviewController));
router.post("/addReply", reviewController.createReply.bind(reviewController));
router.post("/likeReply", reviewController.likeReply.bind(reviewController));

router.get("/:doctorId",
    reviewController.getDoctorReviews.bind(reviewController)
  );

const reviewRoutes = router;
export default reviewRoutes;