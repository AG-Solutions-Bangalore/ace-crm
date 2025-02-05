import Page from "@/app/dashboard/page";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import axios from "axios";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useState } from "react";



const salesAccountFormSchema = z.object({
  from_date: z.string().min(1, "From date is required"),
  to_date: z.string().min(1, "To Date is required"),
  branch_name: z.string().optional(),
 
});


const createContract = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-fetch-sales-accounts-report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create sales account");
  return response.json();
};


const SalesAccountForm = () => {
  const { toast } = useToast();
const navigate = useNavigate();
const [formData, setFormData] = useState({
  from_date: moment().startOf("month").format("YYYY-MM-DD"), 
  to_date: moment().format("YYYY-MM-DD"),
  branch_name: "",
 
});

const createSalesAccountMutation = useMutation({
  mutationFn: createContract,
  onSuccess: (data) => {
    navigate("/report/sales-account-report", { state: { reportData: data } });
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const validatedData = salesAccountFormSchema.parse({
      ...formData,
    });
   
   

    createSalesAccountMutation.mutate(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );

      toast({
        title: "Validation Error",
        description: (
          <div>
            <ul className="list-disc pl-5">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  }
};

const handleInputChange = (field, valueOrEvent) => {
  const value =
    typeof valueOrEvent === "object" && valueOrEvent.target
      ? valueOrEvent.target.value
      : valueOrEvent;

  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};


const fetchCompanys = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-fetch-branches`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch company data");
  return response.json();
};

const { data: branchData } = useQuery({
  queryKey: ["branch"],
  queryFn: fetchCompanys,
});


 const BranchHeader = ({ progress }) => {
    return (
      <div className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between ${ButtonConfig.cardheaderColor} items-start gap-8 mb-2  p-4 shadow-sm`}>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Sales Account</h1>
          <p className="text-gray-600 mt-2">Add a Contract to Vist Repost</p>
        </div>
      </div>
    );
  };


  const onSubmit = (e) => {
    e.preventDefault();

    axios({
      url: BASE_URL + "/api/panel-download-sales-accounts-report",
      method: "POST",
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sales_account.csv");
        document.body.appendChild(link);
        link.click();
        toast({
          title: "Success",
          description: "Sales Account download successfully",
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
       <BranchHeader />

       <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
        <CardContent className="p-4">
          <div className="w-full p-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                     <label className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}>
                    Enter From Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.from_date}
                    className="bg-white"
                    onChange={(e) =>
                      handleInputChange("from_date", e)
                    }
                    placeholder="Enter From Date"
                  />
                </div>

                <div>
                     <label className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}>
                    Enter To Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    className="bg-white"
                    value={formData.to_date}
                    onChange={(e) =>
                      handleInputChange("to_date", e)
                    }
                    placeholder="Enter To Date"
                  />
                </div>

                <div>
                     <label className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}>
                    Branch <span className="text-red-500"></span>
                  </label>
                  <Select
                    value={formData.branch_name}
                    onValueChange={(value) =>
                      handleInputChange("branch_name", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectContent>
                        {branchData?.branch?.map((branch) => (
                          <SelectItem
                            key={branch.branch_name}
                            value={branch.branch_name.toString()}
                          >
                            {branch.branch_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    
                    </SelectContent>
                  </Select>
                </div>
              
              </div>
              <div className="flex flex-row items-end mt-3 justify-end w-full">
                {createSalesAccountMutation.isPending}

                <Button
                  variant="default"
                  className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}                  onClick={onSubmit}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button
                  type="submit"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} ml-2 flex items-center mt-2`}
                  disabled={createSalesAccountMutation.isPending}
                >
                  {createSalesAccountMutation.isPending
                    ? "Submitting..."
                    : "Submit Sales Account"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}

export default SalesAccountForm