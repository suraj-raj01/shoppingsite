import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react"

export function UserInfo(userId: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const loadUser = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${BASE_URL}/api/customers/${userId.userId}`
            )
            setUser(response.data.data || {})
            // console.log(response.data,'userinfo')
        } catch (error) {
            console.error("Error fetching user:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUser();
    }, [])

    return (
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                {/* {user?.name?.charAt(0) || "U"} */}
                {user?.profile ? (
                    <img src={user?.profile} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                    user?.name?.charAt(0) || "U"
                )}
            </div>

            <div>
                <p className="font-semibold">
                    {loading ? "Loading..." : user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                    {user?.email}
                </p>
            </div>
        </div>
    )
}