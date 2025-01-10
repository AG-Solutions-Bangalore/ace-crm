import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, MinusCircle, Settings2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import CreateCustomer from "../customer/CreateCustomer";
import CreateProduct from "../product/CreateProduct";
import BASE_URL from "@/config/BaseUrl";
import { Textarea } from "@/components/ui/textarea";

// Validation Schemas
const productRowSchema = z.object({
  contractSub_type: z.string().min(1, "Item Type is required"),
  contractSub_item_name: z.string().min(1, "Item name is required"),
  
  contractSub_descriptionofGoods: z.string().min(1, "ASTA is required"),
  contractSub_quality: z.string().min(1, "Quality is required"),
  
  contractSub_item_type: z.string().min(1, "Type is required"),
  contractSub_packing: z.number().min(1, "Packing is required"),
  contractSub_bagsize: z.number().min(1, "Bag is required"),
  contractSub_qntyInMt: z.number().min(1, "Quoted price is required"),
  contractSub_rateMT: z.number().min(1, "Rate is required"),
  contractSub_sbaga: z.string().min(1, "Bag type is required"),
});

const enquiryFormSchema = z.object({
  contract_buyer: z.string().min(1, "Buyer Name is required"),
  contract_consignee: z.string().min(1, "Consignee Name is required"),
  contract_buyer_ec: z.string().min(1, "Buyer ECGC Name is required"),
  contract_consignee_ec: z.string().min(1, "Consignee ECGC Name is required"),
  contract_date: z.string().min(1, "Enquiry date is required"),
  contract_no: z.string().min(1, "Packing type is required"),
  branch_short: z.string().min(1, "branch_short is required"),
  contract_ship_date: z.string().min(1, "Contract date is required"),
  contract_ref: z.string().min(1, "Contract date is required"),
  contract_pono: z.string().min(1, "Contract date is required"),
  contract_buyer_add: z.string().min(1, "Contract date is required"),
  contract_buyer_ec_add: z.string().min(1, "Contract date is required"),
  contract_consignee_add: z.string().min(1, "Consignee Address is required"),
  enquiry_data: z
    .array(productRowSchema)
    .min(1, "At least one product is required"),
});

// API functions
const fetchBuyers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-buyer`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch buyer data");
  return response.json();
};

const fetchCompanys = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-branch`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch company data");
  return response.json();
};

const fetchContractNos = async (company_sort) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-contract-no/${company_sort}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch contract no data");
  return response.json();
};

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-fetch-product",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch product data");
  return response.json();
};

const createEnquiry = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-create-enquiry",
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

// Header Component
const EnquiryHeader = ({ progress }) => {
  return (
    <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">Contract Form</h1>
        <p className="text-gray-600 mt-2">Create your enquiries</p>
      </div>

      <div className="flex-1 pt-2">
        <div className="sticky top-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Basic Details</span>
            <span className="text-sm font-medium">Products</span>
            <span className="text-sm font-medium">Requirements</span>
          </div>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-yellow-500 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-yellow-600">
              {progress}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ContractAdd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState([
    "contractSub_type",
    "contractSub_marking",
    "contractSub_descriptionofGoods",
    "contractSub_quality",
    "contractSub_item_type",
    "contractSub_bagsize",
    "contractSub_qntyInMt",
  ]);

  const defaultTableHeaders = [
    { key: "contractSub_type", label: "Product Name", required: true },
    { key: "contractSub_marking", label: "SHU (in K)", required: true },
    { key: "contractSub_descriptionofGoods", label: "ASTA", required: true },
    { key: "contractSub_quality", label: "Quality Type", required: true },
    { key: "contractSub_item_type", label: "Course Type", required: true },
    { key: "contractSub_bagsize", label: "Quantity (in MT)", required: true },
    { key: "contractSub_qntyInMt", label: "Quoted Price", required: true },
  ];

  const optionalHeaders = [
    { key: "contractSub_item_name", label: "Product Code" },
    { key: "contractSub_customdescription", label: "Stem Type" },
    { key: "contractSub_packing", label: "Moisture Value" },
    { key: "contractSub_rateMT", label: "Final Price" },
    { key: "contractSub_sbaga", label: "P2B Blend" },
  ];

  const [contractData, setContractData] = useState([
    {
      contractSub_type: "",
      contractSub_item_name: "",
      contractSub_marking: "",
      contractSub_descriptionofGoods: "",
      contractSub_quality: "",
      contractSub_customdescription: "",
      contractSub_item_type: "",
      contractSub_packing: "",
      contractSub_bagsize: "",
      contractSub_qntyInMt: "",
      contractSub_rateMT: "",
      contractSub_sbaga: "",
    },
  ]);

  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
    contract_year: "",
    contract_date: getTodayDate(),
    contract_no: "",
    contract_ref: "",
    contract_pono: "",
    contract_buyer: "",
    contract_buyer_add: "",
    contract_consignee:"",
    contract_consignee_add: "",
    contract_buyer_ec:"",
    contract_buyer_ec_add: "",
    contract_consignee_ec:"",
    contract_consignee_ec_add: "",
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

  const { data: buyerData } = useQuery({
    queryKey: ["buyer"],
    queryFn: fetchBuyers,
  });

  const { data: branchData } = useQuery({
    queryKey: ["branch"],
    queryFn: fetchCompanys,
  });

  const { data: contractNoData } = useQuery({
    queryKey: ["contractNo"],
    queryFn: fetchContractNos(formData.branch_short),
  });
  
  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const createEnquiryMutation = useMutation({
    mutationFn: createEnquiry,
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

  const packingTypes = ["5 Kg", "10 Kg", "15 Kg", "20 Kg", "25 Kg"];

  useEffect(() => {
    const calculateProgress = () => {
      let filledFields = 0;
      let totalFields = 0;

      // Count basic details fields
      const basicDetailsFields = [
        "contract_buyer",
        "contract_consignee",
        "contract_buyer_ec",
        "contract_consignee_ec",
        "contract_date",
        "contract_no",
      ];
      basicDetailsFields.forEach((field) => {
        totalFields++;
        if (formData[field]) filledFields++;
      });

      // Count requirements fields
      const requirementsFields = [
        "branch_short",
        "contract_ship_date",
        "contract_ref",
      ];
      requirementsFields.forEach((field) => {
        totalFields++;
        if (formData[field]) filledFields++;
      });

      // Add treatment fields if treatment is required
      if (formData.contract_pono === "Yes") {
        const treatmentFields = ["contract_buyer_add", "contract_buyer_ec_add", "contract_consignee_add"];
        treatmentFields.forEach((field) => {
          totalFields++;
          if (formData[field] === "Yes") filledFields++;
        });
      }

      // Count all visible product fields for each row
      contractData.forEach((row) => {
        visibleColumns.forEach((columnKey) => {
          totalFields++;
          if (row[columnKey] && row[columnKey].toString().trim() !== "") {
            filledFields++;
          }
        });
      });

      const percentage = Math.round((filledFields / totalFields) * 100);
      setProgress(Math.min(percentage, 100));
    };

    calculateProgress();
  }, [formData, contractData, visibleColumns]);

  const handleInputChange = (e, field) => {
    let value;
    if (e.target.type === "checkbox") {
      value = e.target.checked ? "Yes" : "No";
    } else {
      value = e.target.value;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRowDataChange = (rowIndex, field, value) => {
    const numericFields = [
      'contractSub_bagsize',
      'contractSub_qntyInMt',
      
      'contractSub_marking',
      'contractSub_descriptionofGoods'
    ];
    let processedValue = value;
       // If it's a numeric field, process it
       if (numericFields.includes(field)) {
        // Remove any non-numeric characters except decimal point
        const sanitizedValue = value.replace(/[^\d.]/g, '');
        
        // Prevent multiple decimal points
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
          return; // Ignore input with multiple decimal points
        }
        
        // Convert to number if it's a valid number, otherwise keep as empty string
        processedValue = sanitizedValue === '' ? '' : Number(sanitizedValue);
        
        // Validate if it's a valid number
        if (isNaN(processedValue)) {
          return; // Ignore invalid numbers
        }
      }
    const newData = [...contractData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: processedValue,
    };
    setContractData(newData);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const addRow = () => {
    setContractData([
      ...contractData,
      {
        contractSub_type: "",
        contractSub_item_name: "",
        contractSub_marking: "",
        contractSub_descriptionofGoods: "",
        contractSub_quality: "",
        contractSub_customdescription: "",
        contractSub_item_type: "",
        contractSub_packing: "",
        contractSub_bagsize: "",
        contractSub_qntyInMt: "",
        contractSub_rateMT: "",
        contractSub_sbaga: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (contractData.length > 1) {
      setContractData((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  const RadioOption = ({
    label,
    value,
    onChange,
    currentValue,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <RadioGroup
        value={currentValue}
        onValueChange={(newValue) =>
          onChange({ target: { value: newValue } }, value)
        }
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="Yes" id={`${value}-yes`} />
          <label htmlFor={`${value}-yes`} className="cursor-pointer">
            Yes
          </label>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="No" id={`${value}-no`} />
          <label htmlFor={`${value}-no`} className="cursor-pointer">
            No
          </label>
        </div>
      </RadioGroup>
    </div>
  );
  const fieldLabels = {
    contract_buyer: "Buyer",
    contract_consignee: "Consignee",
    contract_buyer_ec: "Buyer ECGC",
    contract_consignee_ec: "Consignee ECGC",
    contract_date: "Enquiry Date",
    contract_no: "Packing Type",
    branch_short: "branch_short",
    contract_ship_date: "Shipment Date",
    contract_ref: "Sample Required",
    contract_pono: "Treatment Required",
    contract_buyer_add: "contract_buyer_add",
    contract_buyer_ec_add: "Gama Radiations",
    contract_consignee_add: "Steam Sterilization",
    contractSub_type: "Product Name",
    contractSub_marking: "SHU",
    contractSub_descriptionofGoods: "ASTA",
    contractSub_quality: "Quality Type",
    contractSub_item_type: "Course Type",
    contractSub_bagsize: "Quantity",
    contractSub_qntyInMt: "Quoted Price",
    contractSub_rateMT: "Final Price",
    contractSub_sbaga: "P2B Blend",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = enquiryFormSchema.parse({
        ...formData,
        enquiry_data: contractData,
      });
      createEnquiryMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const groupedErrors = error.errors.reduce((acc, err) => {
          const field = err.path.join(".");
          if (!acc[field]) {
            acc[field] = [];
          }
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
        {/* <EnquiryHeader progress={progress} /> */}

        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Basic Details Section */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Buyer <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_buyer}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_buyer")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Buyer" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                          key={buyer.buyer_name}
                          value={buyer.buyer_name.toString()}
                        >
                          {buyer.buyer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CreateCustomer/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Consignee <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_consignee}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_consignee")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                          key={buyer.buyer_name}
                          value={buyer.buyer_name.toString()}
                        >
                          {buyer.buyer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CreateCustomer/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Buyer ECGC <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_buyer_ec}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_buyer_ec")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Buyer ECGC" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                          key={buyer.buyer_name}
                          value={buyer.buyer_name.toString()}
                        >
                          {buyer.buyer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CreateCustomer/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Consignee ECGC<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_consignee_ec}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_consignee_ec")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignee ECGC" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                          key={buyer.buyer_name}
                          value={buyer.buyer_name.toString()}
                        >
                          {buyer.buyer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CreateCustomer/>
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
                    onChange={(e) => handleInputChange(e, "contract_buyer_add")}
                  />
                  
                  
                </div>
                <div>
                <Textarea
                    type="text"
                    placeholder="Enter Consignee Address"
                    value={formData.contract_consignee_add}
                    onChange={(e) => handleInputChange(e, "contract_consignee_add")}
                  />
                </div>
                <div>
                <Textarea
                    type="text"
                    placeholder="Enter Buyer ECGC Address"
                    value={formData.contract_buyer_ec_add}
                    onChange={(e) => handleInputChange(e, "contract_buyer_ec_add")}
                  />
                </div>
                <div>
                  <Textarea
                      type="text"
                      placeholder="Enter Consignee ECGC Address"
                      value={formData.contract_consignee_ec_add}
                      onChange={(e) => handleInputChange(e, "contract_consignee_ec_add")}
                    />
                </div>
                </div>
                </div>

                <div className="mb-8">
                <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Company <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.branch_short}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "branch_short")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                <Input
                    type="text"
                    placeholder="Enter Company Name"
                    value={formData.branch_name}
                    onChange={(e) => handleInputChange(e, "branch_name")}
                  />
                <Textarea
                    type="text"
                    placeholder="Enter Company Address"
                    value={formData.branch_address}
                    onChange={(e) => handleInputChange(e, "branch_address")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Contract No <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_no}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_no")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contract No" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractNoData?.contractNo?.map((contractNo) => (
                        <SelectItem
                          key={contractNo}
                          value={contractNo.toString()}
                        >
                          {contractNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contract Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.contract_date}
                    onChange={(e) => handleInputChange(e, "contract_date")}
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
                    onChange={(e) => handleInputChange(e, "contract_ref")}
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
                    onChange={(e) => handleInputChange(e, "contract_pono")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Port of Loading <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_loading}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_loading")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Port of Loading" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Destination Port <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_destination_port}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_destination_port")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Destination Port" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                </div>
                </div>
                <div className="mb-8">
                <div className="grid grid-cols-6 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Discharge <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_discharge}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_discharge")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Discharge" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  CIF <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_cif}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_cif")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CIF" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Dest. Country <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_destination_country}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_destination_country")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dest. Country" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Containers/Size <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_container_size}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_container_size")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Containers/Size" />
                    </SelectTrigger>
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
                  </Select>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.contract_ship_date}
                    onChange={(e) => handleInputChange(e, "contract_ship_date")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.contract_shipment}
                    onChange={(e) => handleInputChange(e, "contract_shipment")}
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
                    onChange={(e) => handleInputChange(e, "contract_specification1")}
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
                    onChange={(e) => handleInputChange(e, "contract_specification2")}
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
                  <Select
                    value={formData.contract_container_size}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_container_size")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Terms" />
                    </SelectTrigger>
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
                  </Select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">
                Remarks
                  </label>
                <Textarea
                    type="text"
                    placeholder="Enter Remarks"
                    value={formData.contract_remarks}
                    onChange={(e) => handleInputChange(e, "contract_remarks")}
                  />
                </div>
                
              </div>
              </div>
            {/* Products Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
               <div className="flex flex-row items-center">
               <h2 className="text-xl font-semibold">Products</h2>
               <CreateProduct/>
               </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-4 w-4 mr-2" />
                      Customize Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {optionalHeaders.map((header) => (
                      <DropdownMenuItem
                        key={header.key}
                        onClick={() => toggleColumn(header.key)}
                      >
                        <span>{header.label}</span>
                        {visibleColumns.includes(header.key) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {[...defaultTableHeaders, ...optionalHeaders]
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
                      <tr key={rowIndex} className="border-b hover:bg-gray-50">
                        {[...defaultTableHeaders, ...optionalHeaders]
                          .filter((header) =>
                            visibleColumns.includes(header.key)
                          )
                          .map((header) => (
                            <td key={header.key} className="p-2 border">
                              {header.key === "contractSub_type" ? (
                                <Select
                                  value={row[header.key]}
                                  onValueChange={(value) =>
                                    handleRowDataChange(
                                      rowIndex,
                                      header.key,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productData?.product?.map((product) => (
                                      <SelectItem
                                        key={product.id}
                                        value={product.product_name}
                                      >
                                        {product.product_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={row[header.key]}
                                  onChange={(e) =>
                                    handleRowDataChange(
                                      rowIndex,
                                      header.key,
                                      e.target.value
                                    )
                                  }
                                  type={
                                    ['contractSub_bagsize', 'contractSub_qntyInMt', 
                                      'contractSub_marking', 
                                     'contractSub_descriptionofGoods'].includes(header.key) 
                                      ? "number" 
                                      : "text"
                                  }
                                  step={
                                    ['contractSub_bagsize', 'contractSub_qntyInMt', 
                                      'contractSub_marking', 
                                     'contractSub_descriptionofGoods'].includes(header.key) 
                                      ? "any" 
                                      : undefined
                                  }
                                  min={
                                    ['contractSub_bagsize', 'contractSub_qntyInMt', 
                                      'contractSub_marking', 
                                     'contractSub_descriptionofGoods'].includes(header.key) 
                                      ? "0" 
                                      : undefined
                                  }
                                  className="w-full border border-gray-300 bg-yellow-50"
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

            {/* Requirements Section */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    branch_short <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter branch_short details"
                    value={formData.branch_short}
                    onChange={(e) => handleInputChange(e, "branch_short")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Packing Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_no}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_no")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select packing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <RadioOption
                  label="Sample Required"
                  value="contract_ref"
                  onChange={handleInputChange}
                  currentValue={formData.contract_ref}
                  required={true}
                />
                <RadioOption
                  label="Treatment Required"
                  value="contract_pono"
                  onChange={handleInputChange}
                  currentValue={formData.contract_pono}
                  required={true}
                />

                {/* Conditional Treatment Options */}
                {formData.contract_pono === "Yes" && (
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.contract_buyer_add === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "contract_buyer_add"
                          )
                        }
                      />
                      <label>contract_buyer_add</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.contract_buyer_ec_add === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "contract_buyer_ec_add"
                          )
                        }
                      />
                      <label>Gama Radiations</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.contract_consignee_add === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "contract_consignee_add"
                          )
                        }
                      />
                      <label>Steam Sterilization</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        {/* <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400"
            disabled={createEnquiryMutation.isPending}
          >
            {createEnquiryMutation.isPending
              ? "Submitting..."
              : "Submit Enquiry"}
          </Button>
        </div> */}
        <div className="flex flex-col items-end">
          {createEnquiryMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
            disabled={createEnquiryMutation.isPending}
          >
            {createEnquiryMutation.isPending
              ? "Submitting..."
              : "Submit Enquiry"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default ContractAdd;


//sajid 