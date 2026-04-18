import { Button } from "@/components/ui/button";
import BASE_URL from "@/Config";
import axios from "axios";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UsersView() {
    const [user, setUser] = useState<any>(null);
    const { id } = useParams();

    const loadUser = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/admin/users/getuserbyid/${id}`
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
            <div className="max-w-md border shadow-xs rounded-sm p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-semibold">USER DETAILS</h2>
                    <Button size='sm' variant='outline' className="border shadow-none rounded-xs transition">
                        <Link to={`/dashboard/users/${user._id}`}>
                            <EditIcon />
                        </Link>
                    </Button>
                </div>
                <div className="flex py-2 px-1 rounded-sm items-center bg-secondary gap-6">
                    <img
                        src={user.profile}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-2"
                    />

                    <div>
                        <h2 className="text-2xl font-bold">
                            {user.name}
                        </h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col mt-2 items-start justify-center gap-1">
                    <div>
                        <p className="text-sm font-medium uppercase">User ID</p>
                        <p className="font-normal">{user._id}</p>
                    </div>

                    <div>
                        <p className="text-sm uppercase font-medium">Roles</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {user.roleId?.map((role: any) => (
                                <span
                                    key={role._id}
                                    className=" text-sm font-semibold bg-[#5089fa] text-white border px-2 py-1 rounded-xs"
                                >
                                    {role.role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}