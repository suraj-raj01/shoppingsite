import { useState } from "react";
import { Star, X, Upload, Camera, CheckCircle, MessageSquare, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BASE_URL from "@/Config";
import axios from "axios";
import { toast } from "sonner";
import { UserInfo } from "./UserInfo";
import { useNavigate } from "react-router-dom";
import ReviewRating from "./reviewRating";

type Reviews = {
  _id: string;
  userId: string;
  productId: string;
  ratings: number;
  message: string;
  images: [];
  createdAt: string;
  updatedAt: string;
};

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const ratingColors: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-500",
  4: "text-lime-500",
  5: "text-green-500",
};

export default function ReviewForm({
  productId,
  userId,
  reviews,
}: {
  productId: string;
  userId: string;
  reviews: Reviews[];
}) {
  const [ratings, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const filteredData = reviews.filter((item) => item.productId === productId);
  const navigate = useNavigate();

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append("images", file));
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/upload/multiple`, fd);
      setImages((prev) => [...prev, ...res.data.files]);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratings) {
      toast.error("Please select a star rating");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/reviews`, {
        ratings,
        message,
        images,
        userId,
        productId,
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setMessage("");
      setImages([]);
      navigate("/");
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hover || ratings;

  return (
    <section className="w-full max-w-full mx-auto md:px-2 py-6 space-y-10">

      {/* ───── EXISTING REVIEWS ───── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-green-50 text-green-500">
            <MessageSquare size={18} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Customer Reviews
          </h2>
          {filteredData.length > 0 && (
            <Badge className="bg-green-100 text-green-600 hover:bg-green-100 font-semibold rounded-full px-3">
              {filteredData.length}
            </Badge>
          )}
        </div>

        {filteredData.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400">
              <Star size={40} className="opacity-20" />
              <p className="text-sm font-medium">No reviews yet — be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((item) => (
              <Card
                key={item._id}
                className="group relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white rounded-sm"
              >
                {/* Accent top bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-400 to-green-500 rounded-t-xl" />

                <CardContent className="pt-5 pb-4 px-4 space-y-3">
                  <UserInfo userId={item.userId} />

                  <Badge
                    variant="secondary"
                    className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-500"
                  >
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>

                  {/* Stars + label */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className={
                            star <= item.ratings
                              ? "fill-[#6096ff] text-[#6096ff]"
                              : "text-slate-200 fill-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${ratingColors[item.ratings]}`}>
                      {ratingLabels[item.ratings]}
                    </span>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Message */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 border-l-2 border-green-200 pl-3">
                    {item.message}
                  </p>

                  {/* Images */}
                  {item.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(item.images as any[]).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={`review-img-${i}`}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 hover:scale-105 transition-transform duration-150 cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ───── FORM + RATING SUMMARY ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* FORM */}
        <Card className="lg:col-span-2 rounded-sm border border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Star size={20} className="text-green-500" />
              Write a Review
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Your feedback helps other shoppers</p>
          </CardHeader>

          <Separator />

          <CardContent className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* STAR RATING */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Star size={13} /> Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none transition-transform hover:scale-125 active:scale-110 duration-150"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-150 ${activeRating >= star
                          ? "fill-slate-100 text-[#6096ff]"
                          : "text-slate-200 fill-[#6096ff]"
                          }`}
                      />
                    </Button>
                  ))}
                  {activeRating > 0 && (
                    <span className={`text-sm font-bold ml-2 ${ratingColors[activeRating]}`}>
                      {ratingLabels[activeRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <MessageSquare size={13} /> Your Review
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your honest experience — what did you love or what could be better?"
                  rows={5}
                  required
                  className="resize-none rounded-sm border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-green-400 transition"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Camera size={13} /> Add Photos
                  <span className="normal-case font-normal text-slate-300 tracking-normal">(optional)</span>
                </label>

                {/* Drop Zone */}
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleImageUpload(e.dataTransfer.files);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 w-full rounded-sm border-2 border-dashed py-8 cursor-pointer transition-colors duration-150 ${dragOver
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-slate-50 hover:border-green-300 hover:bg-green-50/50"
                    }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={loading}
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Upload size={18} className="text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-600">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={img.url}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-xl border-2 border-slate-100 shadow-sm"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition-colors duration-150"
                        >
                          <X size={10} />
                        </Button>
                      </div>
                    ))}
                    {/* Add more tile */}
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-green-300 hover:text-green-400 cursor-pointer transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                      <ImageIcon size={18} />
                      <span className="text-[10px] mt-1 font-medium">Add more</span>
                    </label>
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-sm text-sm font-semibold bg-[#6096ff] hover:bg-[#4b82f7] text-white shadow-md shadow-green-200 hover:shadow-green-300 transition-all duration-150 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle size={17} />
                    Submit Review
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* RATING SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="rounded-sm border border-slate-100 shadow-sm bg-white sticky top-4">
            <CardContent className="p-5">
              <ReviewRating rating={4.5} totalReviews={filteredData.length} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}