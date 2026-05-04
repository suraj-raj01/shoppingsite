
import Review from "../../models/reviews/reviewModel.js";

export const createReview = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data,'data')
    const review = await Review.create(data);
    return res.status(201).json({
      success: true,
      data: review,
      message: "Review created ✅",
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const review = await Review.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json({
      success: true,
      data: review,
      message: "Review updated ✅",
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getReviews = async (_req, res) => {
  try {
    const page = parseInt(_req.query.page) || 1;
    const limit = parseInt(_req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Review.countDocuments();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({ data, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { _id: id },
        { userId: id },
        { productId: id }
      ]
    };

    const total = await Review.countDocuments(query);

    const data = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (data.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data,
      totalPages,
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      data: review,
      message: "Review deleted ✅",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
