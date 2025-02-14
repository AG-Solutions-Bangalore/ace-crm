import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlusCircle, MinusCircle, ChevronDown, Trash2 } from "lucide-react";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import BASE_URL from "@/config/BaseUrl";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";
import { useCurrentYear } from "@/hooks/useCurrentYear";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useFetchCompanys, useFetchVendor } from "@/hooks/useApi";


// Validation Schemas
const productRowSchema = z.object({
    purchase_productSub_name: z.string().min(1, "Item name is required"),
    purchase_productSub_name_hsn: z
      .string()
      .min(1, "Item Descriptions is required"),
      
    purchase_productSub_description: z.string().min(1, "Bag Type is required"),
    purchase_productSub_rateInMt: z.number().min(1, "Gross Weight is required"),
    purchase_productSub_qntyInMt: z.number().min(1, "Packing is required"),
    purchase_productSub_packing: z.number().min(1, "Bag is required"),
    purchase_productSub_marking: z.number().min(1, "Quoted price is required"),
   
  });
  
  const contractFormSchema = z.object({
    branch_short: z.string().min(1, "Company Sort is required"),
    branch_name: z.string().min(1, "Company Name is required"),
    branch_address: z.string().min(1, "Company Address is required"),
    purchase_product_year: z.string().optional(),
    purchase_product_date: z.string().min(1, "Contract date is required"),
    purchase_product_no: z.number().min(1, "Contract No is required"),
    purchase_product_ref: z.string().min(1, "Contract Ref is required"),

    purchase_product_seller: z.string().min(1, "Buyer Name is required"),
    purchase_product_seller_add: z.string().min(1, "Buyer Address is required"),
    purchase_product_seller_gst: z.string().min(1, "Product is required"),
    purchase_product_seller_contact: z.string().min(1, "Containers/Size is required"),

    purchase_product_broker: z.string().min(1, "Consignee Name is required"),
    purchase_product_broker_add: z.string().min(1, "Consignee Address is required"),


 
    purchase_product_delivery_date: z.string().min(1, "Port of Loading is required"),
    purchase_product_delivery_at: z.string().min(1, "Destination Port is required"),
    purchase_product_payment_terms: z.string().min(1, "Discharge is required"),
    purchase_product_tc: z.string().min(1, "CIF is required"),
    purchase_product_gst_notification: z.string().min(1, "Dest. Country is required"),
    purchase_product_quality: z.string().optional(),
   
    purchase_product_data: z
      .array(productRowSchema)
      .min(1, "At least one product is required"),
  });


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
  
  const MemoizedProductSelect = React.memo(
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
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      );
    }
  );
const CreatePurchaseOrder = () => {
      const { toast } = useToast();
      const navigate = useNavigate();
    
      const [contractData, setContractData] = useState([
        {
            purchase_productSub_name: "",
            purchase_productSub_name_hsn: "",
            purchase_productSub_description: "",
            purchase_productSub_rateInMt: "",
            purchase_productSub_qntyInMt: "",
            purchase_productSub_packing: "",
            purchase_productSub_marking: "",
        
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
        purchase_product_year: currentYear,
        purchase_product_date: getTodayDate(),
        purchase_product_no: "",
        purchase_product_ref: "",
        purchase_product_seller: "",
        purchase_product_seller_add: "",
        purchase_product_seller_gst: "",
        purchase_product_seller_contact: "",
        purchase_product_broker_add: "",
        purchase_product_delivery_date: "",
        purchase_product_delivery_at: "",
        purchase_product_payment_terms: "",
        contract_destination_port: "",
        purchase_product_tc: "",
        purchase_product_gst_notification: "",
        purchase_product_quality: "",
        
      });
    
   
      const { data: branchData } = useFetchCompanys();
      const { data: vendorData } = useFetchVendor();
     
    
      const createContractMutation = useMutation({
        mutationFn: createContract,
      
        onSuccess: (response) => {
          if (response.code == 200) {
            toast({
              title: "Success",
              description: response.msg,
            });
            navigate("/purchase-order");
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
    
      const handleSelectChange = useCallback(
        (field, value) => {
          setFormData((prev) => ({
            ...prev,
            [field]: value,
          }));
    
        //   if (field === "contract_buyer") {
        //     const selectedBuyer = buyerData?.buyer?.find(
        //       (buyer) => buyer.buyer_name === value
        //     );
        //     if (selectedBuyer) {
        //       setFormData((prev) => ({
        //         ...prev,
        //         contract_buyer_add: selectedBuyer.buyer_address,
        //         contract_consignee: selectedBuyer.buyer_name,
        //         contract_consignee_add: selectedBuyer.buyer_address,
        //         contract_destination_port: selectedBuyer.buyer_port,
        //         contract_discharge: selectedBuyer.buyer_port,
        //         contract_cif: selectedBuyer.buyer_port,
        //         contract_destination_country: selectedBuyer.buyer_country,
        //       }));
        //     }
    
        //     const selectedCompanySort = branchData?.branch?.find(
        //       (branch) => branch.branch_short === formData.branch_short
        //     );
        //     if (selectedCompanySort) {
        //       const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${formData.contract_no}/${formData.contract_year}`;
        //       setFormData((prev) => ({
        //         ...prev,
        //         contract_ref: contractRef,
        //         contract_pono: contractRef,
        //       }));
        //     }
        //   }
    
          if (field === "branch_short") {
            const selectedCompanySort = branchData?.branch?.find(
              (branch) => branch.branch_short === value
            );
            if (selectedCompanySort) {
              setFormData((prev) => ({
                ...prev,
                branch_name: selectedCompanySort.branch_name,
                branch_address: selectedCompanySort.branch_address,
              }));
    
            //   const selectedBuyer = buyerData?.buyer?.find(
            //     (buyer) => buyer.buyer_name === formData.contract_buyer
            //   );
            //   if (selectedBuyer) {
            //     const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${formData.contract_no}/${formData.contract_year}`;
            //     setFormData((prev) => ({
            //       ...prev,
            //       contract_ref: contractRef,
            //       contract_pono: contractRef,
            //     }));
            //   }
            }
          }
    
        //   if (field === "contract_consignee") {
        //     const selectedConsignee = buyerData?.buyer?.find(
        //       (buyer) => buyer.buyer_name === value
        //     );
        //     if (selectedConsignee) {
        //       setFormData((prev) => ({
        //         ...prev,
        //         contract_consignee_add: selectedConsignee.buyer_address,
        //       }));
        //     }
        //   }
    
        //   if (field === "contract_no") {
        //     const selectedBuyer = buyerData?.buyer?.find(
        //       (buyer) => buyer.buyer_name === formData.contract_buyer
        //     );
        //     const selectedCompanySort = branchData?.branch?.find(
        //       (branch) => branch.branch_short === formData.branch_short
        //     );
        //     if (selectedBuyer && selectedCompanySort) {
        //       const contractRef = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${value}/${formData.contract_year}`;
        //       setFormData((prev) => ({
        //         ...prev,
        //         contract_ref: contractRef,
        //         contract_pono: contractRef,
        //       }));
        //     }
        //   }
        },
        [
          branchData,
          formData.branch_short,
          formData.contract_buyer,
          formData.purchase_product_no,
          formData.purchase_product_year,
        ]
      );
    
      const handleRowDataChange = useCallback((rowIndex, field, value) => {
        const numericFields = [
          "purchase_productSub_rateInMt",
          "purchase_productSub_qntyInMt",
          "purchase_productSub_packing",
          "purchase_productSub_marking",
         
        ];
    
        if (numericFields.includes(field)) {
          const sanitizedValue = value.replace(/[^\d.]/g, "");
          const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    
          if (decimalCount > 1) return;
    
          setContractData((prev) => {
            const newData = [...prev];
            newData[rowIndex] = {
              ...newData[rowIndex],
              [field]: sanitizedValue,
            };
            return newData;
          });
        } else {
          setContractData((prev) => {
            const newData = [...prev];
            newData[rowIndex] = {
              ...newData[rowIndex],
              [field]: value,
            };
            return newData;
          });
        }
      }, []);
    
      const addRow = useCallback(() => {
        setContractData((prev) => [
          ...prev,
          {
            purchase_productSub_name: "",
            purchase_productSub_name_hsn: "",
            purchase_productSub_description: "",
            purchase_productSub_rateInMt: "",
            purchase_productSub_qntyInMt: "",
            purchase_productSub_packing: "",
            purchase_productSub_marking: "",
          
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
    
      const fieldLabels = {
        branch_short: "Company Sort",
        branch_name: "Company Name",
        branch_address: "Company Address",
        purchase_product_year: "Contract Year",
        purchase_product_date: "Contract Date",
        purchase_product_no: "Contract No",
        purchase_product_ref: "Contract Ref",
      
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const processedContractData = contractData.map((row) => ({
            ...row,
            contractSub_item_bag: parseFloat(row.contractSub_item_bag),
            contractSub_qntyInMt: parseFloat(row.contractSub_qntyInMt),
            contractSub_rateMT: parseFloat(row.contractSub_rateMT),
            contractSub_packing: parseFloat(row.contractSub_packing),
            contractSub_bagsize: parseFloat(row.contractSub_bagsize),
          }));
    
          const validatedData = contractFormSchema.parse({
            ...formData,
            contract_data: processedContractData,
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
         <form
                onSubmit={handleSubmit}
                className="w-full p-4 bg-blue-50/30 rounded-lg"
              >
                <Card className={`mb-6 ${ButtonConfig.cardColor} `}>
                  <CardContent className="p-6">
                    {/* Basic Details Section */}
                    <div className="mb-0">
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Buyer <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_buyer}
                            onChange={(value) =>
                              handleSelectChange("contract_buyer", value)
                            }
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Consignee <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_consignee}
                            onChange={(value) =>
                              handleSelectChange("contract_consignee", value)
                            }
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Company <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.branch_short}
                            onChange={(value) =>
                              handleSelectChange("branch_short", value)
                            }
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Contract No <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData?.contract_no}
                            onChange={(value) =>
                              handleSelectChange("contract_no", value)
                            }
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
        
                    <div className="mb-2   mt-[2px]">
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <Textarea
                            type="text"
                            placeholder="Enter Buyer Address"
                            value={formData.contract_buyer_add}
                            className=" text-[9px] bg-white border-none hover:border-none "
                            onChange={(e) =>
                              handleInputChange("contract_buyer_add", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Textarea
                            type="text"
                            placeholder="Enter Consignee Address"
                            className=" text-[9px] bg-white border-none hover:border-none"
                            value={formData.contract_consignee_add}
                            onChange={(e) =>
                              handleInputChange(
                                "contract_consignee_add",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div
                          style={{ textAlign: "center" }}
                          className="bg-white rounded-md"
                        >
                          <span style={{ fontSize: "12px" }}>
                            {formData.branch_name}
                          </span>
                          <br />
                          <span style={{ fontSize: "9px", display: "block" }}>
                            {formData.branch_address}
                          </span>
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Contract Date <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={formData.contract_date}
                            className="bg-white"
                            onChange={(e) =>
                              handleInputChange("contract_date", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
        
                    <div className="mb-2 ">
                      <div className="grid grid-cols-5 gap-6">
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Contract Ref. <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter Contract Ref"
                            value={formData.contract_ref}
                            disabled
                            className="bg-white"
                            onChange={(e) =>
                              handleInputChange("contract_ref", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Contract PONO. <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter Contract PoNo"
                            value={formData.contract_pono}
                            className="bg-white"
                            onChange={(e) =>
                              handleInputChange("contract_pono", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Product <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_product}
                            onChange={(value) =>
                              handleSelectChange("contract_product", value)
                            }
                            options={
                              productData?.product?.map((product) => ({
                                value: product.product_name,
                                label: product.product_name,
                              })) || []
                            }
                            placeholder="Select Product"
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Port of Loading <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_loading}
                            onChange={(value) =>
                              handleSelectChange("contract_loading", value)
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Destination Port <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_destination_port}
                            onChange={(value) =>
                              handleSelectChange("contract_destination_port", value)
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
                    <div className="mb-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Discharge <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_discharge}
                            onChange={(value) =>
                              handleSelectChange("contract_discharge", value)
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            CIF <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_cif}
                            onChange={(value) =>
                              handleSelectChange("contract_cif", value)
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Dest. Country <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_destination_country}
                            onChange={(value) =>
                              handleSelectChange("contract_destination_country", value)
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
                        {/* container-size */}
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Containers/Size <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.contract_container_size}
                            onChange={(value) =>
                              handleSelectChange("contract_container_size", value)
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Shipment Date
                          </label>
                          <Input
                            type="date"
                            className="bg-white"
                            value={formData.contract_ship_date}
                            onChange={(e) =>
                              handleInputChange("contract_ship_date", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Shipment
                          </label>
                          <Input
                            className="bg-white"
                            type="text"
                            value={formData.contract_shipment}
                            onChange={(e) =>
                              handleInputChange("contract_shipment", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
        
                    <div className="mb-2">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Specification1
                          </label>
                          <Textarea
                            type="text"
                            className="bg-white"
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Specification2
                          </label>
                          <Textarea
                            type="text"
                            className="bg-white"
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
                    <div className="">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Payment Terms
                          </label>
                          <MemoizedSelect
                            className="bg-white"
                            value={formData.contract_payment_terms}
                            onChange={(value) =>
                              handleSelectChange("contract_payment_terms", value)
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
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                          >
                            Remarks
                          </label>
                          <Textarea
                            type="text"
                            className="bg-white"
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
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-row items-center">
                          <h2 className="text-xl font-semibold">Products</h2>
                        </div>
                      </div>
        
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="p-2 text-center border text-sm font-medium">
                                Marking
                              </TableHead>
        
                              <TableHead className="p-2 text-center border text-sm font-medium">
                                Item Name / Descriptions{" "}
                                <span className="text-red-500">*</span>
                              </TableHead>
        
                              <TableHead className="p-2 text-center border text-sm font-medium">
                                Bags / Bag Type <span className="text-red-500">*</span>
                              </TableHead>
                              <TableHead className="p-2 text-center border text-sm font-medium">
                                Net / Gross <span className="text-red-500">*</span>
                              </TableHead>
        
                              <TableHead className="p-2 text-center border text-sm font-medium">
                                Qnty (MT) <span className="text-red-500">*</span>
                              </TableHead>
                              <TableHead className="p-2  text-center border text-sm font-medium">
                                Rate <span className="text-red-500">*</span>
                              </TableHead>
        
                              <TableHead className="p-2 text-left border w-16">
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contractData.map((row, rowIndex) => (
                              <TableRow key={rowIndex} className="hover:bg-gray-50">
                                <TableCell className="p-2 border">
                                  <MemoizedProductSelect
                                    value={row.contractSub_marking}
                                    onChange={(value) =>
                                      handleRowDataChange(
                                        rowIndex,
                                        "contractSub_marking",
                                        value
                                      )
                                    }
                                    options={
                                      markingData?.marking?.map((m) => ({
                                        value: m.marking,
                                        label: m.marking,
                                      })) || []
                                    }
                                    placeholder="Select Marking"
                                  />
                                </TableCell>
                                <TableCell className="p-2 border">
                                  <div className="flex flex-col gap-2">
                                    <MemoizedProductSelect
                                      value={row.contractSub_item_name}
                                      onChange={(value) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_item_name",
                                          value
                                        )
                                      }
                                      options={
                                        itemNameData?.itemname?.map((i) => ({
                                          value: i.item_name,
                                          label: i.item_name,
                                        })) || []
                                      }
                                      placeholder="Select Item Name"
                                    />
                                    <MemoizedProductSelect
                                      value={row.contractSub_descriptionofGoods}
                                      onChange={(value) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_descriptionofGoods",
                                          value
                                        )
                                      }
                                      options={
                                        descriptionofGoodseData?.descriptionofGoods?.map(
                                          (d) => ({
                                            value: d.descriptionofGoods,
                                            label: d.descriptionofGoods,
                                          })
                                        ) || []
                                      }
                                      placeholder="Select Description"
                                    />
                                  </div>
                                </TableCell>
        
                                <TableCell className="p-2 border">
                                  <div className="flex flex-col gap-2">
                                    <Input
                                      value={row.contractSub_item_bag}
                                      onChange={(e) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_item_bag",
                                          e.target.value
                                        )
                                      }
                                      className="bg-white"
                                      placeholder="Enter Bags"
                                      type="text"
                                    />
                                    <MemoizedProductSelect
                                      value={row.contractSub_sbaga}
                                      onChange={(value) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_sbaga",
                                          value
                                        )
                                      }
                                      options={
                                        bagTypeData?.bagType?.map((b) => ({
                                          value: b.bagType,
                                          label: b.bagType,
                                        })) || []
                                      }
                                      placeholder="Select Bag Type"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="p-2 border w-28">
                                  <div className="flex flex-col gap-2">
                                    <Input
                                      value={row.contractSub_packing}
                                      onChange={(e) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_packing",
                                          e.target.value
                                        )
                                      }
                                      className="bg-white"
                                      placeholder="Enter Net"
                                      type="text"
                                    />
                                    <Input
                                      value={row.contractSub_bagsize}
                                      onChange={(e) =>
                                        handleRowDataChange(
                                          rowIndex,
                                          "contractSub_bagsize",
                                          e.target.value
                                        )
                                      }
                                      className="bg-white"
                                      placeholder="Enter Gross"
                                      type="text"
                                    />
                                  </div>
                                </TableCell>
        
                                <TableCell className="p-2 border w-24">
                                  <Input
                                    value={row.contractSub_qntyInMt}
                                    className="bg-white"
                                    onChange={(e) =>
                                      handleRowDataChange(
                                        rowIndex,
                                        "contractSub_qntyInMt",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Qnty (MT)"
                                    type="text"
                                  />
                                  <p className="text-xs mt-1   ml-2">
                                    {row.contractSub_item_bag &&
                                    row.contractSub_packing ? (
                                      `${
                                        (
                                          parseFloat(row.contractSub_item_bag) *
                                          parseFloat(row.contractSub_packing)
                                        ).toFixed(2) / 1000
                                      }`
                                    ) : (
                                      <span className="text-[11px]"> Bags X Net</span>
                                    )}
                                  </p>
                                </TableCell>
                                <TableCell className="p-2 border w-24">
                                  <Input
                                    className="bg-white"
                                    value={row.contractSub_rateMT}
                                    onChange={(e) =>
                                      handleRowDataChange(
                                        rowIndex,
                                        "contractSub_rateMT",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Rate"
                                    type="text"
                                  />
                                </TableCell>
        
                                <TableCell className="p-2 border">
                                  <Button
                                    variant="ghost"
                                    onClick={() => removeRow(rowIndex)}
                                    disabled={contractData.length === 1}
                                    className="text-red-500 "
                                    type="button"
                                  >
                                    <MinusCircle className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
        
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          onClick={addRow}
                          className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
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
                    className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
                    disabled={createContractMutation.isPending}
                  >
                    {createContractMutation.isPending
                      ? "Submitting..."
                      : "Submit Enquiry"}
                  </Button>
                </div>
              </form>
    </Page>
  )
}

export default CreatePurchaseOrder