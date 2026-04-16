// import { ChartLineStep } from "./ChartLineStep";
import OrdersAreaChart from "./AreaChart";
import ReturnsChart from "./ChartBarDefault";
import CustomersVisitorsChart from "./ChartAreaLegend";
import KPI from "./KPI";

export default function Analytics() {
  return (
    <section>
      <KPI/>
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
        {/* <div className="">
          <ChartLineStep />
        </div> */}
      </div>
    </section>
  );
}