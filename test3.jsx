import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import BASE_URL from "@/config/BaseUrl";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentYear } from "@/hooks/useCurrentYear";
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
} from "@/hooks/useApi";
import { VariableSizeList as List } from "react-window";

// Validation Schemas
const productRowSchema = z.object({
  contractSub_item_name: z.string().min(1, "Item name is required"),
  contractSub_descriptionofGoods: z
    .string()
    .min(1, "Item Descriptions is required"),
  contractSub_bagsize: z.number().min(1, "Gross Weight is required"),
  contractSub_packing: z.number().min(1, "Packing is required"),
  contractSub_item_bag: z.number().min(1, "Bag is required"),
  contractSub_qntyInMt: z.number().min(1, "Quoted price is required"),
  contractSub_rateMT: z.number().min(1, "Rate is required"),
  contractSub_sbaga: z.string().min(1, "Bag Type is required"),
  contractSub_marking: z.string().optional(),
});

const contractFormSchema = z.object({
  branch_short: z.string().min(1, "Company Sort is required"),
  branch_name: z.string().min(1, "Company Name is required"),
  branch_address: z.string().min(1, "Company Address is required"),
  contract_year: z.string().optional(),
  contract_date: z.string().min(1, "Contract date is required"),
  contract_no: z.string().min(1, "Contract No is required"),
  contract_ref: z.string().min(1, "Contract Ref is required"),
  contract_pono: z.string().min(1, "Contract PONO is required"),
  contract_buyer: z.string().min(1, "Buyer Name is required"),
  contract_buyer_add: z.string().min(1, "Buyer Address is required"),
  contract_consignee: z.string().min(1, "Consignee Name is required"),
  contract_consignee_add: z.string().min(1, "Consignee Address is required"),
  contract_container_size: z.string().min(1, "Containers/Size is required"),
  contract_loading: z.string().min(1, "Port of Loading is required"),
  contract_destination_port: z.string().min(1, "Destination Port is required"),
  contract_discharge: z.string().min(1, "Discharge is required"),
  contract_cif: z.string().min(1, "CIF is required"),
  contract_destination_country: z.string().min(1, "Dest. Country is required"),
  contract_shipment: z.string().optional(),
  contract_ship_date: z.string().optional(),
  contract_specification1: z.string().optional(),
  contract_specification2: z.string().optional(),
  contract_payment_terms: z.string().optional(),
  contract_remarks: z.string().optional(),
  contract_data: z
    .array(productRowSchema)
    .min(1, "At least one product is required"),
});

const createContract = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-create-contract`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create enquiry");
  return response.json();
};

const MemoizedSelect = React.memo(
  ({ value, onChange, options, placeholder }) => {
    const getItemSize = (index) => {
      const itemContent = options[index]?.label || "";
      const lineHeight = 20; // Approximate line height
      const padding = 16; // Padding for each item
      const lines = Math.ceil(itemContent.length / 30); // Approximate number of lines
      return lines * lineHeight + padding;
    };
    const Row = ({ index, style }) => (
      <SelectItem
        key={options[index].value}
        value={options[index]?.value}
        style={style}
      >
        {options[index].label}
      </SelectItem>
    );

    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <List
            height={300} // this can't be in string
            itemCount={options?.length}
            itemSize={getItemSize} // ye ek tarah se width bol skte hai like utne word show hoga usse jyda overlap ho jayega isko bdhaoo  see in payments terms
            width={300} // give 100 %
          >
            {Row}
          </List>
        </SelectContent>
      </Select>
    );
  }
);

const ProductRow = React.memo(
  ({
    row,
    rowIndex,
    handleRowDataChange,
    visibleColumns,
    defaultTableHeaders,
    markingData,
    itemNameData,
    descriptionofGoodseData,
    bagTypeData,
    removeRow,
    contractData,
  }) => {
    return (
      <tr className="border-b hover:bg-gray-50">
        {defaultTableHeaders
          .filter((header) => visibleColumns.includes(header.key))
          .map((header) => (
            <td key={header.key} className="p-2 border">
              {header.key === "contractSub_marking" ? (
                <MemoizedSelect
                  value={row[header.key]}
                  onChange={(value) =>
                    handleRowDataChange(rowIndex, header.key, value)
                  }
                  options={
                    markingData?.marking?.map((m) => ({
                      value: m.marking,
                      label: m.marking,
                    })) || []
                  }
                  placeholder="Select Marking"
                />
              ) : header.key === "contractSub_item_name" ? (
                <MemoizedSelect
                  value={row[header.key]}
                  onChange={(value) =>
                    handleRowDataChange(rowIndex, header.key, value)
                  }
                  options={
                    itemNameData?.itemname?.map((i) => ({
                      value: i.item_name,
                      label: i.item_name,
                    })) || []
                  }
                  placeholder="Select Item Name"
                />
              ) : header.key === "contractSub_descriptionofGoods" ? (
                <MemoizedSelect
                  value={row[header.key]}
                  onChange={(value) =>
                    handleRowDataChange(rowIndex, header.key, value)
                  }
                  options={
                    descriptionofGoodseData?.descriptionofGoods?.map((d) => ({
                      value: d.descriptionofGoods,
                      label: d.descriptionofGoods,
                    })) || []
                  }
                  placeholder="Select Description"
                />
              ) : header.key === "contractSub_sbaga" ? (
                <MemoizedSelect
                  value={row[header.key]}
                  onChange={(value) =>
                    handleRowDataChange(rowIndex, header.key, value)
                  }
                  options={
                    bagTypeData?.bagType?.map((b) => ({
                      value: b.bagType,
                      label: b.bagType,
                    })) || []
                  }
                  placeholder="Select Bag Type"
                />
              ) : (
                <Input
                  value={row[header.key]}
                  onChange={(e) =>
                    handleRowDataChange(rowIndex, header.key, e.target.value)
                  }
                  placeholder={`Enter ${header.label}`}
                  type={
                    [
                      "contractSub_item_bag",
                      "contractSub_packing",
                      "contractSub_bagsize",
                      "contractSub_qntyInMt",
                      "contractSub_rateMT",
                    ].includes(header.key)
                      ? "number"
                      : "text"
                  }
                />
              )}
            </td>
          ))}
        <td className="p-2 border">
          <Button
            variant="ghost"
            onClick={() => removeRow(rowIndex)}
            disabled={contractData.length === 1}
            className="text-red-500"
            type="button"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }
);

const ContractAdd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [visibleColumns, setVisibleColumns] = useState([
    "contractSub_marking",
    "contractSub_item_name",
    "contractSub_descriptionofGoods",
    "contractSub_item_bag",
    "contractSub_packing",
    "contractSub_bagsize",
    "contractSub_qntyInMt",
    "contractSub_rateMT",
    "contractSub_sbaga",
  ]);

  const defaultTableHeaders = useMemo(
    () => [
      { key: "contractSub_marking", label: "Marking", required: false },
      { key: "contractSub_item_name", label: "Item Name", required: true },
      {
        key: "contractSub_descriptionofGoods",
        label: "Descriptions",
        required: true,
      },
      { key: "contractSub_item_bag", label: "Bags", required: true },
      { key: "contractSub_packing", label: "Net", required: true },
      { key: "contractSub_bagsize", label: "Gross", required: true },
      { key: "contractSub_qntyInMt", label: "Qnty (MT)", required: true },
      { key: "contractSub_rateMT", label: "Rate", required: true },
      { key: "contractSub_sbaga", label: "Bag Type", required: true },
    ],
    []
  );

  const [contractData, setContractData] = useState([
    {
      contractSub_marking: "",
      contractSub_item_name: "",
      contractSub_descriptionofGoods: "",
      contractSub_item_bag: "",
      contractSub_packing: "",
      contractSub_bagsize: "",
      contractSub_qntyInMt: "",
      contractSub_rateMT: "",
      contractSub_sbaga: "",
    },
  ]);

  const { data: currentYear } = useCurrentYear();
  useEffect(() => {
    if (currentYear) {
      setFormData((prev) => ({
        ...prev,
        contract_year: currentYear,
      }));
    }
  }, [currentYear]);

  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
    contract_year: currentYear,
    contract_date: getTodayDate(),
    contract_no: "",
    contract_ref: "",
    contract_pono: "",
    contract_buyer: "",
    contract_buyer_add: "",
    contract_consignee: "",
    contract_consignee_add: "",
    contract_container_size: "",
    contract_loading: "",
    contract_destination_port: "",
    contract_discharge: "",
    contract_cif: "",
    contract_destination_country: "",
    contract_shipment: "",
    contract_ship_date: "",
    contract_specification1: "",
    contract_specification2: "",
    contract_payment_terms: "",
    contract_remarks: "",
  });

  const { data: buyerData } = useFetchBuyers();
  const { data: branchData } = useFetchCompanys();
  const { data: contractNoData } = useFetchContractNos(formData.branch_short);
  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: containerSizeData } = useFetchContainerSizes();
  const { data: paymentTermsData } = useFetchPaymentTerms();
  const { data: countryData } = useFetchCountrys();
  const { data: markingData } = useFetchMarkings();
  const { data: itemNameData } = useFetchItemNames();
  const { data: descriptionofGoodseData } = useFetchDescriptionofGoods();
  const { data: bagTypeData } = useFetchBagsTypes();
  const { data: portsData } = useFetchPorts();

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

  const handleRowDataChange = useCallback((rowIndex, field, value) => {
    const numericFields = [
      "contractSub_bagsize",
      "contractSub_qntyInMt",
      "contractSub_packing",
      "contractSub_rateMT",
      "contractSub_item_bag",
    ];
    let processedValue = value;
    if (numericFields.includes(field)) {
      const sanitizedValue = value.replace(/[^\d.]/g, "");
      const decimalCount = (sanitizedValue.match(/\./g) || []).length;
      if (decimalCount > 1) return;
      processedValue = sanitizedValue === "" ? "" : Number(sanitizedValue);
      if (isNaN(processedValue)) return;
    }
    setContractData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [field]: processedValue,
      };
      return newData;
    });
  }, []);

  const addRow = useCallback(() => {
    setContractData((prev) => [
      ...prev,
      {
        contractSub_item_bag: "",
        contractSub_item_name: "",
        contractSub_marking: "",
        contractSub_descriptionofGoods: "",
        contractSub_packing: "",
        contractSub_bagsize: "",
        contractSub_qntyInMt: "",
        contractSub_rateMT: "",
        contractSub_sbaga: "",
      },
    ]);
  }, []);

  const removeRow = useCallback(
    (index) => {
      if (contractData.length > 1) {
        setContractData((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [contractData.length]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = contractFormSchema.parse({
        ...formData,
        contract_data: contractData,
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
      <form onSubmit={handleSubmit} className="w-full p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Basic Details Section */}
            <div className="mb-0">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Buyer <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_buyer}
                    onChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === value
                      );
                      handleInputChange("contract_buyer", value);

                      if (selectedBuyer) {
                        handleInputChange(
                          "contract_buyer_add",
                          selectedBuyer.buyer_address
                        );
                        handleInputChange(
                          "contract_consignee",
                          selectedBuyer.buyer_name
                        );
                        handleInputChange(
                          "contract_consignee_add",
                          selectedBuyer.buyer_address
                        );
                        handleInputChange(
                          "contract_destination_port",
                          selectedBuyer.buyer_port
                        );
                        handleInputChange(
                          "contract_discharge",
                          selectedBuyer.buyer_port
                        );
                        handleInputChange(
                          "contract_cif",
                          selectedBuyer.buyer_port
                        );
                        handleInputChange(
                          "contract_destination_country",
                          selectedBuyer.buyer_country
                        );
                      }

                      const selectedCompanySort = branchData?.branch?.find(
                        (branch) =>
                          branch.branch_short === formData.branch_short
                      );
                      if (selectedCompanySort) {
                        const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${formData.contract_no}/${formData.contract_year}`;
                        handleInputChange("contract_ref", contractRef);
                        handleInputChange("contract_pono", contractRef);
                      }
                    }}
                    options={
                      buyerData?.buyer?.map((buyer) => ({
                        value: buyer.buyer_name,
                        label: buyer.buyer_name,
                      })) || []
                    }
                    placeholder="Select Buyer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Consignee <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_consignee}
                    onChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === value
                      );
                      handleInputChange("contract_consignee", value);
                      if (selectedBuyer) {
                        handleInputChange(
                          "contract_consignee_add",
                          selectedBuyer.buyer_address
                        );
                      }
                    }}
                    options={
                      buyerData?.buyer?.map((buyer) => ({
                        value: buyer.buyer_name,
                        label: buyer.buyer_name,
                      })) || []
                    }
                    placeholder="Select Consignee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.branch_short}
                    onChange={(value) => {
                      const selectedCompanySort = branchData?.branch?.find(
                        (branch) => branch.branch_short === value
                      );

                      handleInputChange("branch_short", value);
                      if (selectedCompanySort) {
                        handleInputChange(
                          "branch_name",
                          selectedCompanySort.branch_name
                        );
                        handleInputChange(
                          "branch_address",
                          selectedCompanySort.branch_address
                        );
                        handleInputChange(
                          "contract_loading",
                          selectedCompanySort.branch_port_of_loading
                        );
                        const selectedBuyer = buyerData?.buyer?.find(
                          (buyer) =>
                            buyer.buyer_name === formData.contract_buyer
                        );

                        if (selectedBuyer) {
                          const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${formData.contract_no}/${formData.contract_year}`;
                          handleInputChange("contract_ref", contractRef);
                          handleInputChange("contract_pono", contractRef);
                        }
                      }
                    }}
                    options={
                      branchData?.branch?.map((branch) => ({
                        value: branch.branch_short,
                        label: branch.branch_short,
                      })) || []
                    }
                    placeholder="Select Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contract No <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_no}
                    onChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === formData.contract_buyer
                      );
                      const selectedCompanySort = branchData?.branch?.find(
                        (branch) =>
                          branch.branch_short === formData.branch_short
                      );
                      const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${value}/${formData.contract_year}`;
                      handleInputChange("contract_ref", contractRef);
                      handleInputChange("contract_pono", contractRef);
                      handleInputChange("contract_no", value);
                    }}
                    options={
                      contractNoData?.contractNo?.map((contractNos) => ({
                        value: contractNos,
                        label: contractNos,
                      })) || []
                    }
                    placeholder="Select Contract No"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <Textarea
                    type="text"
                    placeholder="Enter Buyer Address"
                    value={formData.contract_buyer_add}
                    onChange={(e) =>
                      handleInputChange("contract_buyer_add", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Textarea
                    type="text"
                    placeholder="Enter Consignee Address"
                    value={formData.contract_consignee_add}
                    onChange={(e) =>
                      handleInputChange(
                        "contract_consignee_add",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "12px" }}>
                    {formData.branch_name}
                  </span>
                  <br />
                  <span style={{ fontSize: "9px", display: "block" }}>
                    {formData.branch_address}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contract Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.contract_date}
                    onChange={(e) =>
                      handleInputChange("contract_date", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contract Ref. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Contract Ref"
                    value={formData.contract_ref}
                    disabled
                    onChange={(e) =>
                      handleInputChange("contract_ref", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contract PONO. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Contract PoNo"
                    value={formData.contract_pono}
                    onChange={(e) =>
                      handleInputChange("contract_pono", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Port of Loading <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_loading}
                    onChange={(value) =>
                      handleInputChange("contract_loading", value)
                    }
                    options={
                      portofLoadingData?.portofLoading?.map(
                        (portofLoading) => ({
                          value: portofLoading.portofLoading,
                          label: portofLoading.portofLoading,
                        })
                      ) || []
                    }
                    placeholder="Select Port of Loading"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Destination Port <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_destination_port}
                    onChange={(value) =>
                      handleInputChange("contract_destination_port", value)
                    }
                    options={
                      portsData?.country?.map((country) => ({
                        value: country.country_port,
                        label: country.country_port,
                      })) || []
                    }
                    placeholder="Select Destination Port"
                  />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="grid grid-cols-6 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discharge <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_discharge}
                    onChange={(value) =>
                      handleInputChange("contract_discharge", value)
                    }
                    options={
                      portsData?.country?.map((country) => ({
                        value: country.country_port,
                        label: country.country_port,
                      })) || []
                    }
                    placeholder="Select Discharge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    CIF <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_cif}
                    onChange={(value) =>
                      handleInputChange("contract_cif", value)
                    }
                    options={
                      portsData?.country?.map((country) => ({
                        value: country.country_port,
                        label: country.country_port,
                      })) || []
                    }
                    placeholder="Select CIF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dest. Country <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_destination_country}
                    onChange={(value) =>
                      handleInputChange("contract_destination_country", value)
                    }
                    options={
                      countryData?.country?.map((country) => ({
                        value: country.country_name,
                        label: country.country_name,
                      })) || []
                    }
                    placeholder="Select Dest. Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Containers/Size <span className="text-red-500">*</span>
                  </label>
                  <MemoizedSelect
                    value={formData.contract_container_size}
                    onChange={(value) =>
                      handleInputChange("contract_container_size", value)
                    }
                    options={
                      containerSizeData?.containerSize?.map(
                        (containerSize) => ({
                          value: containerSize.containerSize,
                          label: containerSize.containerSize,
                        })
                      ) || []
                    }
                    placeholder="Select Containers/Size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment Date
                  </label>
                  <Input
                    type="date"
                    value={formData.contract_ship_date}
                    onChange={(e) =>
                      handleInputChange("contract_ship_date", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment
                  </label>
                  <Input
                    type="text"
                    value={formData.contract_shipment}
                    onChange={(e) =>
                      handleInputChange("contract_shipment", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specification1
                  </label>
                  <Textarea
                    type="text"
                    placeholder="Enter Specification1"
                    value={formData.contract_specification1}
                    onChange={(e) =>
                      handleInputChange(
                        "contract_specification1",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specification2
                  </label>
                  <Textarea
                    type="text"
                    placeholder="Enter Specification2"
                    value={formData.contract_specification2}
                    onChange={(e) =>
                      handleInputChange(
                        "contract_specification2",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Terms
                  </label>
                  <MemoizedSelect
                    value={formData.contract_payment_terms}
                    onChange={(value) =>
                      handleInputChange("contract_payment_terms", value)
                    }
                    options={
                      paymentTermsData?.paymentTermsC?.map((paymentTermsC) => ({
                        value: paymentTermsC.paymentTermsC,
                        label: paymentTermsC.paymentTermsC,
                      })) || []
                    }
                    placeholder="Select Payment Terms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Remarks
                  </label>
                  <Textarea
                    type="text"
                    placeholder="Enter Remarks"
                    value={formData.contract_remarks}
                    onChange={(e) =>
                      handleInputChange("contract_remarks", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            {/* Products Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-row items-center">
                  <h2 className="text-xl font-semibold">Products</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {[...defaultTableHeaders]
                        .filter((header) => visibleColumns.includes(header.key))
                        .map((header) => (
                          <th
                            key={header.key}
                            className="p-2 text-left border text-sm font-medium"
                          >
                            {header.label}
                            {header.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </th>
                        ))}
                      <th className="p-2 text-left border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractData.map((row, rowIndex) => (
                      <ProductRow
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        handleRowDataChange={handleRowDataChange}
                        visibleColumns={visibleColumns}
                        defaultTableHeaders={defaultTableHeaders}
                        markingData={markingData}
                        itemNameData={itemNameData}
                        descriptionofGoodseData={descriptionofGoodseData}
                        bagTypeData={bagTypeData}
                        removeRow={removeRow}
                        contractData={contractData}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={addRow}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-end">
          {createContractMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
            disabled={createContractMutation.isPending}
          >
            {createContractMutation.isPending
              ? "Submitting..."
              : "Submit Enquiry"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default ContractAdd;


//  this is the code without debounce and with varibale size list 