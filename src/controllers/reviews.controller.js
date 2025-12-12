import reviewService from "../services/reviews.service.js";

const create = async (req, res, next) => {
  try {
    const authorId = req.user.uid;
    const reviewData = req.body;
    const newReview = await reviewService.addReview(authorId, reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

const listByParking = async (req, res, next) => {
  try {
    const { parkingId } = req.params;
    const reviews = await reviewService.getParkingReviews(parkingId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export default { create, listByParking };
