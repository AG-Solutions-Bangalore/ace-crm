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
import { useCurrentYear } from "@/hooks/useCurrentYear";


// Validation Schemas
const productRowSchema = z.object({
  contractSub_item_name: z.string().min(1, "Item name is required"),
  contractSub_descriptionofGoods: z.string().min(1, "Item Descriptions is required"),
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
  invoice_year: z.string().optional(),
  contract_date: z.string().min(1, "Contract date is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  contract_no: z.string().min(1, "Invoice No is required"),
  contract_ref: z.string().min(1, "Invoice Ref is required"),
  contract_pono: z.string().min(1, "PONO is required"),
  invoice_no: z.string().min(1, "Invoice NO is required"),
  contract_buyer: z.string().min(1, "Buyer Name is required"),
  contract_buyer_add: z.string().min(1, "Buyer Address is required"),
  contract_product: z.string().min(1, "Product is required"),
  contract_consignee: z.string().min(1, "Consignee Name is required"),
  contract_consignee_add: z.string().min(1, "Consignee Address is required"),
  
  contract_container_size: z.string().min(1, "Containers/Size is required"),
  contract_loading: z.string().min(1, "Port of Loading is required"),
  contract_destination_port: z.string().min(1, "Destination Port is required"),
  contract_discharge: z.string().min(1, "Discharge is required"),
  contract_cif: z.string().min(1, "CIF is required"),
  contract_destination_country: z.string().min(1, "Dest. Country is required"),
  
  
  contract_specification1:z.string().optional(),
  contract_specification2:z.string().optional(),
  contract_payment_terms:z.string().optional(),
  contract_remarks:z.string().optional(),
  invoice_consig_bank:z.string().optional(),
  invoice_prereceipts:z.string().optional(),
  invoice_precarriage: z.string().min(1, "Precarriage is required"),
  invoice_product_cust_des: z.string().min(1, "Product Descriptions is required"),
  invoice_gr_code: z.string().min(1, "GR Code is required"),
  invoice_lut_code: z.string().min(1, "LUT Code is required"),
  invoice_data: z
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

const fetchDefaultSetting = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-default-setting`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Product no data");
  return response.json();
};

const fetchProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-product`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch Product no data");
    return response.json();
};

const fetchLUT = async (value) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-scheme-by-value/${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch LUT data");
    return response.json();
};

const fetchGRCode = async (value) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-grcode/${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch GR Code data");
    return response.json();
};

const fetchPrereceipts = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-prereceipts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch Product no data");
    return response.json();
};

const fetchContractRef = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-contract-ref`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch Contract ref data");
    return response.json();
};

const fetchPortofLoadings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-portofLoading`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Port of Loading no data");
  return response.json();
};

const fetchContainerSizes = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-container-size`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Container Size no data");
  return response.json();
};

const fetchProductCustomDescription = async (value) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      `${BASE_URL}/api/panel-fetch-product-description/${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) throw new Error("Failed to fetch Container Size no data");
    return response.json();
  };

const fetchPaymentTerms = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-paymentTermsC`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Container Size no data");
  return response.json();
};

const fetchPorts = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-country-port`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Port no data");
  return response.json();
};

const fetchCountrys = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-country`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Port no data");
  return response.json();
};

const fetchMarkings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-marking`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Marking no data");
  return response.json();
};

const fetchItemNames = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-itemname`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Item Name no data");
  return response.json();
};

const fetchDescriptionofGoods = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-descriptionofGoods`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Description of Goods no data");
  return response.json();
};

const fetchBagsTypes = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-fetch-bagType`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Bag Type no data");
  return response.json();
};

const createInvoice = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-create-contract`,
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
const InvoiceAdd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

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

  const defaultTableHeaders = [
    { key: "contractSub_marking", label: "Marking", required: false },
    { key: "contractSub_item_name", label: "Item Name", required: true },
    { key: "contractSub_descriptionofGoods", label: "Descriptions", required: true },
    { key: "contractSub_item_bag", label: "Bags", required: true },
    { key: "contractSub_packing", label: "Net", required: true },
    { key: "contractSub_bagsize", label: "Gross", required: true },
    { key: "contractSub_qntyInMt", label: "Qnty (MT)", required: true },
    { key: "contractSub_rateMT", label: "Rate", required: true },
    { key: "contractSub_sbaga", label: "Bag Type", required: true },
    
  ];

  

  const [invoiceData, setInvoiceData] = useState([
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
        invoice_year: currentYear,
      }));
    }
  }, [currentYear]);
  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
    invoice_year: currentYear,
    contract_date: "",
    invoice_date: "",
    contract_no: "",
    contract_ref: "",
    contract_pono: "",
    invoice_no: "",
    contract_buyer: "",
    contract_buyer_add: "",
    contract_consignee:"",
    contract_consignee_add: "",
    contract_product: "",
    contract_container_size: "",
    contract_loading: "",
    contract_destination_port: "",
    contract_discharge: "",
    contract_cif: "",
    contract_destination_country: "",
    contract_specification1: "",
    contract_specification2: "",
    contract_payment_terms: "",
    contract_remarks: "",
    invoice_consig_bank: "",
    invoice_consig_bank_address: "",
    invoice_prereceipts: "",
    invoice_precarriage: "",
    invoice_product_cust_des: "",
    invoice_gr_code: "",
    invoice_lut_code: "",
  });

  const { data: buyerData } = useQuery({
    queryKey: ["buyer"],
    queryFn: fetchBuyers,
  });
  
  const { data: branchData } = useQuery({
    queryKey: ["branch"],
    queryFn: fetchCompanys,
  });

  

  const { data: portofLoadingData } = useQuery({
    queryKey: ["portofLoadings"],
    queryFn: fetchPortofLoadings,
  });

  const { data: productData } = useQuery({
      queryKey: ["products"],
      queryFn: fetchProduct,
    });

    const { data: defaultSettingData } = useQuery({
      queryKey: ["products"],
      queryFn: fetchDefaultSetting,
    });
    
    const { data: lutData } = useQuery({
        queryKey: ["lut"],
        queryFn: fetchLUT,
      });

      const { data: grcodeData } = useQuery({
        queryKey: ["lut"],
        queryFn: fetchGRCode,
      });

    const { data: prereceiptsData } = useQuery({
        queryKey: ["prereceipts"],
        queryFn: fetchPrereceipts,
      });
    
    const { data: contractRefsData } = useQuery({
        queryKey: ["contractRefs"],
        queryFn: fetchContractRef,
      });
    
  const { data: containerSizeData } = useQuery({
    queryKey: ["containersizes"],
    queryFn: fetchContainerSizes,
  });

  const { data: productCustomDescriptionData } = useQuery({
    queryKey: ["containersizes"],
    queryFn: fetchProductCustomDescription,
  });

  const { data: paymentTermsData } = useQuery({
    queryKey: ["paymentTerms"],
    queryFn: fetchPaymentTerms,
  });

  const { data: countryData } = useQuery({
    queryKey: ["country"],
    queryFn: fetchCountrys,
  });

  const { data: markingData } = useQuery({
    queryKey: ["markings"],
    queryFn: fetchMarkings,
  });

  const { data: itemNameData } = useQuery({
    queryKey: ["itemNames"],
    queryFn: fetchItemNames,
  });

  const { data: descriptionofGoodseData } = useQuery({
    queryKey: ["descriptionofGoodss"],
    queryFn: fetchDescriptionofGoods,
  });

  const { data: bagTypeData } = useQuery({
    queryKey: ["bagTypes"],
    queryFn: fetchBagsTypes,
  });

  const { data: portsData } = useQuery({
    queryKey: ["ports"],
    queryFn: fetchPorts,
  });
  
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
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

  

  useEffect(() => {
    const calculateProgress = () => {
      let filledFields = 0;
      let totalFields = 0;

      // Count basic details fields
      const basicDetailsFields = [
        "contract_buyer",
        "contract_consignee",
       
        
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
        
        "contract_ref",
      ];

      requirementsFields.forEach((field) => {
        totalFields++;
        if (formData[field]) filledFields++;
      });

      

      // Count all visible product fields for each row
      invoiceData.forEach((row) => {
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
  }, [formData, invoiceData, visibleColumns]);

  const handleInputChange = (e, field) => {
    let value;
    value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRowDataChange = (rowIndex, field, value) => {
    const numericFields = [
      'contractSub_bagsize',
      'contractSub_qntyInMt',
      'contractSub_packing',
      'contractSub_rateMT',
      'contractSub_item_bag'
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
    const newData = [...invoiceData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: processedValue,
    };
    setInvoiceData(newData);
  };

  const addRow = () => {
    setInvoiceData([
      ...invoiceData,
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
  };

  const removeRow = (index) => {
    if (invoiceData.length > 1) {
      setInvoiceData((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  
  const fieldLabels = {
    contract_buyer: "Buyer",
    contract_consignee: "Consignee",
   
  
    contract_date: "Contract Date",
    contract_no: "Contract No",
    
   
    contract_ref: "Contract Ref",
    contract_pono: "PONO Required",
    contract_buyer_add: "Buyer Add",
  
    contract_consignee_add: "Cnsignee Add",
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = contractFormSchema.parse({
        ...formData,
        invoice_data: invoiceData,
      });
      createInvoiceMutation.mutate(validatedData);
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
               <div className="grid grid-cols-5 gap-6"> 
                <div>
                <label className="block text-sm font-medium mb-2">
                  Contract Ref. <span className="text-red-500">*</span>
                  </label>
                    <Select
                    value={formData.contract_ref}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_ref")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contract Ref." />
                    </SelectTrigger>
                    <SelectContent>
                      {contractRefsData?.contractRef?.map((contractRef) => (
                        <SelectItem
                          key={contractRef.contract_ref}
                          value={contractRef.contract_ref.toString()}
                        >
                          {contractRef.contract_ref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">
                    Company <span className="text-red-500">*</span>
                    </label>
                    <Select
                    value={formData.branch_short}
                    onValueChange={(value) => {
                        const selectedCompanySort = branchData?.branch?.find(
                        (branch) => branch.branch_short === value
                        );
                        
                        handleInputChange(
                        { target: { value } },
                        "branch_short"
                        );
                        if (selectedCompanySort) {
                        handleInputChange(
                            { target: { value: selectedCompanySort.branch_name } },
                            "branch_name"
                        );
                        handleInputChange(
                            { target: { value: selectedCompanySort.branch_address } },
                            "branch_address"
                        );
                        fetchLUT(selectedCompanySort.branch_scheme);
                        
                        
                        
                        }
                        
                    }}
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
                  <label className="block text-sm font-medium mb-2">
                  Invoice No <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Invoice No"
                    value={formData.invoice_no}
                    onChange={(e) => handleInputChange(e, "invoice_no")}
                />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.invoice_date}
                    onChange={(e) => handleInputChange(e, "invoice_date")}
                  />
                </div>  
                <div style={{textAlign:'center'}}>
                  <span style={{fontSize:'12px'}}>{formData.branch_name}</span><br/>
                  <span style={{fontSize:'9px',display:'block'}}>{formData.branch_address}</span>
                  
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
                    disabled
                    onChange={(e) => handleInputChange(e, "contract_pono")}
                  />
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
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Invoice Ref. <span className="text-red-500">*</span>
                        </label>
                    <Input
                        type="text"
                        placeholder="Enter Invoice Ref"
                        value={formData.invoice_ref}
                        disabled
                        onChange={(e) => handleInputChange(e, "invoice_ref")}
                        />
                    </div>
                
                
                </div>
                </div>

                <div className="mb-0">
              <div className="grid grid-cols-4 gap-6">
              
              <div>
                  <label className="block text-sm font-medium mb-2">
                    Buyer <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.contract_buyer}
                    onValueChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === value
                      );
                      handleInputChange(
                        { target: { value } },
                        "contract_buyer"
                      );

                      if (selectedBuyer) {
                        handleInputChange(
                          { target: { value: selectedBuyer.buyer_address } },
                          "contract_buyer_add"
                        );
                      }
                    }}
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
                    onValueChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === value
                      );
                      handleInputChange(
                        { target: { value } },
                        "contract_consignee"
                      );
                      if (selectedBuyer) {
                        handleInputChange(
                          { target: { value: selectedBuyer.buyer_address } },
                          "contract_consignee_add"
                        );
                      }
                    }}
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
                    Consig. Bank <span className="text-red-500">*</span>
                    </label>
                    <Select
                    value={formData.invoice_consig_bank}
                    onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "invoice_consig_bank")
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Consig. Bank" />
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
                    
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Product <span className="text-red-500">*</span>
                    </label>
                    <Select
                    value={formData.contract_product}
                    onValueChange={(value) =>{
                        handleInputChange({ target: { value } }, "contract_product")
                        fetchProductCustomDescription(value);
                        fetchGRCode(value);
                    }
                        
                    }
                    
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                        {productData?.product?.map((product) => (
                        <SelectItem
                            key={product.product_name}
                            value={product.product_name.toString()}
                        >
                            {product.product_name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    
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
                    placeholder="Enter Consig. Bank Address"
                    value={formData.invoice_consig_bank_address}
                    onChange={(e) => handleInputChange(e, "invoice_consig_bank_address")}
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Pre-Receipts <span className="text-red-500">*</span>
                    </label>
                    <Select
                    value={formData.invoice_prereceipts}
                    onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "invoice_prereceipts")
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Consig. Bank" />
                    </SelectTrigger>
                    <SelectContent>
                        {prereceiptsData?.prereceipts?.map((prereceipts) => (
                        <SelectItem
                            key={prereceipts.prereceipts_name}
                            value={prereceipts.prereceipts_name.toString()}
                        >
                            {prereceipts.prereceipts_name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    
                </div>        


                    </div> 
                </div>

               <div className="mb-8">
               <div className="grid grid-cols-5 gap-6"> 
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
                      {portofLoadingData?.portofLoading?.map((portofLoading) => (
                        <SelectItem
                          key={portofLoading.portofLoading}
                          value={portofLoading.portofLoading.toString()}
                        >
                          {portofLoading.portofLoading}
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
                      {portsData?.country?.map((country) => (
                        <SelectItem
                          key={country.country_port}
                          value={country.country_port.toString()}
                        >
                          {country.country_port}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>
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
                      {portsData?.country?.map((country) => (
                        <SelectItem
                          key={country.country_port}
                          value={country.country_port.toString()}
                        >
                          {country.country_port}
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
                      {portsData?.country?.map((country) => (
                        <SelectItem
                          key={country.country_port}
                          value={country.country_port.toString()}
                        >
                          {country.country_port}
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
                      {countryData?.country?.map((country) => (
                        <SelectItem
                          key={country.country_name}
                          value={country.country_name.toString()}
                        >
                          {country.country_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>

                </div>
                </div>
                <div className="mb-8">
                <div className="grid grid-cols-2 gap-6">
                
                
                
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
                      {containerSizeData?.containerSize?.map((containerSize) => (
                        <SelectItem
                          key={containerSize.containerSize}
                          value={containerSize.containerSize.toString()}
                        >
                          {containerSize.containerSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>
                

                

                <div>
                  <label className="block text-sm font-medium mb-2">
                  Custom Des <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.invoice_product_cust_des}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "invoice_product_cust_des")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Custom Des" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCustomDescriptionData?.productSub?.map((productSub) => (
                        <SelectItem
                          key={productSub.product_description}
                          value={productSub.product_description.toString()}
                        >
                          {productSub.product_description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>
                </div>
                </div>
                <div className="mb-8">
              <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                LUT Code <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.invoice_lut_code}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "invoice_lut_code")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select LUT Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {lutData?.scheme?.map((scheme) => (
                        <SelectItem
                          key={scheme.scheme_description}
                          value={scheme.scheme_description.toString()}
                        >
                          {scheme.scheme_description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">
                GR Code <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.invoice_gr_code}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "invoice_gr_code")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select GR Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {grcodeData?.grcode?.map((grcode) => (
                        <SelectItem
                          key={grcode.gr_code_des}
                          value={grcode.gr_code_des.toString()}
                        >
                          {grcode.gr_code_des}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">
                Payment Terms
                  </label>
                  <Select
                    value={formData.contract_payment_terms}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "contract_payment_terms")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsData?.paymentTermsC?.map((paymentTermsC) => (
                        <SelectItem
                          key={paymentTermsC.paymentTermsC}
                          value={paymentTermsC.paymentTermsC.toString()}
                        >
                          {paymentTermsC.paymentTermsC}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                
              </div>
              </div>
                <div className="mb-8">
              <div className="grid grid-cols-3 gap-6">
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
                    {invoiceData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-gray-50">
                        {[...defaultTableHeaders]
                          .filter((header) =>
                            visibleColumns.includes(header.key)
                          )
                          .map((header) => (
                            <td key={header.key} className="p-2 border">
                              {header.key === "contractSub_marking" ? (
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
                                    <SelectValue placeholder="Select Marking" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {markingData?.marking?.map((marking) => (
                                      <SelectItem
                                        key={marking.marking}
                                        value={marking.marking}
                                      >
                                        {marking.marking}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : header.key === "contractSub_item_name" ? (
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
                                    <SelectValue placeholder="Select Item Name" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {itemNameData?.itemname?.map((itemname) => (
                                      <SelectItem
                                        key={itemname.item_name}
                                        value={itemname.item_name}
                                      >
                                        {itemname.item_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ): header.key === "contractSub_descriptionofGoods" ? (
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
                                    <SelectValue placeholder="Select Item Name" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {descriptionofGoodseData?.descriptionofGoods?.map((descriptionofGoods) => (
                                      <SelectItem
                                        key={descriptionofGoods.descriptionofGoods}
                                        value={descriptionofGoods.descriptionofGoods}
                                      >
                                        {descriptionofGoods.descriptionofGoods}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ): header.key === "contractSub_sbaga" ? (
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
                                    <SelectValue placeholder="Select Bag Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bagTypeData?.bagType?.map((bagType) => (
                                      <SelectItem
                                        key={bagType.bagType}
                                        value={bagType.bagType}
                                      >
                                        {bagType.bagType}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ):(
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
                                    [
                                      'contractSub_item_bag', 
                                     'contractSub_packing',
                                     'contractSub_bagsize',
                                     'contractSub_qntyInMt',
                                     'contractSub_rateMT',
                                     
                                    ].includes(header.key) 
                                      ? "number" 
                                      : "text"
                                  }
                                  step={
                                    [
                                      
                                     
                                    ]
                                     .includes(header.key) 
                                      ? "any" 
                                      : undefined
                                  }
                                  min={
                                    [
                                      'contractSub_item_bag', 
                                     'contractSub_packing',
                                     'contractSub_bagsize',
                                     'contractSub_qntyInMt',
                                     'contractSub_rateMT',
                                     
                                    ]
                                     .includes(header.key) 
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
                            disabled={invoiceData.length === 1}
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

            
          </CardContent>
        </Card>

        
        <div className="flex flex-col items-end">
          {createInvoiceMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending
              ? "Submitting..."
              : "Submit Invoice"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default InvoiceAdd;