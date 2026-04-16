"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  "Returns Item": {
    label: "Returns Item",
    color: "#6096ff",
  },
} satisfies ChartConfig;

export default function ReturnsChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/returns`);
        const data = res.data?.data || [];

        // ✅ Month order
        const monthsOrder = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // ✅ Initialize map
        const monthMap: Record<string, number> = {};
        monthsOrder.forEach((m) => (monthMap[m] = 0));

        // ✅ Count returns per month
        data.forEach((item: any) => {
          if (!item.createdAt) return;

          const date = new Date(item.createdAt);
          const monthName = date.toLocaleString("default", {
            month: "long",
          });

          if (monthMap[monthName] !== undefined) {
            monthMap[monthName]++;
          }
        });

        // ✅ Get last 6 months dynamically
        const currentMonthIndex = new Date().getMonth();
        const last6MonthsIndexes = Array.from({ length: 6 }, (_, i) =>
          (currentMonthIndex - 5 + i + 12) % 12
        );

        const formattedData = last6MonthsIndexes.map((index) => {
          const month = monthsOrder[index];
          return {
            month,
            "Returns Item": monthMap[month] || 0,
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching returns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Total Return Items</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
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
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar
                dataKey="Returns Item"
                fill="#6096ff"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Returns trend <TrendingUp className="h-4 w-4 text-green-500" />
        </div>

        <div className="leading-none text-muted-foreground">
          Showing total returned items for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}