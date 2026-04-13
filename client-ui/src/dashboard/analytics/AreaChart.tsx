import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A simple area chart"

const chartData = [
  { month: "January", "Item Sold": 186 },
  { month: "February", "Item Sold": 305 },
  { month: "March", "Item Sold": 237 },
  { month: "April", "Item Sold": 73 },
  { month: "May", "Item Sold": 209 },
  { month: "June", "Item Sold": 214 },
]

const chartConfig = {
  "Item Sold": {
    label: "Item Sold",
    color: "#6096ff",
  },
} satisfies ChartConfig

export function ChartAreaDefault() {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Total Sold Items </CardTitle>
        <CardDescription>
          Showing Total product solds for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Products sold in last 6 months <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2026
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
