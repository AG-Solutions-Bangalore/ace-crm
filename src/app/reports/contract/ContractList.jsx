


import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Page from "@/app/dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import { Download, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ContractList = () => {
  const { toast } = useToast();

  const fetchContractData = async () => {
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
    data: ContractData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ContractData"],
    queryFn: fetchContractData,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Contract
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
              Error Fetching Contract
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
        link.setAttribute("download", "contract.csv");
        document.body.appendChild(link);
        link.click();
        toast({
          title: "Success",
          description: "Contract created successfully",
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
          <h1 className="text-2xl font-semibold">Contract Details</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="ml-2 bg-yellow-500 text-black hover:bg-yellow-100"
              onClick={onSubmit}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>{" "}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Sort
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Group
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Port
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Country
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                Contract Status
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

export default ContractList;
