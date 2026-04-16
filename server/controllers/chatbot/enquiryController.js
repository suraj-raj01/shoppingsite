
import Enquiry from "../../models/chatbot/enquiryUserModel.js";

// ================= CREATE Enquiry =================
export const createEnquiry = async (req, res) => {
    try {
        const data = req.body;
        const existing = await Enquiry.find({
            email: data.email
        });
        // console.log(existing,'existing')

        if (existing.length > 0) {
            return res.status(200).json({
                success: true,
                data: existing,
                message: "Thank you for reaching out again! We've already received your enquiry. Our team will get back to you shortly. 😊",
            });
        }

        const enquiry = await Enquiry.create(data);
        res.status(201).json({
            success: true,
            message: "User infrormation saved ✅",
            data: enquiry,
        });
    } catch (error) {
        console.error("Enquiry ERROR:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// ================= UPDATE Enquiry =================
export const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Enquiry.findByIdAndUpdate(
            id,
            {
                ...req.body,
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Enquiry updated ✅",
        });

    } catch (error) {
        console.error("UPDATE ENQUIRY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL =================
export const getEnquirys = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const data = await Enquiry.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Enquiry.countDocuments();
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page: Number(page),
                totalPages,
            },
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= GET ONE =================
export const getEnquiryById = async (req, res) => {
    try {
        const data = await Enquiry.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Enquiry not found" });
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
export const deleteEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Enquiry deleted 🗑️",
        });
    } catch (error) {
        console.error("DELETE Enquiry ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};