import { Link } from "react-router-dom";

type Props = {
    user: string | null
}


export default function AccessDenied({ user }: Props) {
    const loginUrl =
        user === "Guest" ? "/auth/login" : "/auth/adminlogin";

    return (
        <div className="fixed inset-0 z-100 w-screen h-screen bg-background flex items-center justify-center p-6">
            <p className="text-lg font-bold uppercase text-center">
                Access Denied. Please{" "}
                <Link
                    to={loginUrl}
                    className="text-blue-600 underline px-2"
                >
                    login
                </Link>{" "}
                to view dashboard.
            </p>
        </div>
    );
}