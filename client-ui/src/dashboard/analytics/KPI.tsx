import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { ChartLineStep } from "./ChartLineStep";
import OrdersAreaChart from "./AreaChart";
import ReturnsChart from "./ChartBarDefault";
import CustomersVisitorsChart from "./ChartAreaLegend";
type Orders = {
  _id: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
};

export default function KPI() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/payment/orders?page=1&limit=1000`);
      setOrders(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ KPI CALCULATIONS
  const {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalItemsSold,
  } = useMemo(() => {
    let revenue = 0;
    let total = orders.length;
    let pending = 0;
    let itemsSold = 0;

    orders.forEach((order) => {
      // ✅ revenue only from success payments
      if (order.paymentStatus === "success") {
        revenue += order.totalAmount;
      }

      // ✅ pending count
      if (order.paymentStatus === "pending") {
        pending++;
      }

      // ✅ total items sold
      order.items.forEach((item) => {
        itemsSold += item.quantity;
      });
    });

    return {
      totalRevenue: revenue,
      totalOrders: total,
      pendingOrders: pending,
      totalItemsSold: itemsSold,
    };
  }, [orders]);

  if (loading) {
    return (
      <section>
        <div className="p-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">

          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-sm shadow-sm p-4 border space-y-3"
            >
              {/* Title Skeleton */}
              <div className="h-4 w-24 bg-gray-200 rounded"></div>

              {/* Value Skeleton */}
              <div className="h-7 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}

        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-65 p-8 flex flex-col gap-5 w-full md:w-100 bg-card rounded-sm shadow-sm border-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            {/* Value Skeleton */}
            <div className="h-25 w-full bg-gray-300 rounded"></div>
            <div className="h-7 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="h-65 p-8 flex flex-col gap-5 w-full md:w-100 bg-card rounded-sm shadow-sm border-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            {/* Value Skeleton */}
            <div className="h-25 w-full bg-gray-300 rounded"></div>
            <div className="h-7 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="h-65 p-8 flex flex-col gap-5 w-full md:w-100 bg-card rounded-sm shadow-sm border-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            {/* Value Skeleton */}
            <div className="h-25 w-full bg-gray-300 rounded"></div>
            <div className="h-7 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="h-65 p-8 flex flex-col gap-5 w-full md:w-100 bg-card rounded-sm shadow-sm border-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            {/* Value Skeleton */}
            <div className="h-25 w-full bg-gray-300 rounded"></div>
            <div className="h-7 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 💰 Revenue */}
        <div className="bg-card rounded-sm shadow-xs p-4 border-2">
          <h3 className="text-md font-semibold text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>

        {/* 📦 Orders */}
        <div className="bg-card rounded-sm shadow-xs p-4 border-2">
          <h3 className="text-md font-semibold text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">
            {totalOrders}
          </p>
        </div>

        {/* 🕒 Pending */}
        <div className="bg-card rounded-sm shadow-xs p-4 border-2">
          <h3 className="text-md font-semibold text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        {/* 🛒 Items Sold */}
        <div className="bg-card rounded-sm shadow-xs p-4 border-2">
          <h3 className="text-md font-semibold text-gray-500">Items Sold</h3>
          <p className="text-2xl font-bold text-blue-600">
            {totalItemsSold}
          </p>
        </div>
      </div>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="">
          <OrdersAreaChart />
        </div>
        <div className="">
          <CustomersVisitorsChart />
        </div>
        <div className="">
          <ReturnsChart />
        </div>
        <div className="">
          <ChartLineStep />
        </div>
      </div>
    </section>
  );
}