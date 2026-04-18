// import { ChartLineStep } from "./ChartLineStep";
import OrdersAreaChart from "./AreaChart";
import ReturnsChart from "./ChartBarDefault";
import CustomersVisitorsChart from "./ChartAreaLegend";
import KPI from "./KPI";

export default function Analytics() {
  return (
    <section className="p-3 grid grid-cols-1 gap-4">
      <KPI />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="">
          <OrdersAreaChart />
        </div>
        <div className="">
          <CustomersVisitorsChart />
        </div>
        <div className="">
          <ReturnsChart />
        </div>
        {/* <div className="">
          <ChartLineStep />
        </div> */}

      </div>
        <div className="w-full h-50 rounded-sm bg-card shadow-sm px-5 py-2 border">
          <p className="font-bold text-lg text-gray-500">Recent Orders</p>
        </div>
    </section>
  );
}