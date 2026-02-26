import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

type Props = {
    user: string | null
}

export default function AccessDenied({ user }: Props) {
    const loginUrl =
        user === "Guest" ? "/auth/login" : "/auth/adminlogin"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
            <div className="w-full max-w-md bg-white shadow-sm rounded-xs p-8 text-center border">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldAlert className="text-red-600 w-10 h-10" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Access Denied
                </h1>

                {/* Message */}
                <p className="text-gray-500 mb-6">
                    You don’t have permission to access this dashboard.
                    Please login with the correct account.
                </p>

                {/* Button */}
                <Link
                    to={loginUrl}
                    className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xs transition duration-300"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    )
}