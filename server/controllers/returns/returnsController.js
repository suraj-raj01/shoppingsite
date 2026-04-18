
import Returns from "../../models/returns/returnsModel.js";

export const createReturn = async (req, res) => {
  try {
    const data = req.body;

    const newReturn = await Returns.create(data);

    res.status(201).json({
      message: "Return request created",
      data: newReturn
    });

  } catch (error) {
    console.error("CREATE Returns ERROR:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedReturn = await Returns.findByIdAndUpdate(
      id,
      {
        status: data.status,
        reason: data.reason,
        images: data.images,
        orderId: data.orderId,
        productId: data.productId,
        userId: data.userId,
        message: data.message,
      },
      { new: true, runValidators: true }
    );

    if (!updatedReturn) {
      return res.status(404).json({
        success: false,
        message: "Return not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedReturn,
      message: "Return updated ✅",
    });

  } catch (error) {
    console.error("UPDATE Returns ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReturns = async (_req, res) => {
  try {
    const page = parseInt(_req.query.page) || 1;
    const limit = parseInt(_req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await Returns.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Returns.countDocuments();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({ data, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getReturnById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id,'id')
    const data = await Returns.find({
      $or: [
        { _id: id },
        { userId: id },
        { orderId: id },
        { productId: id }
      ]
    })
    // console.log(data,'data')
    if (!data) {
      return res.status(404).json({ message: "Returns not found" });
    }

    res.status(200).json({
      data: data,
      message: "Returns found ✅",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id,'id')
    const returns = await Returns.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      data: returns,
      message: "Returns deleted ✅",
    });
  } catch (error) {
    console.error("DELETE Returns ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
