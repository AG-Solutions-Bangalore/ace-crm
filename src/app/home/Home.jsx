import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
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


const tabContentVariants = {
 initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,   
      damping: 30,      
      mass: 0.8,       
      bounce: 0.25,    
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -20,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
      <div className="p-3 sm:p-4 md:p-6">
      
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          <StatCard
            title="Open Contract"
            value={dashboardData.contract_count}
            icon={FileText}
          />
          <StatCard
            title="Total Invoice"
            value={dashboardData.invoice_count}
            icon={ClipboardCheck}
          />
          <StatCard
            title="Order in Hand"
            value={dashboardData.invoice_order_in_hand}
            icon={CheckCircle}
          />
          <StatCard
            title="Pre Shipment"
            value={dashboardData.invoice_pre_shipment}
            icon={XCircle}
          />
          <StatCard
            title="Dispatched"
            value={dashboardData.invoice_dispatched}
            icon={XCircle}
          />
          <StatCard
            title="Stuffed"
            value={dashboardData.invoice_stuffed}
            icon={XCircle}
          />
        </div>

        
        <div className="mt-4">
          <Tabs defaultValue="combined" className="w-full">
      
            <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-gray-100/80 rounded-lg text-black">
              <TabsTrigger 
                value="combined" 
                className="flex items-center justify-center gap-2 h-8 py-0 data-[state=active]:bg-blue-500/20 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Sales Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="polar" 
                className="flex items-center justify-center gap-2 h-8 py-0 data-[state=active]:bg-rose-500/20 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                <PieChart className="h-4 w-4" />
                <span className="text-sm font-medium">Balance Distribution</span>
              </TabsTrigger>
            </TabsList>


         
            <AnimatePresence mode="wait">
              <TabsContent value="combined" className="mt-1">
                <motion.div
                  key="combined"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
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
                    isMobile={isMobile}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="polar" className="mt-1">
                <motion.div
                  key="polar"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DashboardPolarChart
                    title="Balance Distribution by Country"
                    graphData={dashboardData?.graph3 || []}
                    usdToInr={dashboardData?.usd_to_inr}
                    isLoadingdashboord={isLoadingdashboord}
                    isErrordashboord={isErrordashboord}
                    refetchdashboord={refetchdashboord}
                    isMobile={isMobile}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </Page>
  );
};

export default Home;