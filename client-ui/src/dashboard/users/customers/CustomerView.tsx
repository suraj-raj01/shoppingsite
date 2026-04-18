import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BASE_URL from "@/Config";
import axios from "axios";
import { Edit } from "lucide-react";
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
            <div className="max-w-md border shadow-sm rounded-sm px-4 py-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-bold uppercase">User Details</h2>
                    <Button size='sm' variant='outline' className="rounded-xs shadow-none border-0 transition">
                        <Link to={`/dashboard/profile/${user._id}`}><Edit /></Link>
                    </Button>
                </div>
                <Separator className="mb-2"/>
                <div className="flex items-center gap-6">
                    <div className="w-full">
                        <h2 className="text-2xl font-bold">
                            {user.name}
                        </h2>
                        <div className="py-3 px-2 rounded-sm grid grid-cols-1 gap-1 font-semibold bg-secondary w-full">
                            <p className="text-sm">Email : {user.email}</p>
                            <p className="text-sm">Phone : +91 {user.contact}</p>
                            <p className="text-sm">ID : {user._id}</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className=" my-2 border-t" />

                {/* Details */}
                <div className="flex flex-col items-start justify-center gap-2">
                    <div>
                        <p className="text-md font-semibold uppercase">Address</p>
                        <p className="font-sm">{user.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}