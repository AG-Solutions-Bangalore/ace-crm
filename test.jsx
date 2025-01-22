import Page from "@/app/dashboard/page";
import React, { useEffect, useState, useMemo, useCallback } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import {
  useFetchBuyers,
  useFetchCompanys,
  useFetchContractNos,
  useFetchPortofLoadings,
  useFetchContainerSizes,
  useFetchPaymentTerms,
  useFetchCountrys,
  useFetchMarkings,
  useFetchItemNames,
  useFetchDescriptionofGoods,
  useFetchBagsTypes,
  useFetchPorts,
  useFetchProduct,
} from "@/hooks/useApi";
const contractFormSchema = z.object({
  from_date: z.string().min(1, "From date is required"),

  to_date: z.number().min(1, "To Date is required"),
  branch_short: z.string().optional(),
  buyer: z.string().optional(),
  consignee: z.string().optional(),
  container_size: z.string().optional(),
  product: z.string().optional(),
  status: z.string().optional(),
});

const createContract = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-download-contract-details-report`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to create enquiry");
  return response.json();
};
const MemoizedSelect = React.memo(
  ({ value, onChange, options, placeholder }) => {
    const selectOptions = options.map((option) => ({
      value: option.value,
      label: option.label,
    }));

    const selectedOption = selectOptions.find(
      (option) => option.value === value
    );

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        minHeight: "36px",
        borderRadius: "6px",
        borderColor: state.isFocused ? "black" : "#e5e7eb",
        boxShadow: state.isFocused ? "black" : "none",
        "&:hover": {
          borderColor: "none",
          cursor: "text",
        },
      }),
      option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
        backgroundColor: state.isSelected
          ? "#A5D6A7"
          : state.isFocused
          ? "#f3f4f6"
          : "white",
        color: state.isSelected ? "black" : "#1f2937",
        "&:hover": {
          backgroundColor: "#EEEEEE",
          color: "black",
        },
      }),

      menu: (provided) => ({
        ...provided,
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#616161",
        fontSize: "14px",
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "black",
        fontSize: "14px",
      }),
    };

    const DropdownIndicator = (props) => {
      return (
        <div {...props.innerProps}>
          <ChevronDown className="h-4 w-4 mr-3 text-gray-500" />
        </div>
      );
    };

    return (
      <Select
        value={selectedOption}
        onChange={(selected) => onChange(selected ? selected.value : "")}
        options={selectOptions}
        placeholder={placeholder}
        styles={customStyles}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator,
        }}
        // menuPortalTarget={document.body}
        //   menuPosition="fixed"
      />
    );
  }
);

const ContractForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    branch_short: "",
    buyer: "",
    consignee: "",
    container_size: "",
    product: "",
    status: "",
  });
  const { data: buyerData } = useFetchBuyers();

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contract created successfully",
      });
      navigate("/contract");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const fieldLabels = {
    from_date: "From Date",
    to_date: "To Date",
    branch_short: " Branch Sort",
    buyer: "Buyer",
    consignee: "Consignee",
    container_size: "Container size",
    product: "Product",
    status: "Status",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = contractFormSchema.parse({
        ...formData,
      });
      createContractMutation.mutate(validatedData);
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
      <div className="w-full p-4">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Type List
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter From Date <span className="text-red-500">*</span>
            </label>
            <Input type="date" placeholder="Enter From Date" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter To Date <span className="text-red-500">*</span>
            </label>
            <Input type="date" placeholder="Enter To Date" />
          </div>
          <div>
            <label className="block text-xs mb-[2px] font-medium ">
              Buyer <span className="text-red-500">*</span>
            </label>
            <MemoizedSelect
              value={formData.branch_short}
              onChange={(value) => handleSelectChange("branch_short", value)}
              options={
                buyerData?.buyer?.map((buyer) => ({
                  value: buyer.buyer_name,
                  label: buyer.buyer_name,
                })) || []
              }
              placeholder="Select Buyer"
            />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ContractForm;
