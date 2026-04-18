"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  "Item Sold": {
    label: "Item Sold",
    color: "#6096ff",
  },
} satisfies ChartConfig;

export default function OrdersAreaChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/payment/orders`);
        const orders = res.data?.data || [];

        // ✅ Month order
        const monthsOrder = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // ✅ Initialize month map
        const monthMap: Record<string, number> = {};
        monthsOrder.forEach((m) => (monthMap[m] = 0));

        // ✅ Process orders
        orders.forEach((order: any) => {
          if (!order.createdAt) return;

          const date = new Date(order.createdAt);
          const monthName = date.toLocaleString("default", {
            month: "long",
          });

          // ✅ Sum total quantity in order
          const totalItems = order.items?.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
          );

          if (monthMap[monthName] !== undefined) {
            monthMap[monthName] += totalItems;
          }
        });

        // ✅ Last 6 months
        const currentMonthIndex = new Date().getMonth();
        const last6MonthsIndexes = Array.from({ length: 4 }, (_, i) =>
          (currentMonthIndex - 3 + i + 12) % 12
        );

        const formattedData = last6MonthsIndexes.map((index) => {
          const month = monthsOrder[index];
          return {
            month,
            "Item Sold": monthMap[month] || 0,
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Total Sold Items</CardTitle>
        <CardDescription>
          Showing total products sold for the last 6 months
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="p-4 space-y-2 animate-pulse">
            {/* Header Skeleton */}
            {/* <div className="h-5 w-40 bg-gray-200 rounded"></div> */}

            {/* Chart Skeleton */}
            <div className="h-35 w-full bg-gray-200 rounded-md"></div>

            {/* Footer Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              {/* <div className="h-4 w-40 bg-gray-200 rounded"></div> */}
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                dataKey="Item Sold"
                type="natural"
                fill="#6096ff"
                fillOpacity={0.5}
                stroke="#6096ff"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Products sold trend{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>

            <div className="text-muted-foreground">
              Last 6 months performance
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}