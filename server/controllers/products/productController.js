import Product from "../../models/products/productModel.js";

// ================= SAFE JSON PARSER =================
const safeJSON = (value, fallback) => {
  try {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// ================= CREATE OR UPDATE =================
export const saveProduct = async (req, res) => {
  try {
    // console.log(req.body,'data')
    // 🟢 parse complex fields from UI
    const variants = safeJSON(req.body.variants, []);
    const shipping = safeJSON(req.body.shipping, {});
    const tags = safeJSON(req.body.tags, []);
    const existingImages = safeJSON(req.body.images, []);

    let uploadedImages = [];

    // ================= HANDLE FILES =================
    if (req.files?.length) {
      uploadedImages = req.files.map((file) => ({
        url: file.path || file.secure_url || file.url,
      }));
    }
    // console.log(req.body,'body')
    // ================= MERGE IMAGES =================
    const finalImages =
      uploadedImages.length > 0
        ? [...existingImages, ...uploadedImages]
        : existingImages;

    // ================= BUILD DATA =================
    const data = {
      ...req.body,
      variants,
      shipping,
      tags,
      images: finalImages,
      defaultImage:
        req.body.defaultImage ||
        finalImages?.[0]?.url ||
        "",
    };

    // remove id if accidentally sent
    delete data.id;
    delete data._id;
    // ================= CREATE =================

    const product = await Product.create(data);
    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created ✅",
    });
  } catch (error) {
    console.error("SAVE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= TRANDING PRODUCT =================
export const trandingProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({
      success: true,
      data: products,
      message: "Tranding Products fetched ✅",
    });
  } catch (error) {
    console.error("TRANDING PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 🟢 parse complex fields
    const variants = safeJSON(req.body.variants, []);
    const shipping = safeJSON(req.body.shipping, {});
    const tags = safeJSON(req.body.tags, []);
    const existingImages = safeJSON(req.body.images, []);

    let uploadedImages = [];

    // ================= HANDLE NEW FILES =================
    if (req.files?.length) {
      uploadedImages = req.files.map((file) => ({
        url: file.path || file.secure_url || file.url,
      }));
    }

    // ================= MERGE IMAGES =================
    const finalImages =
      uploadedImages.length > 0
        ? [...existingImages, ...uploadedImages]
        : existingImages;

    // ================= BUILD UPDATE DATA =================
    const updateData = {
      ...req.body,
      variants,
      shipping,
      tags,
      images: finalImages,
      defaultImage:
        req.body.defaultImage ||
        finalImages?.[0]?.url ||
        "",
    };

    // safety cleanup
    delete updateData.id;
    delete updateData._id;

    // ================= UPDATE =================
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated ✅",
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const skip = (page - 1) * limit + offset;

    const [products, total] = await Promise.all([
      Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 }),
      Product.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res.status(200).json({
      success: true,
      data: products,
      currentPage: page,
      totalPages,
      totalItems: total,
      message: "Products fetched ✅"
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE =================
import mongoose from "mongoose";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategory, brand, search } = req.query;

    const orConditions = [];

    // ✅ Search by id or slug
    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        orConditions.push({ _id: id });
      }
      orConditions.push({ slug: { $regex: id, $options: "i" } });
    }

    // ✅ Category filter (regex)
    if (category) {
      orConditions.push({
        category: { $regex: category, $options: "i" },
      });
    }

    // ✅ Subcategory filter
    if (subcategory) {
      orConditions.push({
        subcategory: { $regex: subcategory, $options: "i" },
      });
    }

    // ✅ Brand filter
    if (brand) {
      orConditions.push({
        brand: { $regex: brand, $options: "i" },
      });
    }

    // ✅ Generic search (name/title)
    if (search) {
      orConditions.push({
        name: { $regex: search, $options: "i" },
      });
    }

    // 🧠 Build final query
    const query =
      orConditions.length > 0 ? { $or: orConditions } : {};

    const products = await Product.find(query);

    if (!products.length) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ============== SEARCH ====================

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const skip = (page - 1) * limit + offset;

    // ✅ Single reusable filter
    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    };

    // ✅ Apply pagination + lean (faster)
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: products,
      currentPage: page,
      totalPages,
      totalItems: total,
      message: "Products fetched ✅",
    });
  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted 🗑️",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};