import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  ClipboardCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Page from "../dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import axios from "axios";

import DashboardPolarChart from "./DashboardPolarChart"; 
import DashboardCombinedChart from "./DashboardCombinedChart";

const StatCard = ({ title, value, icon: Icon, className }) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-yellow-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </CardContent>
  </Card>
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Home = () => {
  const currentDates = new Date();
  const currentYear = currentDates.getFullYear();
  const currentMonthIndex = currentDates.getMonth();
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  
  const getYears = () => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const years = [];

    if (currentYear < startYear) {
      return [startYear.toString()];
    }

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year.toString());
    }

    return years;
  };
  
  const years = getYears(); 

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    const year_month = `${selectedMonth} ${selectedYear}`;

    const response = await axios.post(
      `${BASE_URL}/api/panel-get-dashboard`,
      {
        year_month,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const {
    data: dashboardData,
    isLoading: isLoadingdashboord,
    isError: isErrordashboord,
    refetch: refetchdashboord,
  } = useQuery({
    queryKey: ["dashboardData", selectedYear, selectedMonth],
    queryFn: fetchDashboardData,
  });

  const handleMonthYearChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    refetchdashboord(); 
  };

  if (isLoadingdashboord) {
    return <LoaderComponent name="dashboard Data" />; 
  }

  if (isErrordashboord) {
    return <ErrorComponent message="Error Fetching dashboard Data" />;
  }

  return (
    <Page>
      <div className="p-6">
        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <StatCard
            title="Contract"
            value={dashboardData.contract_count}
            icon={FileText}
          />
          <StatCard
            title="Invoice"
            value={dashboardData.invoice_count}
            icon={ClipboardCheck}
          />
          <StatCard
            title="Invoice Order in Hand"
            value={dashboardData.invoice_order_in_hand}
            icon={CheckCircle}
          />
          <StatCard
            title="Invoice Pre Shipment"
            value={dashboardData.invoice_pre_shipment}
            icon={XCircle}
          />
          <StatCard
            title="Invoice Dispatched"
            value={dashboardData.invoice_dispatched}
            icon={XCircle}
          />
          <StatCard
            title="Invoice Stuffed"
            value={dashboardData.invoice_stuffed}
            icon={XCircle}
          />
        </div>

        <div className="mt-8">
  <DashboardCombinedChart
    barGraphData={dashboardData?.graph1 || []}
    pieGraphData={dashboardData?.graph2 || []}
    selectedYear={selectedYear}
    selectedMonth={selectedMonth}
    years={years}
    handleChange={handleMonthYearChange}
    currentYear={currentYear}
    currentMonthIndex={currentMonthIndex}
    isLoadingdashboord={isLoadingdashboord}
    isErrordashboord={isErrordashboord}
    refetchdashboord={refetchdashboord}
  />
</div>

       
        <div className="mt-8">
          <DashboardPolarChart
            title="Balance Distribution by Country"
            graphData={dashboardData?.graph3 || []}
            usdToInr={dashboardData?.usd_to_inr}
            isLoadingdashboord={isLoadingdashboord}
            isErrordashboord={isErrordashboord}
            refetchdashboord={refetchdashboord}
          />
        </div>

       
      </div>
    </Page>
  );
};

export default Home;