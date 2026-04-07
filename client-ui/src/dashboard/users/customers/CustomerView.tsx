import { Button } from "@/components/ui/button";
import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CustomerView() {
    const [user, setUser] = useState<any>(null);
    const { id } = useParams();

    const loadUser = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/customers/${id}`
            );
            setUser(res.data.data); // ✅ important fix
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    if (!user) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-3 w-full">
            <div className="max-w-md border shadow-md rounded-xs p-5">
                {/* Header */}
                <div className="md:mt-8 md:absolute text-right top-13 md:left-88">
                    <Button variant='outline' className="px-5 py-2 rounded-xs transition">
                        <Link to={`/dashboard/profile/${user._id}`}>Edit User</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.name}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-gray-500">+91 {user.contact}</p>
                        <p className="text-gray-500">ID : {user._id}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className=" my-2 border-t" />

                {/* Details */}
                <div className="flex flex-col items-start justify-center gap-2">
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{user.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}