import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const transformPolarData = (graphData = [], usdToInr) => {
  if (!Array.isArray(graphData)) return [];

  return graphData.map((item) => ({
    country: item.invoice_destination_country || "Unknown",
    balance_sum: parseFloat(item.balance_sum) || 0,
    balance_inr: parseFloat(item.balance_sum) * (usdToInr || 1),
  }));
};

const DashboardPolarChart = ({
  graphData = [],
  usdToInr = 1,
  title = "Balance Distribution by Country",
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
  
  const mobileView = parentIsMobile !== undefined ? parentIsMobile : isMobile;

  // Transform the graph data
  const data = transformPolarData(graphData, usdToInr);

  // Calculate totals
  const totalBalanceUSD = data.reduce((sum, item) => sum + item.balance_sum, 0);
  const totalBalanceINR = totalBalanceUSD * usdToInr;

  // Chart.js dataset preparation
  const labels = data.map((d) => d.country);
  const values = data.map((d) => d.balance_sum);
  const percentages = totalBalanceUSD > 0 
    ? values.map(value => ((value / totalBalanceUSD) * 100).toFixed(1))
    : values.map(() => "0.0");

  // Color palette for polar chart
  const backgroundColors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(201, 203, 207, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
  ];

  const chartData = {
    labels: labels.map((label, index) => `${label} (${percentages[index]}%)`),
    datasets: [
      {
        label: 'Balance ($)',
        data: values,
        backgroundColor: backgroundColors.slice(0, values.length),
        borderColor: borderColors.slice(0, values.length),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: mobileView ? 'bottom' : 'right',
        labels: {
          usePointStyle: true,
          padding: mobileView ? 8 : 15,
          font: {
            size: mobileView ? 9 : 11,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = percentages[i];
                const countryName = label.split(' (')[0];
                
                // Truncate for mobile
                const displayName = mobileView && countryName.length > 15 
                  ? `${countryName.substring(0, 12)}...`
                  : countryName;
                
                return {
                  text: `${displayName}: $${value.toLocaleString()}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const inrValue = value * usdToInr;
            const percentage = ((value / totalBalanceUSD) * 100).toFixed(1);
            return [
              `${label.split(' (')[0]}`,
              `USD: $${value.toLocaleString()} (${percentage}%)`,
              `INR: ₹${inrValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            ];
          },
        },
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
        pointLabels: {
          display: false,
        },
      },
    },
  };

  const fromInLac = (totalBalanceINR) => {
    return totalBalanceINR / 100000;
  }

  return (
    <div className="p-0 border rounded-lg overflow-hidden">
      <CardHeader className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex flex-col">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
              {title}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Balance distribution across different countries
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {isLoadingdashboord ? (
          <div className="flex items-center justify-center min-h-[250px] sm:min-h-[350px]">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : isErrordashboord ? (
          <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px] space-y-3 sm:space-y-4 p-4 sm:p-8">
            <div className="text-red-500 text-center">
              <p className="text-base sm:text-lg font-semibold mb-2">Failed to load data</p>
              <p className="text-xs sm:text-sm text-gray-600">
                Please check your connection and try again
              </p>
            </div>
            <button 
              onClick={refetchdashboord} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
            >
              Retry Loading Data
            </button>
          </div>
        ) : data.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Chart Section */}
            <div className="w-full lg:w-1/2 h-[250px] sm:h-[300px] md:h-[350px]">
              <PolarArea data={chartData} options={chartOptions} />
            </div>
            
            {/* Details Section */}
            <div className="w-full lg:w-1/2 lg:pl-0 lg:mt-0">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-full">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  Country Balance Details
                </h3>
                <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-1 sm:pr-2">
                  {data.map((item, index) => {
                    const percentage = totalBalanceUSD > 0 
                      ? ((item.balance_sum / totalBalanceUSD) * 100).toFixed(1)
                      : '0.0';
                    return (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 sm:p-3 hover:bg-white rounded-lg transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 border-2 flex-shrink-0"
                            style={{ 
                              backgroundColor: backgroundColors[index],
                              borderColor: borderColors[index]
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {item.country}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {percentage}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
                          <div className="text-xs sm:text-sm font-bold text-gray-900">
                            ${item.balance_sum.toLocaleString()}
                          </div>
                          {usdToInr && usdToInr !== 1 && (
                            <div className="text-[10px] sm:text-xs text-gray-600">
                              ₹{item.balance_inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Exchange Rate Info */}
                {usdToInr && usdToInr !== 1 && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Exchange Rate:</span>
                        <span className="font-medium">1 USD = {usdToInr.toFixed(2)} INR</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Summary Section */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Total (USD)</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold text-green-600">
                        ${totalBalanceUSD.toLocaleString()}
                      </div>
                    </div>
                    {usdToInr && usdToInr !== 1 && (
                      <div>
                        <div className="text-xs text-gray-500">Total (INR)</div>
                        <div className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                          ₹{fromInLac(totalBalanceINR).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px] space-y-3 sm:space-y-4 p-4 sm:p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">
                No Balance Data Available
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                There's no balance data to display
              </p>
            </div>
            <button 
              onClick={refetchdashboord} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
            >
              Refresh Data
            </button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default DashboardPolarChart;