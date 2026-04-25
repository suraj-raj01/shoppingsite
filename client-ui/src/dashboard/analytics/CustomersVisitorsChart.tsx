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
  visitors: {
    label: "Visitors",
    color: "#6096ff",
  },
} satisfies ChartConfig;

export default function CustomersVisitorsChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/customers`);
        const customers = res.data?.data || [];

        const monthsOrder = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const monthMap: Record<string, number> = {};
        monthsOrder.forEach((m) => (monthMap[m] = 0));

        // ✅ Count users per month
        customers.forEach((user: any) => {
          if (!user.updatedAt) return;

          const date = new Date(user.updatedAt);
          const monthName = date.toLocaleString("default", {
            month: "long",
          });

          if (monthMap[monthName] !== undefined) {
            monthMap[monthName] += 1;
          }
        });

        // ✅ Correct last 6 months logic
        const currentMonthIndex = new Date().getMonth();

        const last6MonthsIndexes = Array.from({ length: 6 }, (_, i) =>
          (currentMonthIndex - 5 + i + 12) % 12
        );

        const formattedData = last6MonthsIndexes.map((index) => {
          const month = monthsOrder[index];
          return {
            month,
            visitors: monthMap[month] || 0,
          };
        });

        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="p-4 space-y-2 animate-pulse">
            <div className="h-35 w-full bg-gray-200 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ left: 5, right: 5, top: 5 }}>
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

              <Bar
                dataKey="visitors"
                fill="#6096ff"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Visitors trend
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