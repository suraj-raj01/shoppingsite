import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BASE_URL from "@/Config";
import axios from "axios";
import { toast } from "sonner";
import { UserInfo } from "./UserInfo";

type Reviews = {
  _id: string,
  userId: string,
  productId: string,
  ratings: number,
  message: string,
  images: [],
  createdAt: string,
  updatedAt: string,
}

export default function ReviewForm({ productId, userId, reviews }: { productId: string, userId: string, reviews: Reviews[] }) {
  const [ratings, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<any[]>([]); // store uploaded URLs

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

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ratings) {
      alert("Please select rating");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/reviews`, {
        ratings,
        message,
        images,
        userId: userId,
        productId: productId,
      });

      toast.success("Review submitted ✅");
      // reset
      setRating(0);
      setMessage("");
      setImages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="grid md:grid-cols-2 gap-8 mb-5">
      {/* USER PREVIEW */}
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
        {
          reviews.map((item) => {
            return (
              <div key={item._id}>
                <section className="w-full border h-full p-2 md:max-w-2xl">
                  <div className="bg-white shadow-none rounded-xs space-y-4">

                    {/* 👤 USER INFO */}
                    <UserInfo userId={item?.userId} />
                    {/* 📅 Date */}
                    <div className="text-sm text-gray-500">
                      Posted on:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>

                    {/* ⭐ Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={
                            star <= item.ratings
                              ? "text-green-500 fill-green-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({item.ratings}/5)
                      </span>
                    </div>

                    {/* 📝 Message */}
                    <div className="w-full">
                      <div className="w-full">
                        <h2 className="text-lg font-semibold">Review</h2>
                        <p className="text-gray-700 mt-1">
                          {item.message}
                        </p>
                      </div>
                      {/* 🖼️ Images */}
                      {item?.images?.length > 0 && (
                        <div className="w-full">
                          <h2 className="text-lg font-semibold mb-2">
                            Images
                          </h2>
                          <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
                            {item?.images?.map((img: any, index: number) => (
                              <img
                                key={index}
                                src={img.url}
                                alt="review"
                                className="w-full h-10 w-12 object-cover rounded-xs border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )
          })
        }
      </div>
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-full h-fit border bg-white p-3 rounded-xs shadow"
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
          disabled={loading}
          className="w-full mb-5 text-white cursor-pointer bg-green-500 hover:bg-green-600"
        >
          {loading ? "Uploading..." : "Submit Review"}
        </Button>
      </form>
    </section>
  );
}