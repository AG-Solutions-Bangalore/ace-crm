import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  ClipboardCheck,
  CheckCircle,
  Package,
  Truck,
  Boxes,
  BarChart3,
  PieChart,
  XCircle,
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

const CARD_THEMES = {
  "Open Contract": {
    gradient: "from-blue-500 to-indigo-600",
    borderColor: "hover:border-blue-400 dark:hover:border-blue-800",
    glowColor: "from-blue-400/10 to-transparent",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBorder: "border-blue-100 dark:border-blue-900/50",
    iconBg: "bg-blue-50/80 dark:bg-blue-950/30",
    statusText: "Active Contracts",
    dotColor: "bg-blue-500",
  },
  "Total Invoice": {
    gradient: "from-violet-500 to-purple-600",
    borderColor: "hover:border-violet-400 dark:hover:border-violet-800",
    glowColor: "from-violet-400/10 to-transparent",
    iconColor: "text-violet-600 dark:text-violet-400",
    badgeBorder: "border-violet-100 dark:border-violet-900/50",
    iconBg: "bg-violet-50/80 dark:bg-violet-950/30",
    statusText: "Invoices Generated",
    dotColor: "bg-violet-500",
  },
  "Order in Hand": {
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "hover:border-emerald-400 dark:hover:border-emerald-800",
    glowColor: "from-emerald-400/10 to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-100 dark:border-emerald-900/50",
    iconBg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    statusText: "Awaiting Shipment",
    dotColor: "bg-emerald-500",
  },
  "Pre Shipment": {
    gradient: "from-amber-500 to-orange-600",
    borderColor: "hover:border-amber-400 dark:hover:border-amber-800",
    glowColor: "from-amber-400/10 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    badgeBorder: "border-amber-100 dark:border-amber-900/50",
    iconBg: "bg-amber-50/80 dark:bg-amber-950/30",
    statusText: "Awaiting Inspection",
    dotColor: "bg-amber-500",
  },
  Dispatched: {
    gradient: "from-sky-500 to-blue-600",
    borderColor: "hover:border-sky-400 dark:hover:border-sky-800",
    glowColor: "from-sky-400/10 to-transparent",
    iconColor: "text-sky-600 dark:text-sky-400",
    badgeBorder: "border-sky-100 dark:border-sky-900/50",
    iconBg: "bg-sky-50/80 dark:bg-sky-950/30",
    statusText: "Orders In-Transit",
    dotColor: "bg-sky-500",
  },
  Stuffed: {
    gradient: "from-rose-500 to-pink-600",
    borderColor: "hover:border-rose-400 dark:hover:border-rose-800",
    glowColor: "from-rose-400/10 to-transparent",
    iconColor: "text-rose-600 dark:text-rose-400",
    badgeBorder: "border-rose-100 dark:border-rose-900/50",
    iconBg: "bg-rose-50/80 dark:bg-rose-950/30",
    statusText: "Loaded Containers",
    dotColor: "bg-rose-500",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

const StatCard = ({ title, value, icon: Icon }) => {
  const theme = CARD_THEMES[title] || {
    gradient: "from-gray-500 to-slate-600",
    borderColor: "hover:border-gray-400 dark:hover:border-gray-600",
    glowColor: "from-gray-400/10 to-transparent",
    iconColor: "text-gray-600 dark:text-gray-400",
    iconBg: "bg-gray-50 dark:bg-gray-800",
    badgeBorder: "border-gray-100 dark:border-gray-600",
    statusText: "Overview",
    dotColor: "bg-gray-400",
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="h-full"
    >
      <Card
        className={`relative h-full overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md ${theme.borderColor}`}
      >
        {/* Subtle decorative glow */}
        <div
          className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${theme.glowColor} blur-xl pointer-events-none`}
        />

        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </span>
          <div
            className={`p-2.5 rounded-xl border ${theme.badgeBorder} ${theme.iconBg} ${theme.iconColor} transition-transform duration-300 hover:scale-105`}
          >
            <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-1 pb-4">
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {value ?? 0}
            </span>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${theme.dotColor} animate-pulse`}
              />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                {theme.statusText}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
      },
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
                <span className="text-sm font-medium">
                  Balance Distribution
                </span>
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
