import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Page from "@/app/dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ButtonConfig } from "@/config/ButtonConfig";

const ContractReport = () => {
  const { toast } = useToast();
  var postData = {
    from_date: localStorage.getItem("from_date") || "",
    to_date: localStorage.getItem("to_date") || "",
    branch_short: localStorage.getItem("branch_short") || "",
    buyer: localStorage.getItem("buyer") || "",
    consignee: localStorage.getItem("consignee") || "",
    container_size: localStorage.getItem("container_size") || "",
    product: localStorage.getItem("product") || "",
    status: localStorage.getItem("status") || "",
  };
  const fetchContractData = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}/api/panel-fetch-contract-report`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.contract;
  };

  const {
    data: contractData,
    isLoading,
    isError,
    refetch, // Add refetch here
  } = useQuery({
    queryKey: ["contractData"],
    queryFn: fetchContractData,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
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

  // excel download
  const onSubmit = (e) => {
    e.preventDefault();

    axios({
      url: BASE_URL + "/api/panel-download-contract-report",
      method: "POST",
      data: postData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "contract.csv");
        document.body.appendChild(link);
        link.click();
        toast({
          title: "Success",
          description: "Contract download successfully",
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
  //details DOwnload
  // const onSubmitDetails = (e) => {
  //   e.preventDefault();

  //   axios({
  //     url: BASE_URL + "/api/panel-download-contract-details-report",
  //     method: "POST",
  //     data: postData,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((res) => {
  //       const url = window.URL.createObjectURL(new Blob([res.data]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", "contractdetails.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       toast({
  //         title: "Success",
  //         description: "Contract Details download successfully",
  //       });
  //     })
  //     .catch((error) => {
  //       toast({
  //         title: "Error",
  //         description: error.message,
  //         variant: "destructive",
  //       });
  //     });
  // };

  return (
    <Page>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Contract Details</h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={onSubmit}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
            {/* <Button
              variant="default"
              className="ml-2 bg-yellow-500 text-black hover:bg-yellow-100"
              onClick={onSubmitDetails}
            >
              <Download className="h-4 w-4" /> Details Download
            </Button> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Branch Short
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Contract Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Contract No
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Contract Buyer
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Contract Consignee
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Container Size
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Product
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Loading Port
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Destination Port
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Quantity (MT)
                </th>
              </tr>
            </thead>
            <tbody>
              {contractData.map((contract, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.branch_short}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_no}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_buyer}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_consignee}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_container_size}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_product}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_loading}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_destination_port}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.contract_status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {contract.total_qntyInMt}
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

export default ContractReport;
