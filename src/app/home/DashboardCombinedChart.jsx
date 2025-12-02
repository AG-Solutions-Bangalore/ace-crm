import React from "react";
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
}) => {
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 11,
          },
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
          display: true,
          text: "Total Value ($)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          callback: function (value) {
            if (value >= 1000) return "$" + (value / 1000).toFixed(1) + "k";
            return "$" + value;
          },
          font: {
            size: 10,
          },
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Destination Country",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  // Prepare Pie Chart data
  const pieTotalValue = pieData.reduce((sum, item) => sum + item.total_value, 0);
  const pieLabels = pieData.map((d) => d.product);
  const pieValues = pieData.map((d) => d.total_value);
  const piePercentages = pieValues.map(value => ((value / pieTotalValue) * 100).toFixed(1));

  // Color palette for pie chart
  const pieBackgroundColors = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#8AC926', // Green
    '#1982C4', // Dark Blue
    '#6A4C93', // Dark Purple
    '#FF595E', // Bright Red
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
    cutout: '55%',
    plugins: {
      legend: {
        display: false, // Hide default legend for compact view
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / pieTotalValue) * 100).toFixed(1);
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
    <div className="border ">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 p-2">
        <div className="flex flex-col md:flex-row items-center md:justify-between mb-2 space-y-3 md:space-y-0">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-lg">Invoice Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  <span className="text-lg">Product Distribution</span>
                </div>
              </div>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Combined view of invoice values by destination country and product distribution
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            {/* Year Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-32 justify-between bg-white hover:bg-gray-50 text-sm"
                  size="sm"
                >
                  <span className="truncate">{defaultYear}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto" align="end">
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onSelect={() => handleChange?.(year, defaultMonth)}
                    className="cursor-pointer text-sm"
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
                  className="w-full sm:w-36 justify-between bg-white hover:bg-gray-50 text-sm"
                  size="sm"
                >
                  <span className="truncate">{defaultMonth}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto" align="end">
                {months.map((month, index) => {
                  const isDisabled =
                    Number(defaultYear) === currentYearValue &&
                    index > currentMonthIndexValue;
                  return (
                    <DropdownMenuItem
                      key={month}
                      disabled={isDisabled}
                      onSelect={() => handleChange?.(defaultYear, month)}
                      className={`cursor-pointer text-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
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

      <CardContent className="p-4">
        {isLoadingdashboord ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : isErrordashboord ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">Failed to load data</p>
              <p className="text-sm text-gray-600">
                Please check your connection and try again
              </p>
            </div>
            <Button 
              onClick={refetchdashboord} 
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Retry Loading Data
            </Button>
          </div>
        ) : hasAnyData ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Bar Chart Section - Left 50% */}
            <div className="lg:w-1/2">
              <div className="border rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Invoice Value by Destination Country
                  </h3>
                  {hasBarData && (
                    <div className="text-sm text-gray-500">
                      Total: ${barValues.reduce((a, b) => a + b, 0).toLocaleString()}
                    </div>
                  )}
                </div>
                
                {hasBarData ? (
                  <div className="h-[300px]">
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] space-y-3 p-4">
                    <div className="text-gray-400">
                      <BarChart3 className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700">
                      No Country Data
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      No invoice data by destination country for selected period
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart Section - Right 50% */}
            <div className="lg:w-1/2">
              <div className="border rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Invoice Value by Product
                  </h3>
                  {hasPieData && (
                    <div className="text-sm text-gray-500">
                      Total: ${pieTotalValue.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {hasPieData ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 h-[250px]">
                      <Doughnut data={pieChartData} options={pieChartOptions} />
                    </div>
                    <div className="md:w-1/2">
                      <div className="bg-gray-50 p-3 rounded-lg h-full max-h-[250px] overflow-y-auto">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Product Breakdown
                        </h4>
                        <div className="space-y-2">
                          {pieData.map((item, index) => {
                            const percentage = ((item.total_value / pieTotalValue) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between p-2 hover:bg-white rounded text-sm">
                                <div className="flex items-center truncate">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                                    style={{ backgroundColor: pieBackgroundColors[index % pieBackgroundColors.length] }}
                                  />
                                  <span className="truncate font-medium text-gray-700">
                                    {item.product}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <div className="font-bold text-gray-800">
                                    ${item.total_value.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {percentage}%
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] space-y-3 p-4">
                    <div className="text-gray-400">
                      <PieChart className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700">
                      No Product Data
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      No invoice data by product for selected period
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <div className="flex justify-center gap-4">
                  <BarChart3 className="w-12 h-12" />
                  <PieChart className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Data Available
              </h3>
              <p className="text-sm text-gray-500">
                There's no invoice data to display for the selected period
              </p>
            </div>
            <Button 
              onClick={refetchdashboord} 
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
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