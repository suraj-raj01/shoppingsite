import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import api from "@/Config"
import { Star } from "lucide-react"

export default function ReviewView() {
    const { id } = useParams()

    const [review, setReview] = useState<any>(null)
    const [user, setUser] = useState<any>(null)

    const [loadingReview, setLoadingReview] = useState(true)
    const [loadingUser, setLoadingUser] = useState(false)

    // ✅ Fetch Review
    useEffect(() => {
        const fetchReview = async () => {
            try {
                setLoadingReview(true)
                const response = await axios.get(`${api}/api/reviews/${id}`)
                setReview(response.data[0] || null)
            } catch (error) {
                console.error("Error fetching review:", error)
            } finally {
                setLoadingReview(false)
            }
        }
        fetchReview()
    }, [id])

    // ✅ Fetch User only when review.userId exists
    useEffect(() => {
        if (!review?.userId) return

        const loadUser = async () => {
            try {
                setLoadingUser(true)
                const response = await axios.get(
                    `${api}/api/customers/${review.userId}`
                )
                setUser(response.data.data || null)
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoadingUser(false)
            }
        }

        loadUser()
    }, [review?.userId])

    if (loadingReview) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }

    if (!review) {
        return (
            <div className="text-center text-red-500">
                Review not found
            </div>
        )
    }

    return (
        <section className="w-full md:max-w-2xl p-3">
            <div className="bg-background shadow-xs border rounded-xs p-6 space-y-4">

                {/* 👤 USER INFO */}
                <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                        {
                            loadingUser ? (
                                user?.name?.charAt(0) || "U"
                            ) : (
                                <img src={user?.profile} alt="profile" loading="lazy" className="w-full h-full object-cover" />
                            )
                        }
                    </div>

                    <div>
                        <p className="font-semibold">
                            {loadingUser ? "Loading..." : user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* ⭐ Rating */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={20}
                            className={
                                star <= review.ratings
                                    ? "fill-[#6096ff] text-[#6096ff]"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                        ({review.ratings}/5)
                    </span>
                </div>

                {/* 📝 Message */}
                <div>
                    <h2 className="text-lg font-semibold">Review</h2>
                    <p className="text-gray-700 mt-1">
                        {review.message}
                    </p>
                </div>

                {/* 🖼️ Images */}
                {review.images?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Images
                        </h2>
                        <div className="grid grid-cols-3 md:grid-cols-8 gap-3">
                            {review.images.map((img: any, index: number) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt="review"
                                    className="w-full md:h-15 md:w-20 object-cover rounded-xs border"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* 📅 Date */}
                <div className="text-sm text-gray-500">
                    Posted on:{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                </div>

            </div>
        </section>
    )
}
