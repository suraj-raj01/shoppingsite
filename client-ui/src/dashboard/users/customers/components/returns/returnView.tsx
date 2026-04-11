import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";

export default function ReturnView() {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/returns/${id}`);
            setReturns(res.data.data || []);
        } catch (error) {
            console.error("Error fetching returns:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (returns.length === 0) {
        return <div className="p-4">No return requests found</div>;
    }

    return (
        <div className="p-3 space-y-4">

            {returns.map((item) => (
                <div
                    key={item._id}
                    className="border md:max-w-md rounded-xs p-4 bg-background shadow-sm space-y-2"
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Return ID: {item._id}
                        </p>

                        <Badge
                            className={`capitalize ${item.status === "pending"
                                ? "bg-yellow-500"
                                : item.status === "approved"
                                    ? "bg-[#6096ff]"
                                    : "bg-red-500"
                                }`}
                        >
                            {item.status}
                        </Badge>
                    </div>

                    {/* DETAILS */}
                    <div className="text-sm space-y-1 bg-muted p-3 rounded-xs">
                        <div className="flex items-center justify-between">
                            <p><strong>OrderId :</strong> {item.orderId}</p>
                            <Badge variant='outline' className="cursor-pointer">
                                <Link to={`/dashboard/orders/${item.orderId}/view`}>
                                    View Order
                                </Link>
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <p><strong>ProductId :</strong> {item.productId}</p>
                            <Badge variant='outline' className="cursor-pointer">
                                <Link to={`/dashboard/products/${item.productId}/view`}>
                                    View Product
                                </Link>
                            </Badge>
                        </div>
                        <p><strong>Reason :</strong> {item.reason}</p>
                        <p><strong>Message :</strong> {item.message}</p>
                    </div>

                    {/* IMAGES */}
                    <div className="flex gap-2 flex-wrap">
                        {item.images.map((img: string, i: number) => (
                            <img
                                key={i}
                                src={img}
                                className="w-16 h-16 object-cover rounded border"
                            />
                        ))}
                    </div>

                    {/* DATE */}
                    <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}