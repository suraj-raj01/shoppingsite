import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
    {
        aboutTitle: {
            type: String,
        },
        aboutDesc: {
            type: String,
        },
        contactTitle: {
            type: String,
        },
        contactDesc: {
            type: String,
        },
        followus: {
            type: String
        },
        icons: [
            {
                title: String,
                url: String
            }
        ],
        copyright: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);
