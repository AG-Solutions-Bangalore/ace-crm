import Page from "@/app/dashboard/page";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from "@/config/BaseUrl";

// Validation Schema

const productRowSchema = z.object({
  invoicePSub_inv_ref: z.number().optional(),
  invoicePSub_amt_adv: z.number().optional(), // Consider changing to `.number()` if it's numeric
  invoicePSub_amt_dp: z.number().optional(), // Corrected: it should be a number
  invoicePSub_amt_da: z.number().optional(), // Corrected: it should be a number

  invoicePSub_bank_c: z.number().optional(), // Corrected: it should be a number

  invoicePSub_discount: z.number().optional(), // Corrected: it should be a number
  invoicePSub_shortage: z.number().optional(), // Corrected: it should be a number
  invoiceSub_sbaga: z.number().optional(), // You can keep this as a string
  invoicePSub_remarks: z.string().optional(), // Optional if it'
});

const contractFormSchema = z.object({
  invoiceP_year: z.string().min(1, "Invoice Year is required"),
  branch_short: z.string().min(1, "Branch Short is required"),
  branch_name: z.string().min(1, "Branch Name is required"),
  invoiceP_dollar_rate: z.string().min(1, "Dollar Rate is required"),
  invoiceP_v_date: z.string().min(1, "Invoice Date is required"),
  invoiceP_usd_amount: z.string().min(1, "USD amount is required"),
  invoiceP_irtt_no: z.string().min(1, "IRTT No is required"),
  invoiceP_status: z.string().min(1, "Status is required"),
  payment_data: z
    .array(productRowSchema)
    .min(1, "At least one product is required"),
});

const BranchHeader = () => {
  return (
    <div
      className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 ${ButtonConfig.cardheaderColor} p-4 shadow-sm`}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">Create Payment</h1>
      </div>
    </div>
  );
};

const createBranch = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-create-invoice-payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create Payment");
  return response.json();
};

const CreatePayment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceP_year: "",
    invoiceP_date: "",
    branch_short: "",
    branch_name: "",
    invoiceP_dollar_rate: "",
    invoiceP_v_date: "",
    invoiceP_usd_amount: "",
    invoiceP_irtt_no: "",
    invoiceP_status: "",
  });
  const [invoiceData, setInvoiceData] = useState([
    {
      invoicePSub_inv_ref: "",
      invoicePSub_amt_adv: "",
      invoicePSub_amt_dp: "",
      invoicePSub_amt_da: "",
      invoicePSub_bank_c: "",
      invoicePSub_discount: "",
      invoicePSub_shortage: "",
      invoicePSub_remarks: "",
    },
  ]);
  const createBranchMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePaymentChange = (e, field) => {
    const value = e.target.value;
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;

    setFormData((prev) => {
      if (field === "branch_short") {
        const selectedBranch = branchData?.branch.find(
          (branch) => branch.branch_short === value
        );
        return {
          ...prev,
          branch_short: value,
          branch_name: selectedBranch ? selectedBranch.branch_name : "",
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  // const handlePaymentChange = (index, name, value) => {
  //   console.log("Payment Change:", index, name, value);
  //   const updatedPayments = [...formData.payment_data];
  //   updatedPayments[index] = {
  //     ...updatedPayments[index],
  //     [name]: value,
  //   };

  //   setFormData((prev) => ({
  //     ...prev,
  //     payment_data: updatedPayments,
  //   }));
  // };

  const fetchCompanys = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${BASE_URL}/api/panel-fetch-branch`, {
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
  const fieldLabels = {
    invoicePSub_inv_ref: "Ref",
    invoicePSub_amt_adv: "Advance",
    invoicePSub_inv_ref: "invoice Ref",
    invoicePSub_amt_dp: "dp",
    invoicePSub_bank_c: "bank",
    invoicePSub_amt_da: "da",
    invoicePSub_discount: "discount",
    invoicePSub_shortage: "shortage",
    invoiceSub_sbaga: "sbaga",
    nvoicePSub_remarks: "remarks",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedInvoiceData = invoiceData.map((row) => ({
        // invoicePSub_inv_ref: isNaN(parseFloat(row.invoicePSub_inv_ref))
        //   ? 0
        //   : parseFloat(row.invoicePSub_inv_ref), // Ensure it's a valid number
        invoicePSub_inv_ref: isNaN(parseFloat(row.invoicePSub_inv_ref))
          ? 0
          : parseFloat(row.invoicePSub_inv_ref),

        // invoicePSub_amt_adv: isNaN(parseFloat(row.invoicePSub_amt_adv))
        //   ? 0
        //   : parseFloat(row.invoicePSub_amt_adv), // Ensure it's a valid number
        // invoicePSub_amt_dp: isNaN(parseFloat(row.invoicePSub_amt_dp))
        //   ? 0
        //   : parseFloat(row.invoicePSub_amt_dp), // Ensure it's a valid number
        // invoicePSub_amt_da: isNaN(parseFloat(row.invoicePSub_amt_da))
        //   ? 0
        //   : parseFloat(row.invoicePSub_amt_da), // Ensure it's a valid number
        // invoicePSub_bank_c: isNaN(parseFloat(row.invoicePSub_bank_c))
        //   ? 0
        //   : parseFloat(row.invoicePSub_bank_c), // Ensure it's a valid number
        // invoicePSub_discount: isNaN(parseFloat(row.invoicePSub_discount))
        //   ? 0
        //   : parseFloat(row.invoicePSub_discount), // Ensure it's a valid number
        // invoicePSub_shortage: isNaN(parseFloat(row.invoicePSub_shortage))
        //   ? 0
        //   : parseFloat(row.invoicePSub_shortage), // Ensure it's a valid number
        // invoicePSub_remarks: row.invoicePSub_remarks || "", // Ensure remarks is a string
      }));

      const validatedData = contractFormSchema.parse({
        ...formData,
        payment_data: processedInvoiceData,
      });

      createBranchMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const groupedErrors = error.errors.reduce((acc, err) => {
          const field = err.path.join(".");
          if (!acc[field]) acc[field] = [];
          acc[field].push(err.message);
          return acc;
        }, {});

        const errorMessages = Object.entries(groupedErrors).map(
          ([field, messages]) => {
            const fieldKey = field.split(".").pop();
            const label = fieldLabels[fieldKey] || field;
            return `${label}: ${messages.join(", ")}`;
          }
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

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <BranchHeader />
        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Year<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.invoiceP_year}
                  onChange={(e) => handleInputChange(e, "invoiceP_year")}
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Invoice Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_date}
                    onChange={(e) => handleInputChange(e, "invoiceP_date")}
                    placeholder="Enter Date"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Branch <span className="text-red-500"></span>
                </label>
                <Select
                  value={formData.branch_short}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "branch_short")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectContent>
                      {branchData?.branch?.map((branch) => (
                        <SelectItem
                          key={branch.branch_short}
                          value={branch.branch_short.toString()}
                        >
                          {branch.branch_short}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Branch Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.branch_name}
                    onChange={(e) => handleInputChange(e, "branch_name")}
                    placeholder="Enter Name"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Dollor Rate<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_dollar_rate}
                    onChange={(e) =>
                      handleInputChange(e, "invoiceP_dollar_rate")
                    }
                    placeholder="Enter Dollor Rate"
                    type="number"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Invoice v_date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_v_date}
                    onChange={(e) => handleInputChange(e, "invoiceP_v_date")}
                    placeholder="Enter Date"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    USD Amount<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_usd_amount}
                    onChange={(e) =>
                      handleInputChange(e, "invoiceP_usd_amount")
                    }
                    placeholder="Enter  USD Amount"
                    type="number"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Irtt Number<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_irtt_no}
                    onChange={(e) => handleInputChange(e, "invoiceP_irtt_no")}
                    placeholder="Enter Irtt Number"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="containerSize_status"
                  className="text-sm font-medium"
                >
                  Status
                </label>
                <Select
                  value={formData.invoiceP_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "invoiceP_status")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="Inactive">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Ref<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  name="invoicePSub_inv_ref"
                  value={invoiceData.invoicePSub_inv_ref}
                  onChange={(e) =>
                    handlePaymentChange(e, "invoicePSub_inv_ref")
                  }
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Ampunt Adv<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  type="number"
                  name="invoicePSub_amt_adv"
                  value={invoiceData.invoicePSub_amt_adv}
                  onChange={(e) =>
                    handlePaymentChange(e, "invoicePSub_amt_adv")
                  }
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Ampunt DP<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  type="number"
                  name="invoicePSub_amt_dp"
                  value={invoiceData.invoicePSub_amt_dp}
                  onChange={(e) => handlePaymentChange(e, "invoicePSub_amt_dp")}
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Ampunt Da<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  type="number"
                  name="invoicePSub_amt_da"
                  value={invoiceData.invoicePSub_amt_da}
                  onChange={(e) => handlePaymentChange(e, "invoicePSub_amt_da")}
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Bank<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  // type="number"
                  name="invoicePSub_bank_c"
                  value={invoiceData.invoicePSub_bank_c}
                  onChange={(e) => handlePaymentChange(e, "invoicePSub_bank_c")}
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice SUb Discount<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  type="number"
                  name="invoicePSub_discount"
                  value={invoiceData.invoicePSub_discount}
                  onChange={(e) =>
                    handlePaymentChange(e, "invoicePSub_discount")
                  }
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Invoice Shortage<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  name="invoicePSub_shortage"
                  value={invoiceData.invoicePSub_shortage}
                  onChange={(e) =>
                    handlePaymentChange(e, "invoicePSub_shortage")
                  }
                  placeholder="Enter Invoice Year"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Remarks<span className="text-red-500">*</span>
                </label>
                <Textarea
                  className="bg-white"
                  name="invoicePSub_remarks"
                  value={invoiceData.invoicePSub_remarks}
                  onChange={(e) =>
                    handlePaymentChange(e, "invoicePSub_remarks")
                  }
                  placeholder="Enter Invoice Year"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          <Button
            type="submit"
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
            disabled={createBranchMutation.isPending}
          >
            {createBranchMutation.isPending ? "Submitting..." : "Create Branch"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default CreatePayment;
