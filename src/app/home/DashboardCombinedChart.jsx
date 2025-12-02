import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Loader2, BarChart3, PieChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
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

const transformGraphData = (graphData = []) => {
  if (!Array.isArray(graphData)) return [];

  return graphData.map((item) => ({
    country: item.invoice_destination_country || "Unknown",
    total_value: parseFloat(item.total_value) || 0,
  }));
};

const transformPieData = (graphData = []) => {
  if (!Array.isArray(graphData)) return [];

  return graphData.map((item) => ({
    product: item.invoice_product || "Unknown",
    total_value: parseFloat(item.total_value) || 0,
  }));
};

const DashboardCombinedChart = ({
  barGraphData = [],
  pieGraphData = [],
  selectedYear,
  selectedMonth,
  years,
  handleChange,
  currentYear,
  currentMonthIndex,
  isLoadingdashboord,
  isErrordashboord,
  refetchdashboord,
  isMobile: parentIsMobile,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Use parent isMobile if provided, otherwise use local state
  const mobileView = parentIsMobile !== undefined ? parentIsMobile : isMobile;

  // Initialize years if not provided
  const availableYears = years || getYears();
  const currentDates = new Date();
  const currentYearValue = currentDates.getFullYear();
  const currentMonthIndexValue = currentDates.getMonth();
  
  // Set default year and month if not provided
  const defaultYear = selectedYear || String(currentYearValue);
  const defaultMonth = selectedMonth || months[currentMonthIndexValue];

  // Transform the graph data
  const barData = transformGraphData(barGraphData);
  const pieData = transformPieData(pieGraphData);

  // Prepare Bar Chart data
  const barLabels = barData.map((d) => d.country);
  const barValues = barData.map((d) => d.total_value);

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Invoice Value ($)",
        data: barValues,
        backgroundColor: [
          "#3B82F6", // Blue
          "#10B981", // Emerald
          "#8B5CF6", // Violet
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#EC4899", // Pink
          "#06B6D4", // Cyan
          "#84CC16", // Lime
          "#F97316", // Orange
          "#6366F1", // Indigo
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Create bar chart options with responsive settings
  const getBarChartOptions = () => {
    const isSmallScreen = window.innerWidth < 640;
    const isMediumScreen = window.innerWidth < 1024;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: isSmallScreen ? 5 : 10,
          right: isSmallScreen ? 5 : 10,
          top: 10,
          bottom: isSmallScreen ? 30 : 20,
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 10,
            font: {
              size: isSmallScreen ? 10 : 11,
            },
            boxWidth: isSmallScreen ? 8 : 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: !isSmallScreen,
            text: "Total Value ($)",
            font: {
              size: isSmallScreen ? 10 : 12,
              weight: "bold",
            },
          },
          ticks: {
            callback: function (value) {
              if (value >= 1000) return "$" + (value / 1000).toFixed(1) + "k";
              return "$" + value;
            },
            font: {
              size: isSmallScreen ? 9 : 10,
            },
            maxTicksLimit: isSmallScreen ? 5 : 8,
          },
          grid: {
            drawBorder: false,
          },
        },
        x: {
          title: {
            display: !isSmallScreen,
            text: "Destination Country",
            font: {
              size: isSmallScreen ? 10 : 12,
              weight: "bold",
            },
          },
          ticks: {
            font: {
              size: isSmallScreen ? 9 : 10,
            },
            maxRotation: isSmallScreen ? 90 : 45,
            minRotation: isSmallScreen ? 90 : 45,
            autoSkip: true,
            maxTicksLimit: isSmallScreen ? Math.min(5, barLabels.length) : 
                         isMediumScreen ? Math.min(8, barLabels.length) : 
                         Math.min(12, barLabels.length),
            padding: isSmallScreen ? 2 : 5,
          },
          grid: {
            display: false,
          },
          barPercentage: isSmallScreen ? 0.5 : isMediumScreen ? 0.7 : 0.8,
          categoryPercentage: isSmallScreen ? 0.6 : isMediumScreen ? 0.8 : 0.9,
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutQuart",
      },
    };
  };

  // Prepare Pie Chart data
  const pieTotalValue = pieData.reduce((sum, item) => sum + item.total_value, 0);
  const pieLabels = pieData.map((d) => d.product);
  const pieValues = pieData.map((d) => d.total_value);

  // Color palette for pie chart
  const pieBackgroundColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E',
  ];

  const pieChartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieBackgroundColors.slice(0, Math.min(pieValues.length, pieBackgroundColors.length)),
        borderColor: '#FFFFFF',
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: mobileView ? '60%' : '55%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = pieTotalValue > 0 ? ((value / pieTotalValue) * 100).toFixed(1) : '0.0';
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const hasBarData = barData.length > 0;
  const hasPieData = pieData.length > 0;
  const hasAnyData = hasBarData || hasPieData;

  return (
    <div className="border overflow-hidden rounded-lg w-full max-w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50" style={{ padding: mobileView ? '0.75rem' : '1.5rem' }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between" style={{ gap: '0.75rem' }}>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-bold text-gray-800" style={{ fontSize: mobileView ? '1.125rem' : '1.25rem' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap" style={{ gap: mobileView ? '0.5rem' : '1rem' }}>
                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                  <BarChart3 className="text-blue-600" style={{ height: mobileView ? '1rem' : '1.25rem', width: mobileView ? '1rem' : '1.25rem' }} />
                  <span style={{ fontSize: mobileView ? '0.875rem' : '1rem' }}>Invoice Analytics</span>
                </div>
                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                  <PieChart className="text-green-600" style={{ height: mobileView ? '1rem' : '1.25rem', width: mobileView ? '1rem' : '1.25rem' }} />
                  <span style={{ fontSize: mobileView ? '0.875rem' : '1rem' }}>Product Distribution</span>
                </div>
              </div>
            </CardTitle>
            <p className="text-gray-600" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem', marginTop: '0.25rem' }}>
              Combined view of invoice values by destination country and product distribution
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto" style={{ gap: '0.5rem' }}>
            {/* Year Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="justify-between bg-white hover:bg-gray-50"
                  size={mobileView ? "sm" : "default"}
                  style={{ width: mobileView ? '100%' : '8rem', fontSize: mobileView ? '0.75rem' : '0.875rem' }}
                >
                  <span className="truncate">{defaultYear}</span>
                  <ChevronDown style={{ marginLeft: '0.5rem', height: mobileView ? '0.75rem' : '1rem', width: mobileView ? '0.75rem' : '1rem' }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="overflow-y-auto w-[--radix-dropdown-menu-trigger-width]" align="end" style={{ maxHeight: '15rem' }}>
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onSelect={() => handleChange?.(year, defaultMonth)}
                    className="cursor-pointer"
                    style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Month Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="justify-between bg-white hover:bg-gray-50"
                  size={mobileView ? "sm" : "default"}
                  style={{ width: mobileView ? '100%' : '9rem', fontSize: mobileView ? '0.75rem' : '0.875rem' }}
                >
                  <span className="truncate">{defaultMonth}</span>
                  <ChevronDown style={{ marginLeft: '0.5rem', height: mobileView ? '0.75rem' : '1rem', width: mobileView ? '0.75rem' : '1rem' }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="overflow-y-auto w-[--radix-dropdown-menu-trigger-width]" align="end" style={{ maxHeight: '15rem' }}>
                {months.map((month, index) => {
                  const isDisabled =
                    Number(defaultYear) === currentYearValue &&
                    index > currentMonthIndexValue;
                  return (
                    <DropdownMenuItem
                      key={month}
                      disabled={isDisabled}
                      onSelect={() => handleChange?.(defaultYear, month)}
                      className={`cursor-pointer ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}
                    >
                      {month}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent style={{ padding: mobileView ? '0.5rem' : '1.5rem' }}>
        {isLoadingdashboord ? (
          <div className="flex items-center justify-center" style={{ minHeight: mobileView ? '18.75rem' : '25rem' }}>
            <Loader2 className="animate-spin text-blue-500" style={{ height: mobileView ? '1.5rem' : '2rem', width: mobileView ? '1.5rem' : '2rem' }} />
          </div>
        ) : isErrordashboord ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: mobileView ? '18.75rem' : '25rem', gap: mobileView ? '0.75rem' : '1rem', padding: mobileView ? '1rem' : '2rem' }}>
            <div className="text-red-500 text-center">
              <p className="font-semibold" style={{ fontSize: mobileView ? '1rem' : '1.125rem', marginBottom: '0.5rem' }}>Failed to load data</p>
              <p className="text-gray-600" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                Please check your connection and try again
              </p>
            </div>
            <Button 
              onClick={refetchdashboord} 
              variant="outline"
              size={mobileView ? "sm" : "default"}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}
            >
              Retry Loading Data
            </Button>
          </div>
        ) : hasAnyData ? (
          <div className="flex flex-col lg:flex-row w-full max-w-full" style={{ gap: mobileView ? '0.75rem' : '1.5rem' }}>
            {/* Bar Chart Section */}
            <div className="w-full lg:w-1/2 min-w-0">
              <div className="border rounded-lg h-full overflow-hidden" style={{ padding: mobileView ? '0.5rem' : '1rem' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ marginBottom: mobileView ? '0.75rem' : '1rem', gap: '0.5rem' }}>
                  <h3 className="font-semibold text-gray-800 flex items-center min-w-0" style={{ fontSize: mobileView ? '0.875rem' : '1.125rem', gap: '0.5rem' }}>
                    <BarChart3 className="text-blue-600 flex-shrink-0" style={{ height: mobileView ? '0.875rem' : '1.25rem', width: mobileView ? '0.875rem' : '1.25rem' }} />
                    <span className="truncate">Invoice Value by Country</span>
                  </h3>
                  {hasBarData && (
                    <div className="text-gray-500 flex-shrink-0" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                      Total: ${barValues.reduce((a, b) => a + b, 0).toLocaleString()}
                    </div>
                  )}
                </div>
                
                {hasBarData ? (
                  <div className="w-full overflow-hidden" style={{ height: mobileView ? '15.625rem' : '21.875rem' }}>
                    <div className="w-full h-full">
                      <Bar 
                        data={barChartData} 
                        options={getBarChartOptions()} 
                        redraw={true}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center" style={{ height: mobileView ? '15.625rem' : '18.75rem', gap: mobileView ? '0.5rem' : '0.75rem', padding: '1rem' }}>
                    <div className="text-gray-400">
                      <BarChart3 className="mx-auto" style={{ height: mobileView ? '2.5rem' : '3rem', width: mobileView ? '2.5rem' : '3rem' }} />
                    </div>
                    <h3 className="font-semibold text-gray-700" style={{ fontSize: mobileView ? '0.875rem' : '1rem' }}>
                      No Country Data
                    </h3>
                    <p className="text-gray-500 text-center" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                      No invoice data by destination country for selected period
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="w-full lg:w-1/2 min-w-0" style={{ marginTop: mobileView ? '1rem' : '0' }}>
              <div className="border rounded-lg h-full" style={{ padding: mobileView ? '0.5rem' : '1rem' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ marginBottom: mobileView ? '0.75rem' : '1rem', gap: '0.5rem' }}>
                  <h3 className="font-semibold text-gray-800 flex items-center min-w-0" style={{ fontSize: mobileView ? '0.875rem' : '1.125rem', gap: '0.5rem' }}>
                    <PieChart className="text-green-600 flex-shrink-0" style={{ height: mobileView ? '0.875rem' : '1.25rem', width: mobileView ? '0.875rem' : '1.25rem' }} />
                    <span className="truncate">Invoice Value by Product</span>
                  </h3>
                  {hasPieData && (
                    <div className="text-gray-500 flex-shrink-0" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                      Total: ${pieTotalValue.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {hasPieData ? (
                  <div className="flex flex-row items-center justify-center " style={{ gap: mobileView ? '0.75rem' : '1rem' }}>
                    {/* Chart Container */}
                    <div className="w-full lg:w-[80%]" style={{ height: mobileView ? '12.5rem' : '17.5rem' }}>
                      <Doughnut data={pieChartData} options={pieChartOptions} />
                    </div>
             
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center" style={{ height: mobileView ? '15.625rem' : '18.75rem', gap: mobileView ? '0.5rem' : '0.75rem', padding: '1rem' }}>
                    <div className="text-gray-400">
                      <PieChart className="mx-auto" style={{ height: mobileView ? '2.5rem' : '3rem', width: mobileView ? '2.5rem' : '3rem' }} />
                    </div>
                    <h3 className="font-semibold text-gray-700" style={{ fontSize: mobileView ? '0.875rem' : '1rem' }}>
                      No Product Data
                    </h3>
                    <p className="text-gray-500 text-center" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                      No invoice data by product for selected period
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: mobileView ? '18.75rem' : '25rem', gap: mobileView ? '0.75rem' : '1rem', padding: mobileView ? '1rem' : '2rem' }}>
            <div className="text-center">
              <div className="text-gray-400" style={{ marginBottom: mobileView ? '0.5rem' : '0.75rem' }}>
                <div className="flex justify-center" style={{ gap: mobileView ? '0.75rem' : '1rem' }}>
                  <BarChart3 style={{ width: mobileView ? '2.5rem' : '3rem', height: mobileView ? '2.5rem' : '3rem' }} />
                  <PieChart style={{ width: mobileView ? '2.5rem' : '3rem', height: mobileView ? '2.5rem' : '3rem' }} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-700" style={{ fontSize: mobileView ? '1rem' : '1.125rem', marginBottom: '0.25rem' }}>
                No Data Available
              </h3>
              <p className="text-gray-500" style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}>
                There's no invoice data to display for the selected period
              </p>
            </div>
            <Button 
              onClick={refetchdashboord} 
              variant="outline"
              size={mobileView ? "sm" : "default"}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              style={{ fontSize: mobileView ? '0.75rem' : '0.875rem' }}
            >
              Refresh Data
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default DashboardCombinedChart;