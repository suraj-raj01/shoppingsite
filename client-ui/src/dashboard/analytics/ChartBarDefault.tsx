"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
  { month: "January", "Returns Item": 186 },
  { month: "February", "Returns Item": 305 },
  { month: "March", "Returns Item": 237 },
  { month: "April", "Returns Item": 73 },
  { month: "May", "Returns Item": 209 },
  { month: "June", "Returns Item": 214 },
]

const chartConfig = {
  "Returns Item": {
    label: "Returns Item",
    color: "#6096ff",
  },
} satisfies ChartConfig

export function ChartBarDefault() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Total Return Itmes</CardTitle>
        <CardDescription>January - June 2026</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Bar dataKey="Returns Item" fill="#6096ff" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Products return in last 6 month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total returns item for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
