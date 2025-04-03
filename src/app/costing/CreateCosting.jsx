import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  useFetchBuyers,
  useFetchCompanys,
  useFetchCountrys,
  useFetchPortofLoadings,
  useFetchPorts,
  useFetchProduct,
} from "@/hooks/useApi";
import { ChevronDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import Page from "../dashboard/page";
import CreateBuyer from "../master/buyer/CreateBuyer";
import CreateCountry from "../master/country/CreateCountry";
import CreatePortofLoading from "../master/portofLoading/CreatePortofLoading";
import CreateProduct from "../product/CreateProduct";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";

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
const branch = [
  {
    branch_short: "ASI",
    branch_name: "ADITYA SPICE INDUSTRIES",
    branch_address:
      "S.No. 155-1C,155-1B,156-2,156-3\r\nO V Road, Singara Botla Palem,\r\nPrakasam, Andhra Pradesh - 523109",
  },
];
const CreateCosting = () => {
  const [costingeData, setCostingData] = useState({
    branch_short: branch?.branch_short,
    branch_name: branch?.branch_name,
    branch_address: branch?.branch_address,
    costing_inv_no: "",
    costing_pono: "",
    costing_sc_no: "",
    costing_consignee: "",
    costing_consignee_add: "",
    costing_product_id: "",
    costing_country: "",
    costing_port: "",
    costing_destination_country: "",
    costing_destination_port: "",
    costing_shipper: "",
    costing_raw_material: "",
    costing_process_loss: "",
    costing_grinding_charges: "",
    costing_pala_charges: "",
    costing_local_transport: "",
    costing_loading_unloading: "",
    costing_packing_material: "",
    costing_lab_testing_cost: "",
    costing_adding_oil_cost: "",
    costing_chennai_cfs_feight: "",
    costing_fright_charges: "",
    costing_c_f_charges: "",
    costing_amc_1: "",
    costing_purchase_expences: "",
    costing_labels: "",
    costing_ex_factory: "",
    costing_ex_chennai: "",
    costing_to_destination: "",
    costing_over_head_margin: "",
    costing_sale_rate: "",
    costing_exchange_rate: "",
  });
  const {
    data: costingDefaults = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["costingDefault", costingeData.costing_product_id], // Ensure dependency
    queryFn: async () => {
      console.log(
        "📡 Fetching costingDefaults for:",
        costingeData.costing_product_id
      );
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-costing-default/${costingeData.costing_product_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ API Response:", response.data);
        return response.data.costingDefault;
      } catch (error) {
        console.error("❌ API Fetch Error:", error);
        return [];
      }
    },
    enabled: Boolean(costingeData.costing_product_id),
  });

  const { data: branchData } = useFetchCompanys();
  const { data: buyerData } = useFetchBuyers();
  const { data: productData } = useFetchProduct();
  const { data: countryData } = useFetchCountrys();
  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: portsData } = useFetchPorts();

  useEffect(() => {
    if (
      !costingDefaults ||
      !Array.isArray(costingDefaults) ||
      costingDefaults.length === 0
    ) {
      //   console.warn("⚠️ costingDefaults is empty or not yet loaded!");
      return;
    }

    const getAmount = (type) =>
      costingDefaults.find((item) => item.costing_default_type === type)
        ?.costing_default_amount || "";

    setCostingData((prev) => ({
      ...prev,
      costing_raw_material: getAmount("Raw Material"),
      costing_process_loss: getAmount("Process Loss"),
      costing_grinding_charges: getAmount("Grinding Charges"),
      costing_pala_charges: getAmount("Pala Charges"),
      costing_local_transport: getAmount("Local Transport"),
      costing_loading_unloading: getAmount("Loading & Unloading"),
      costing_packing_material: getAmount("Packing Material"),
      costing_lab_testing_cost: getAmount("Lab Testing Cost"),
      costing_adding_oil_cost: getAmount("Adding Oil Cost"),
      costing_chennai_cfs_feight: getAmount("Chennai CFS Fright"),
      costing_fright_charges: getAmount("Fright Charges"),
      costing_c_f_charges: getAmount("C& F Charges"),
      costing_amc_1: getAmount("AMC 1%"),
      costing_purchase_expences: getAmount("Purchase Expences"),
      costing_labels: getAmount("Labels/Stickers"),
    }));
  }, [costingDefaults]);

  const handleInputChange = useCallback((field, value) => {
    console.log(value);
    setCostingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSelectChange = useCallback(
    (field, value) => {
      setCostingData((prev) => {
        const updatedData = { ...prev, [field]: value };

        console.log(`🔹 Field Changed: ${field}, Value: ${value}`);

        // if (field === "branch_short") {
        //   const selectedBranch = branchData?.branch?.find(
        //     (branch) => branch.branch_short === value
        //   );

        //   if (selectedBranch) {
        //     updatedData.branch_name = selectedBranch.branch_name;
        //     updatedData.branch_address = selectedBranch.branch_address;
        //     updatedData.costing_port = selectedBranch.branch_port_of_loading;
        //   }
        // }

        if (field === "costing_consignee") {
          const selectedBuyer = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === value
          );

          if (selectedBuyer) {
            updatedData.costing_consignee_add = selectedBuyer.buyer_address;
            updatedData.costing_destination_port = selectedBuyer.buyer_port;
            updatedData.costing_destination_country =
              selectedBuyer.buyer_country;
          }
        }

        return updatedData;
      });
    },
    [branchData, buyerData, costingDefaults]
  );

  return (
    <Page>
      <form
        // onSubmit={handleSubmit}
        className="w-full p-4 bg-blue-50/30 rounded-lg"
      >
        {" "}
        <Card className={`mb-6 ${ButtonConfig.cardColor} `}>
          <CardContent className="p-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-8 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Company <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.branch_short}
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
                  </div> */}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                    >
                      <span>
                        {" "}
                        Consignee <span className="text-red-500">*</span>
                      </span>
                      <span></span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_consignee}
                      onChange={(value) =>
                        handleSelectChange("costing_consignee", value)
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
                  {/* <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Branch Name. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Contract Ref"
                      value={costingeData.branch_name}
                      disabled
                      className="bg-white"
                      onChange={(e) =>
                        handleInputChange("branch_name", e.target.value)
                      }
                    />
                  </div> */}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      SC No. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter SC No"
                      value={costingeData.costing_sc_no}
                      className="bg-white"
                      onChange={(e) =>
                        handleInputChange("costing_sc_no", e.target.value)
                      }
                    />
                  </div>
                  {/* <div>
                    <Textarea
                      type="text"
                      placeholder="Enter  Address"
                      value={costingeData.branch_address}
                      className=" text-[9px] bg-white border-none hover:border-none "
                      onChange={(e) =>
                        handleInputChange("branch_address", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Textarea
                      type="text"
                      placeholder="Enter  Consignee Add"
                      value={costingeData.costing_consignee_add}
                      className=" text-[9px] bg-white border-none hover:border-none "
                      onChange={(e) =>
                        handleInputChange(
                          "costing_consignee_add",
                          e.target.value
                        )
                      }
                    />
                  </div> */}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      PONO. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter  PoNo"
                      value={costingeData.costing_pono}
                      className="bg-white"
                      onChange={(e) =>
                        handleInputChange("costing_pono", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Costing No. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter  Costing No"
                      value={costingeData.costing_inv_no}
                      className="bg-white"
                      onChange={(e) =>
                        handleInputChange("costing_inv_no", e.target.value)
                      }
                    />
                  </div>
                  {/* //Product */}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                    >
                      <span>
                        Product <span className="text-red-500">*</span>
                      </span>
                      <span></span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_product_id}
                      onChange={(value) =>
                        handleSelectChange("costing_product_id", value)
                      }
                      options={
                        productData?.product?.map((product) => ({
                          value: product.id,
                          label: product.product_name,
                        })) || []
                      }
                      placeholder="Select Product"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                    >
                      <span>
                        {" "}
                        Costing. Country <span className="text-red-500">*</span>
                      </span>
                      <span></span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_country}
                      onChange={(value) =>
                        handleSelectChange("costing_country", value)
                      }
                      options={
                        countryData?.country?.map((country) => ({
                          value: country.country_name,
                          label: country.country_name,
                        })) || []
                      }
                      placeholder="Select Costing. Country"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        {" "}
                        Costing Port <span className="text-red-500">*</span>
                      </span>
                      <span></span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_port}
                      onChange={(value) =>
                        handleSelectChange("costing_port", value)
                      }
                      options={
                        portofLoadingData?.portofLoading?.map(
                          (portofLoading) => ({
                            value: portofLoading.portofLoading,
                            label: portofLoading.portofLoading,
                          })
                        ) || []
                      }
                      placeholder="Select Costing Port "
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        {" "}
                        Dest. Port <span className="text-red-500">*</span>
                      </span>
                      <span></span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_destination_port}
                      onChange={(value) =>
                        handleSelectChange("costing_destination_port", value)
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
                  {/* <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                    >
                      <span>
                        {" "}
                        Dest. Country <span className="text-red-500">*</span>
                      </span>
                      <span>
                        <CreateCountry />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={costingeData.costing_destination_country}
                      onChange={(value) =>
                        handleSelectChange("costing_destination_country", value)
                      }
                      options={
                        countryData?.country?.map((country) => ({
                          value: country.country_name,
                          label: country.country_name,
                        })) || []
                      }
                      placeholder="Select Dest. Country"
                    />
                  </div> */}
                  {/* <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Shipper. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Shipper"
                      value={costingeData.costing_shipper}
                      className="bg-white"
                      onChange={(e) =>
                        handleInputChange("costing_shipper", e.target.value)
                      }
                    />
                  </div> */}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 gap-4">
                {/* <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  {costingeData.costing_raw_material && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Raw Material. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_raw_material}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_raw_material",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_process_loss && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Process Loss. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_process_loss}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_process_loss",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_grinding_charges && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Grading Charge. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_grinding_charges}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_grinding_charges",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_pala_charges && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Pala Charge. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_pala_charges}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_pala_charges",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_local_transport && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Local Transport. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_local_transport}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_local_transport",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_loading_unloading && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        UnLoading. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_loading_unloading}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_loading_unloading",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_packing_material && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Packing Material.{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_packing_material}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_packing_material",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_lab_testing_cost && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Testing Cost. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_lab_testing_cost}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_lab_testing_cost",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_adding_oil_cost && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Oil Cost. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_adding_oil_cost}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_adding_oil_cost",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_chennai_cfs_feight && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Cfs Feight. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_chennai_cfs_feight}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_chennai_cfs_feight",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_fright_charges && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Fright Charge. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_fright_charges}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_fright_charges",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_c_f_charges && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        C F Charge. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_c_f_charges}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_c_f_charges",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_amc_1 && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Amc. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_amc_1}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange("costing_amc_1", e.target.value)
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_purchase_expences && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Purchase Expences.{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_purchase_expences}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange(
                            "costing_purchase_expences",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  {costingeData.costing_labels && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Costing Label. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={costingeData.costing_labels}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange("costing_labels", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div> */}
                {costingDefaults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border border-blue-400 p-4 rounded-xl">
                    {[
                      { key: "costing_raw_material", label: "Raw Material" },
                      { key: "costing_process_loss", label: "Process Loss" },
                      {
                        key: "costing_grinding_charges",
                        label: "Grading Charge",
                      },
                      { key: "costing_pala_charges", label: "Pala Charge" },
                      {
                        key: "costing_local_transport",
                        label: "Local Transport",
                      },
                      { key: "costing_loading_unloading", label: "UnLoading" },
                      {
                        key: "costing_packing_material",
                        label: "Packing Material",
                      },
                      {
                        key: "costing_lab_testing_cost",
                        label: "Testing Cost",
                      },
                      { key: "costing_adding_oil_cost", label: "Oil Cost" },
                      {
                        key: "costing_chennai_cfs_feight",
                        label: "Cfs Feight",
                      },
                      { key: "costing_fright_charges", label: "Fright Charge" },
                      { key: "costing_c_f_charges", label: "C F Charge" },
                      { key: "costing_amc_1", label: "Amc" },
                      {
                        key: "costing_purchase_expences",
                        label: "Purchase Expenses",
                      },
                      { key: "costing_labels", label: "Costing Label" },
                    ].map(({ key, label }) =>
                      costingeData[key] ? (
                        <div key={key} className="w-full">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {label} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={costingeData[key]}
                            className="w-full md:w-36 p-2 border border-gray-300 rounded-md bg-gray-50"
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Page>
  );
};

export default CreateCosting;
