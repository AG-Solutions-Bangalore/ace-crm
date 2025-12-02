import React from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

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
}) => {
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
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = percentages[i];
                return {
                  text: `${label.split(' (')[0]}: $${value.toLocaleString()}`,
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


  const fromInLac = (totalBalanceINR)=>{
    return totalBalanceINR /100000
  }
  return (
    <div className="p-0 border ">
      <CardHeader className="p-2 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex flex-col md:flex-row items-center md:justify-between mb-2">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Balance distribution across different countries
            </p>
          </div>
          
          
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {isLoadingdashboord ? (
          <div className="flex items-center justify-center min-h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : isErrordashboord ? (
          <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4 p-8">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">Failed to load data</p>
              <p className="text-sm text-gray-600">
                Please check your connection and try again
              </p>
            </div>
            <button 
              onClick={refetchdashboord} 
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
            >
              Retry Loading Data
            </button>
          </div>
        ) : data.length > 0 ? (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 h-[300px] lg:h-[350px]">
              <PolarArea data={chartData} options={chartOptions} />
            </div>
            <div className="w-full lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Country Balance Details
                </h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {data.map((item, index) => {
                    const percentage = ((item.balance_sum / totalBalanceUSD) * 100).toFixed(1);
                    return (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 hover:bg-white rounded-lg transition-colors"
                      >
                        <div className="flex items-center flex-1">
                          <div 
                            className="w-4 h-4 rounded-full mr-3 border-2"
                            style={{ 
                              backgroundColor: backgroundColors[index],
                              borderColor: borderColors[index]
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.country}
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-bold text-gray-900">
                            ${item.balance_sum.toLocaleString()}
                          </div>
                          {usdToInr && usdToInr !== 1 && (
                            <div className="text-xs text-gray-600">
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Exchange Rate:</span>
                        <span className="font-medium">1 USD = {usdToInr.toFixed(2)} INR</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Summary Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Total Balance (USD)</div>
                      <div className="text-lg font-bold text-green-600">
                        ${totalBalanceUSD.toLocaleString()}
                      </div>
                    </div>
                    {usdToInr && usdToInr !== 1 && (
                      <div>
                        <div className="text-xs text-gray-500">Total Balance (INR)</div>
                        <div className="text-lg font-bold text-blue-600">
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
          <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4 p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
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
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No Balance Data Available
              </h3>
              <p className="text-sm text-gray-500">
                There's no balance data to display
              </p>
            </div>
            <button 
              onClick={refetchdashboord} 
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
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