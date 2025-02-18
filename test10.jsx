import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Page from "@/app/dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import { Download, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ButtonConfig } from "@/config/ButtonConfig";

const StockView = () => {
  const { toast } = useToast();
  const createReport = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-item-stocks-report`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to create monthwise purchase report"
      );
    }
    return response.json();
  };

  const {
    data: stockDatas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stockData"],
    queryFn: fetchStockData,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Stock
          </Button>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  //excel download
  const onSubmit = (e) => {
    e.preventDefault();

    axios({
      url: BASE_URL + "/api/panel-download-buyer-details-report",
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("data : ", res.data);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Stock.csv");
        document.body.appendChild(link);
        link.click();
        toast({
          title: "Success",
          description: "Stock Downloaded successfully",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });
  };
  return (
    <Page>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Stock Details</h1>
        </div>{" "}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Opening Stock
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Purchase
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Production
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Processing
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Dispatch
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Closing Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {stockDatas.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.purchaseOrderProduct}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.openpurch_qnty} ({stock.openpurch_bag} Bags)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.purch_qnty} ({stock.purch_bag} Bags)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.production_qnty} ({stock.production_bag} Bags)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.processing_qnty} ({stock.processing_bag} Bags)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.dispatch_qnty} ({stock.dispatch_bag} Bags)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {stock.openpurch_qnty +
                      stock.purch_qnty +
                      stock.production_qnty +
                      stock.processing_qnty -
                      stock.dispatch_qnty}{" "}
                    (
                    {stock.openpurch_bag +
                      stock.purch_bag +
                      stock.production_bag +
                      stock.processing_bag -
                      stock.dispatch_bag}{" "}
                    Bags)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
};

export default StockView;
