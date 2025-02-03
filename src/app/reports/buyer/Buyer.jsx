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
import { BuyerRDownload } from "@/components/buttonIndex/ButtonComponents";

const Buyer = () => {
  const { toast } = useToast();

  const fetchBuyerData = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/api/panel-fetch-buyer-details-report`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.buyer;
  };

  const {
    data: buyerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["buyerData"],
    queryFn: fetchBuyerData,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Buyer
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
              Error Fetching Buyer
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
        link.setAttribute("download", "buyer.csv");
        document.body.appendChild(link);
        link.click();
        toast({
          title: "Success",
          description: "Buyer created successfully",
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
          <h1 className="text-2xl font-semibold">Buyer Details</h1>
          <div className="flex gap-2">
            {/* <Button
              variant="default"
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={onSubmit}
            >
              <Download className="h-4 w-4" /> Download
            </Button> */}
            <div>
              <BuyerRDownload
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                onClick={onSubmit}
              ></BuyerRDownload>
            </div>
          </div>
        </div>{" "}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Sort
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Group
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Port
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Country
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Buyer Status
                </th>
              </tr>
            </thead>
            <tbody>
              {buyerData.map((buyer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_sort}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_group}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_port}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_country}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {buyer.buyer_status}
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

export default Buyer;
