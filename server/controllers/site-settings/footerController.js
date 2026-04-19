import Footer from "../../models/site-settings/FooterModel.js";

// ================= CREATE Footer =================
export const createFooter = async (req, res) => {
  try {
    const data = req.body;
    const hero = await Footer.create(data);
    return res.status(201).json({
      success: true,
      data: hero,
      message: "Footer created ✅",
    });
  } catch (error) {
    console.error("CREATE NAVBAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE Footer =================
export const updateFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Footer.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Footer updated ✅",
    });
  } catch (error) {
    console.error("UPDATE NAVBAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
export const getFooter = async (req, res) => {
  try {
    const data = await Footer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE =================
export const getFooterById = async (req, res) => {
  try {
    const data = await Footer.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Footer not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
export const deleteFooter = async (req, res) => {
  try {
    await Footer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Footer deleted 🗑️",
    });
  } catch (error) {
    console.error("DELETE NAVBAR ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};