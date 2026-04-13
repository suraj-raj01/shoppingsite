import mongoose from "mongoose"

const enquiryUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        uniquie: true,
    },
    contact: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model("EnquiryUser", enquiryUserSchema)