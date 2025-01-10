import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

// API functions


const fetchCustomers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-fetch-customer",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch customer data");
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

const EnquiryHeader = ({ progress }) => {
  return (
    <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">
          Enquiry Form
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage your  enquiries
        </p>
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

const EnquiryCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState([
    "enquirySub_product_name",
    "enquirySub_shu",
    "enquirySub_asta",
    "enquirySub_qlty_type",
    "enquirySub_course_type",
    "enquirySub_qnty",
    "enquirySub_quoted_price",
  ]);

  const defaultTableHeaders = [
    { key: "enquirySub_product_name", label: "Product Name", required: true },
    { key: "enquirySub_shu", label: "SHU (in K)", required: true },
    { key: "enquirySub_asta", label: "ASTA", required: true },
    { key: "enquirySub_qlty_type", label: "Quality Type", required: true },
    { key: "enquirySub_course_type", label: "Course Type", required: true },
    { key: "enquirySub_qnty", label: "Quantity (in MT)", required: true },
    { key: "enquirySub_quoted_price", label: "Quoted Price", required: true },
  ];

  const optionalHeaders = [
    { key: "enquirySub_product_code", label: "Product Code" },
    { key: "enquirySub_stem_type", label: "Stem Type" },
    { key: "enquirySub_moist_value", label: "Moisture Value" },
    { key: "enquirySub_final_price", label: "Final Price" },
    { key: "enquirySub_p2b_blend", label: "P2B Blend" },
  ];

  const [enquiryData, setEnquiryData] = useState([
    {
      enquirySub_product_name: "",
      enquirySub_product_code: "",
      enquirySub_shu: "",
      enquirySub_asta: "",
      enquirySub_qlty_type: "",
      enquirySub_stem_type: "",
      enquirySub_course_type: "",
      enquirySub_moist_value: "",
      enquirySub_qnty: "",
      enquirySub_quoted_price: "",
      enquirySub_final_price: "",
      enquirySub_p2b_blend: "",
    },
  ]);

  const [formData, setFormData] = useState({
    enquiry_year: "",
    customer_id: "",
    enquiry_date: "",
    packing_type: "",
    marking: "",
    shipment_date: "",
    sample_required: "No",
    treatment_required: "No",
    etd: "No",
    gama_rediations: "No",
    steam_sterlizaton: "No",
  });

  

  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
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
        description: "Enquiry created successfully",
      });
      // Reset form or redirect
      navigate("/enquiries");
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

      // Count main form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "etd" &&
          key !== "gama_rediations" &&
          key !== "steam_sterlizaton"
        ) {
          totalFields++;
          if (value) filledFields++;
        }
      });
    

      if (formData.treatment_required === "Yes") {
        totalFields += 3;
        if (formData.etd) filledFields++;
        if (formData.gama_rediations) filledFields++;
        if (formData.steam_sterlizaton) filledFields++;
      }

      // Count product fields
      enquiryData.forEach((row) => {
        Object.entries(row).forEach(([key, value]) => {
          if (visibleColumns.includes(key)) {
            totalFields++;
            if (value) filledFields++;
          }
        });
      });

      const percentage = Math.round((filledFields / totalFields) * 100);
      setProgress(percentage);
    };

    calculateProgress();
  }, [formData, enquiryData, visibleColumns]);

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
    const newData = [...enquiryData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: value,
    };
    setEnquiryData(newData);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const addRow = () => {
    setEnquiryData([
      ...enquiryData,
      {
        enquirySub_product_name: "",
        enquirySub_product_code: "",
        enquirySub_shu: "",
        enquirySub_asta: "",
        enquirySub_qlty_type: "",
        enquirySub_stem_type: "",
        enquirySub_course_type: "",
        enquirySub_moist_value: "",
        enquirySub_qnty: "",
        enquirySub_quoted_price: "",
        enquirySub_final_price: "",
        enquirySub_p2b_blend: "",
      },
    ]);
  };

  const removeRow = (e,index) => {
    if (enquiryData.length > 1) {
      const newData = [...enquiryData];
      newData.splice(index, 1);
      setEnquiryData(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      enquiry_data: enquiryData,
    };

    createEnquiryMutation.mutate(submissionData);
  };

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        {/* <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Spice Creation Form</h1>
          <p className="text-gray-600 mt-2">Create and manage your spice enquiries</p>
        </div> */}
        <EnquiryHeader progress={progress} />

        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Progress bar */}
            <div className="mb-8">
              {/* <div className="flex justify-between items-center mb-4">
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Basic Details</span>
                    <span className="text-sm font-medium">Products</span>
                    <span className="text-sm font-medium">Requirements</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {progress}% Complete
                  </div>
                </div>
              </div> */}

              {/* Basic Details Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
                <div className="grid grid-cols-4 gap-6">
               

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Customer
                    </label>
                    <Select
                      value={formData.customer_id}
                      onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "customer_id")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerData?.customer?.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.customer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enquiry Date
                    </label>
                    <Input
                      type="date"
                      value={formData.enquiry_date}
                      onChange={(e) => handleInputChange(e, "enquiry_date")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Packing Type
                    </label>
                    <Select
                      value={formData.packing_type}
                      onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "packing_type")
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
                </div>
              </div>

              {/* Products Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Products</h2>
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
                          .filter((header) =>
                            visibleColumns.includes(header.key)
                          )
                          .map((header) => (
                            <th
                              key={header.key}
                              className="p-2 text-left border text-sm font-medium"
                            >
                              {header.label}
                            </th>
                          ))}
                        <th className="p-2 text-left border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiryData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b hover:bg-gray-50 "
                        >
                          {[...defaultTableHeaders, ...optionalHeaders]
                            .filter((header) =>
                              visibleColumns.includes(header.key)
                            )
                            .map((header) => (
                              <td key={header.key} className="p-2 border ">
                                {header.key === "enquirySub_product_name" ? (
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
                                    className="w-full border border-gray-300 bg-yellow-50"
                                  />
                                )}
                              </td>
                            ))}
                          <td className="p-2 border">
                            <Button
                              variant="ghost"
                              onClick={() => removeRow(rowIndex)}
                              disabled={enquiryData.length === 1}
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
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marking
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter marking details"
                      value={formData.marking}
                      onChange={(e) => handleInputChange(e, "marking")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shipment Date
                    </label>
                    <Input
                      type="date"
                      value={formData.shipment_date}
                      onChange={(e) => handleInputChange(e, "shipment_date")}
                    />
                  </div>

                  {/* Sample Required and Treatment Required Tabs */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sample Required
                    </label>
                    <Tabs
                      value={formData.sample_required}
                      onValueChange={(value) =>
                        handleInputChange(
                          { target: { value } },
                          "sample_required"
                        )
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Yes">Yes</TabsTrigger>
                        <TabsTrigger value="No">No</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Treatment Required
                    </label>
                    <Tabs
                      value={formData.treatment_required}
                      onValueChange={(value) =>
                        handleInputChange(
                          { target: { value } },
                          "treatment_required"
                        )
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Yes">Yes</TabsTrigger>
                        <TabsTrigger value="No">No</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Conditional Treatment Options */}
                  {formData.treatment_required === "Yes" && (
                    <div className="col-span-2 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.etd === "Yes"}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              { target: { checked, type: "checkbox" } },
                              "etd"
                            )
                          }
                        />
                        <label>ETD</label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.gama_rediations === "Yes"}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              { target: { checked, type: "checkbox" } },
                              "gama_rediations"
                            )
                          }
                        />
                        <label>Gama Radiations</label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.steam_sterlizaton === "Yes"}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              { target: { checked, type: "checkbox" } },
                              "steam_sterlizaton"
                            )
                          }
                        />
                        <label>Steam Sterilization</label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400"
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

export default EnquiryCreate;

//sajid
