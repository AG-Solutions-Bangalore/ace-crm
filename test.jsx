import { ButtonConfig } from "@/config/ButtonConfig";
import { ChevronDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import Page from "../dashboard/page";
import {
  useFetchBuyers,
  useFetchCompanys,
  useFetchCountrys,
  useFetchPortofLoadings,
  useFetchPorts,
  useFetchProduct,
  useFetchProductCosting,
} from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import CreateBuyer from "../master/buyer/CreateBuyer";
import CreateProduct from "../product/CreateProduct";
import CreatePortofLoading from "../master/portofLoading/CreatePortofLoading";
import CreateCountry from "../master/country/CreateCountry";

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

const CreateCosting = () => {
  const [costingeData, setCostingData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
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
  });
  const { data: branchData } = useFetchCompanys();
  const { data: buyerData } = useFetchBuyers();
  const { data: productData } = useFetchProduct();
  const { data: countryData } = useFetchCountrys();
  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: portsData } = useFetchPorts();
  const { data: costingDefaults } = useFetchProductCosting(
    costingeData.costing_product_id
  );

  useEffect(() => {
    console.log(
      "🔍 API Response - Costing Defaults:",
      costingDefaults.costingDefault
    );
  }, [costingDefaults]);

  console.log(costingeData);
  const handleInputChange = useCallback((field, value) => {
    console.log(value);
    setCostingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  //   const handleSelectChange = useCallback(
  //     (field, value) => {
  //       setCostingData((prev) => {
  //         const updatedData = { ...prev, [field]: value };

  //         if (field === "branch_short") {
  //           const selectedBranch = branchData?.branch?.find(
  //             (branch) => branch.branch_short === value
  //           );

  //           if (selectedBranch) {
  //             updatedData.branch_name = selectedBranch.branch_name;
  //             updatedData.branch_address = selectedBranch.branch_address;
  //             updatedData.costing_port = selectedBranch.branch_port_of_loading;
  //           }
  //         }

  //         if (field === "costing_consignee") {
  //           const selectedBuyer = buyerData?.buyer?.find(
  //             (branch) => branch.buyer_name === value // Ensure this key exists
  //           );
  //           console.log(selectedBuyer);
  //           if (selectedBuyer) {
  //             updatedData.costing_consignee_add = selectedBuyer.buyer_address;
  //             updatedData.costing_destination_port = selectedBuyer.buyer_port;
  //             updatedData.costing_destination_country =
  //               selectedBuyer.buyer_country;
  //           }
  //         }
  //         if (field === "costing_product_id" && costingDefaults) {
  //           updatedData.costing_raw_material =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type == "Raw Material"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_process_loss =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Process Loss"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_grinding_charges =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Grinding Charges"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_pala_charges =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Pala Charges"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_local_transport =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Local Transport"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_loading_unloading =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Loading & Unloading"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_packing_material =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Packing Material"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_lab_testing_cost =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Lab Testing Cost"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_adding_oil_cost =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Adding Oil Cost"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_chennai_cfs_feight =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Chennai CFS Fright"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_fright_charges =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Fright Charges"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_c_f_charges =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "C& F Charges"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_amc_1 =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "AMC 1%"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_purchase_expences =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Purchase Expences"
  //             )?.costing_default_amount || "0.00";
  //           updatedData.costing_labels =
  //             costingDefaults.find(
  //               (item) => item.costing_default_type === "Labels/Stickers"
  //             )?.costing_default_amount || "0.00";
  //         }

  //         return updatedData;
  //       });
  //     },
  //     [branchData, buyerData, costingDefaults] // ✅ Include branchData in dependencies
  //   );
  const handleSelectChange = useCallback(
    (field, value) => {
      setCostingData((prev) => {
        const updatedData = { ...prev, [field]: value };

        console.log(`🔹 Field Changed: ${field}, Value: ${value}`);

        if (field === "branch_short") {
          const selectedBranch = branchData?.branch?.find(
            (branch) => branch.branch_short === value
          );

          console.log("🔹 Selected Branch:", selectedBranch);

          if (selectedBranch) {
            updatedData.branch_name = selectedBranch.branch_name;
            updatedData.branch_address = selectedBranch.branch_address;
            updatedData.costing_port = selectedBranch.branch_port_of_loading;
          }
        }

        if (field === "costing_consignee") {
          const selectedBuyer = buyerData?.buyer?.find(
            (branch) => branch.buyer_name === value
          );

          console.log("🔹 Selected Buyer:", selectedBuyer);

          if (selectedBuyer) {
            updatedData.costing_consignee_add = selectedBuyer.buyer_address;
            updatedData.costing_destination_port = selectedBuyer.buyer_port;
            updatedData.costing_destination_country =
              selectedBuyer.buyer_country;
          }
        }

        if (field === "costing_product_id") {
          console.log("🔹 Triggered costing_product_id change:", value);
          console.log("🔹 Costing Defaults:", costingDefaults);

          if (costingDefaults.costingDefault) {
            const getAmount = (type) =>
              costingDefaults?.costingDefault.find(
                (item) => item.costing_default_type == type
              )?.costing_default_amount || "0.00";

            updatedData.costing_raw_material = getAmount("Raw Material");
            updatedData.costing_process_loss = getAmount("Process Loss");
            updatedData.costing_grinding_charges =
              getAmount("Grinding Charges");
            updatedData.costing_pala_charges = getAmount("Pala Charges");
            updatedData.costing_local_transport = getAmount("Local Transport");
            updatedData.costing_loading_unloading = getAmount(
              "Loading & Unloading"
            );
            updatedData.costing_packing_material =
              getAmount("Packing Material");
            updatedData.costing_lab_testing_cost =
              getAmount("Lab Testing Cost");
            updatedData.costing_adding_oil_cost = getAmount("Adding Oil Cost");
            updatedData.costing_chennai_cfs_feight =
              getAmount("Chennai CFS Fright");
            updatedData.costing_fright_charges = getAmount("Fright Charges");
            updatedData.costing_c_f_charges = getAmount("C& F Charges");
            updatedData.costing_amc_1 = getAmount("AMC 1%");
            updatedData.costing_purchase_expences =
              getAmount("Purchase Expences");
            updatedData.costing_labels = getAmount("Labels/Stickers");

            console.log("✅ Updated Data:", updatedData);
          } else {
            console.warn("⚠️ Costing Defaults is empty or undefined!");
          }
        }

        return updatedData;
      });

      // Delay logging to ensure state is updated
      setTimeout(() => {
        console.log("✅ Final Costing Data after update:", costingeData);
      }, 500);
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
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
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
                </div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                  >
                    <span>
                      {" "}
                      Consignee <span className="text-red-500">*</span>
                    </span>
                    <span>
                      <CreateBuyer />
                    </span>
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
                <div>
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
                </div>
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
                <div>
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
                      handleInputChange("costing_consignee_add", e.target.value)
                    }
                  />
                </div>
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
                    <span>
                      <CreateProduct />
                    </span>
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
                    <span>
                      <CreateCountry />
                    </span>
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
                    <span>
                      <CreatePortofLoading />
                    </span>
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
                    <span>
                      <CreatePortofLoading />
                    </span>
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
                <div>
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
                </div>

                <div>
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
                </div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                  >
                    Raw Material. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={costingeData.costing_raw_material}
                    disabled
                    className="bg-white"
                    onChange={(e) =>
                      handleInputChange("costing_raw_material", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                  >
                    Raw Material. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={costingeData.costing_process_loss}
                    disabled
                    className="bg-white"
                    onChange={(e) =>
                      handleInputChange("costing_process_loss", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Page>
  );
};

export default CreateCosting;
