import Page from "@/app/dashboard/page";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
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
import { MinusCircle, PlusCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useCurrentYear } from "@/hooks/useCurrentYear";

const productRowSchema = z.object({
  id: z.any().optional(),
  invoicePSub_inv_ref: z.string().min(1, "Ref data is required"),
  invoicePSub_amt_adv: z.any().optional(),
  invoicePSub_amt_dp: z.any().optional(),
  invoicePSub_amt_da: z.any().optional(),
  invoicePSub_bank_c: z.any().optional(),
  invoicePSub_discount: z.any().optional(),
  invoicePSub_shortage: z.any().optional(),
  invoiceSub_sbaga: z.any().optional(),
  invoicePSub_remarks: z.any().optional(),
});

const contractFormSchema = z.object({
  invoiceP_years: z.string().optional(),

  invoiceP_dates: z.string().min(1, "P Date is required"),
  branch_short: z.string().min(1, "Branch Short is required"),
  branch_name: z.string().min(1, "Branch Name is required"),
  invoiceP_dollar_rate: z.number().min(1, "Dollar Rate is required"),
  invoiceP_v_date: z.string().min(1, "Invoice Date is required"),
  invoiceP_usd_amount: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) >= 1, {
      message: "USD amount is required and must be at least 1",
    }),
  invoiceP_irtt_no: z.string().min(1, "IRTT No is required"),
  invoiceP_status: z.string().min(1, "Status is required"),
  payment_data: z.array(productRowSchema),
});

const BranchHeader = () => {
  return (
    <div
      className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 ${ButtonConfig.cardheaderColor} p-4 shadow-sm`}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">Edit Payment</h1>
      </div>
    </div>
  );
};

const EditPaymentList = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: currentYear } = useCurrentYear();
  useEffect(() => {
    if (currentYear) {
      setFormData((prev) => ({
        ...prev,
        invoiceP_years: currentYear,
      }));
    }
  }, [currentYear]);
  const [formData, setFormData] = useState({
    invoiceP_years: currentYear,
    invoiceP_dates: "",
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
      id: "",
      invoicePSub_inv_ref: "",
      invoicePSub_amt_adv: 0,
      invoicePSub_amt_dp: 0,
      invoicePSub_amt_da: 0,
      invoicePSub_bank_c: 0,
      invoicePSub_discount: 0,
      invoicePSub_shortage: 0,
      invoicePSub_remarks: "",
    },
  ]);

  const createBranch = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(
      `${BASE_URL}/api/panel-update-invoice-payment/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData;
    }

    return responseData;
  };

  const createBranchMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: (response) => {
      if (response.code == 200) {
        toast({
          title: "Success",
          description: response.msg,
        });
      } else if (response.code == 400) {
        toast({
          title: "Duplicate Entry",
          description: response.msg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Response",
          description: response.msg || "Something unexpected happened.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("API Error:", error);

      toast({
        title: "Error",
        description: error.msg || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handlePaymentChange = (e, rowIndex, fieldName) => {
    const value = e.target.value;
    console.log(typeof value);

    if (
      fieldName === "invoicePSub_inv_ref" ||
      fieldName === "invoicePSub_remarks"
    ) {
      const updatedData = [...invoiceData];
      updatedData[rowIndex][fieldName] = value;
      setInvoiceData(updatedData);
    } else {
      if (/^\d*$/.test(value)) {
        const updatedData = [...invoiceData];
        updatedData[rowIndex][fieldName] = value;
        setInvoiceData(updatedData);
      } else {
        console.log("Invalid input. Only digits are allowed.");
      }
    }
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
      return { ...prev, [field]: value };
    });
  };

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
  const fetchPaymentStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-invoice-payment-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch company data");
    const data = await response.json();
    return data.invoicePaymentStatus;
  };

  const { data: PaymentData } = useQuery({
    queryKey: ["payment"],
    queryFn: fetchPaymentStatus,
  });

  const fieldLabels = {
    invoicePSub_inv_ref: " Invoice Ref",
    invoiceP_dates: "Payment Date",
    branch_name: "Company Name",
    invoiceP_dollar_rate: " Dollor Rate",
    invoiceP_v_date: "Value Date",
    invoiceP_usd_amount: "Usd Amount",
    invoiceP_irtt_no: "IRTT No",
    invoiceP_status: "Status",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = contractFormSchema.parse({
        ...formData,
        payment_data: invoiceData,
      });

      createBranchMutation.mutate(validatedData);
      navigate("/payment-payment-list");
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
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const {
    data: paymentDatas,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/panel-fetch-invoice-payment-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch payment");
      return response.json();
    },
  });
  useEffect(() => {
    if (paymentDatas) {
      setFormData((prev) => ({
        ...prev,
        invoiceP_years: paymentDatas.payment.invoiceP_year || currentYear,
        invoiceP_dates: paymentDatas.payment.invoiceP_date || "",
        branch_short: paymentDatas.payment.branch_short || "",
        branch_name: paymentDatas.payment.branch_name || "",
        invoiceP_dollar_rate: paymentDatas.payment.invoiceP_dollar_rate || "",
        invoiceP_v_date: paymentDatas.payment.invoiceP_v_date || "",
        invoiceP_usd_amount: paymentDatas.payment.invoiceP_usd_amount || "",
        invoiceP_irtt_no: paymentDatas.payment.invoiceP_irtt_no || "",
        invoiceP_status: paymentDatas.payment.invoiceP_status || "",
      }));

      if (Array.isArray(paymentDatas.paymentSub)) {
        setInvoiceData(
          paymentDatas.paymentSub.map((sub, index) => {
            return {
              id: sub.id ?? "",
              invoicePSub_inv_ref: sub.invoicePSub_inv_ref || "",
              invoicePSub_amt_adv: sub.invoicePSub_amt_adv || 0,
              invoicePSub_amt_dp: sub.invoicePSub_amt_dp || 0,
              invoicePSub_amt_da: sub.invoicePSub_amt_da || 0,
              invoicePSub_bank_c: sub.invoicePSub_bank_c || 0,
              invoicePSub_discount: sub.invoicePSub_discount || 0,
              invoicePSub_shortage: sub.invoicePSub_shortage || 0,
              invoicePSub_remarks: sub.invoicePSub_remarks || "",
            };
          })
        );
      } else {
        console.warn("paymentSub is not an array:", paymentDatas.paymentSub);
      }
    }
  }, [paymentDatas]);
  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <BranchHeader />
        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Payment Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.invoiceP_dates || ""}
                    onChange={(e) => handleInputChange(e, "invoiceP_dates")}
                    placeholder="Enter Payment Date"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Company <span className="text-red-500">*</span>
                </label>

                <Input
                  className="bg-white"
                  value={formData.branch_short}
                  onChange={(e) => handleInputChange(e, "branch_short")}
                  disabled
                />
              </div>

              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Value Date<span className="text-red-500">*</span>
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
                    disabled
                  />
                </div>
              </div>

              <div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Irtt Number<span className="text-red-500"></span>
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
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Status<span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.invoiceP_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "invoiceP_status")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {PaymentData?.map((status, index) => (
                      <SelectItem
                        key={index}
                        value={status.invoicePaymentStatus}
                      >
                        {status.invoicePaymentStatus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Table className="border border-gray-300 rounded-lg shadow-sm">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Invoice No
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Adj Adv
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Adj Dp
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Adj DA
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Bank Ch
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Discount
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Shortage
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-gray-600 py-2 px-4">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white"
                          value={row.invoicePSub_inv_ref}
                          onChange={(e) =>
                            handlePaymentChange(
                              { target: { value } },
                              rowIndex,
                              "invoicePSub_inv_ref"
                            )
                          }
                          disabled
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_amt_adv}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_amt_adv"
                            )
                          }
                          placeholder="Enter Amount Adv"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_amt_dp}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_amt_dp"
                            )
                          }
                          placeholder="Enter Amount DP"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_amt_da}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_amt_da"
                            )
                          }
                          placeholder="Enter Amount DA"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_bank_c}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_bank_c"
                            )
                          }
                          placeholder="Enter Bank Name"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_discount}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_discount"
                            )
                          }
                          placeholder="Enter Discount"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Input
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_shortage}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_shortage"
                            )
                          }
                          placeholder="Enter Shortage"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <Textarea
                          className="bg-white border border-gray-300"
                          value={row.invoicePSub_remarks}
                          onChange={(e) =>
                            handlePaymentChange(
                              e,
                              rowIndex,
                              "invoicePSub_remarks"
                            )
                          }
                          placeholder="Enter Remarks"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-end">
          <Button
            type="submit"
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
            disabled={createBranchMutation.isPending}
          >
            {createBranchMutation.isPending ? "Updatting..." : "Update Payment"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default EditPaymentList;
