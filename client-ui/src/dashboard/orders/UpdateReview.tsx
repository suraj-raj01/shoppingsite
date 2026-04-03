import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BASE_URL from "@/Config";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateReview() {
    const [ratings, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [images, setImages] = useState<any[]>([]);

    const {id} = useParams();

    // ================= IMAGE UPLOAD =================
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fd = new FormData();
        Array.from(files).forEach((file) => {
            fd.append("images", file);
        });

        setLoading(true);

        try {
            const res = await axios.post(
                `${BASE_URL}/api/admin/upload/multiple`,
                fd
            );

            const uploaded = res.data.files; // [{url: ""}]

            setImages((prev) => [...prev, ...uploaded]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ❌ Remove Image
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const navigate = useNavigate();
    // ================= SUBMIT =================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ratings) {
            alert("Please select rating");
            return;
        }

        try {
            await axios.patch(`${BASE_URL}/api/reviews/${id}`, {
                ratings,
                message,
            });

            toast.success("Review Updated ✅");
            // reset
            setRating(0);
            setMessage("");
            setImages([]);
            navigate("/dashboard/allreviews");
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReview = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/reviews/${id}`);
            setRating(response.data[0].ratings);
            setMessage(response.data[0].message);
            setImages(response.data[0].images);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching review:", error);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [id]);
    return (
        <section className="p-3">
            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="space-y-3 w-full md:max-w-2xl h-fit border bg-white p-3 rounded-xs shadow"
            >
                <h2 className="text-xl font-semibold">Write a Review</h2>

                {/* ⭐ STAR RATING */}
                <div>
                    <label className="block mb-2 font-medium">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className={`h-7 w-7 cursor-pointer transition ${(hover || ratings) >= star
                                    ? "fill-green-500 text-green-500"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* MESSAGE */}
                <div>
                    <label className="block mb-2 font-medium">Your Review</label>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your experience..."
                        className="focus:ring-2 focus:ring-green-500"
                        rows={5}
                        required
                    />
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                    <label className="block mb-2 font-medium">Upload Images</label>

                    <input
                        type="file"
                        multiple
                        disabled={loading}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border p-2"
                    />
                    {loading ? "Uploading..." : ""}
                    {/* PREVIEW */}
                    <div className="flex gap-3 mt-3 flex-wrap">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.url}
                                    className="h-20 w-20 object-cover rounded border"
                                />

                                {/* REMOVE BTN */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mb-5 text-white cursor-pointer bg-green-500 hover:bg-green-600"
                >
                    {loading ? "Updating..." : "Update Review"}
                </Button>
            </form>
        </section>
    )
}