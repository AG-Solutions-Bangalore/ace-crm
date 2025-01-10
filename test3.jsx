import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { PlusCircle, MinusCircle } from "lucide-react";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";

// API functions
const fetchYear = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-fetch-year",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch year data");
  }

  return response.json();
};

const fetchCustomers = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-fetch-customer",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customer data");
  }

  return response.json();
};

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    "https://adityaspice.com/app/public/api/panel-fetch-product",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }

  return response.json();
};

const EnquiryCreate = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("basic");
  const [progress, setProgress] = useState(33);
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

  const { data: yearData } = useQuery({
    queryKey: ["year"],
    queryFn: fetchYear,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const packingTypes = ["5 kg", "10 kg", "15 kg", "20 kg", "25 kg"];

  const tableHeaders = [
    { key: 'enquirySub_product_name', label: 'Product Name' },
    { key: 'enquirySub_product_code', label: 'Product Code' },
    { key: 'enquirySub_shu', label: 'SHU' },
    { key: 'enquirySub_asta', label: 'ASTA' },
    { key: 'enquirySub_qlty_type', label: 'Quality Type' },
    { key: 'enquirySub_stem_type', label: 'Stem Type' },
    { key: 'enquirySub_course_type', label: 'Course Type' },
    { key: 'enquirySub_moist_value', label: 'Moisture Value' },
    { key: 'enquirySub_qnty', label: 'Quantity' },
    { key: 'enquirySub_quoted_price', label: 'Quoted Price' },
    { key: 'enquirySub_final_price', label: 'Final Price' },
    { key: 'enquirySub_p2b_blend', label: 'P2B Blend' },
  ];

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

  const removeRow = (index) => {
    const newData = [...enquiryData];
    newData.splice(index, 1);
    setEnquiryData(newData);
  };

  return (
    <Page>
      <div className="w-full p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Basic Details</span>
                    <span className="text-sm font-medium">Requirements</span>
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Step 1</span>
                    <span className="text-sm text-gray-500">Step 2</span>
                    <span className="text-sm text-gray-500">Step 3</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <Tabs
                value={activeSection}
                onValueChange={(value) => {
                  setActiveSection(value);
                  setProgress(value === "basic" ? 33 : value === "requirements" ? 66 : 100);
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">
                    Basic Details
                  </TabsTrigger>
                  <TabsTrigger value="requirements" className="flex-1">
                    Requirements
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex-1">
                    Products
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Enquiry Year
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={yearData?.year?.current_year || "Select year"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={yearData?.year?.current_year}>
                            {yearData?.year?.current_year}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Customer
                      </label>
                      <Select>
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
                      <Input type="date" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Packing Type
                      </label>
                      <Select>
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
                </TabsContent>

                <TabsContent value="requirements">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Marking
                      </label>
                      <Input type="text" placeholder="Enter marking details" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Shipment Date
                      </label>
                      <Input type="date" />
                    </div>

                    <div className="col-span-2 grid grid-cols-3 gap-4">
                      {[
                        "Sample Required",
                        "Treatment Required",
                        "ETD",
                        "Gama Radiations",
                        "Steam Sterilization",
                      ].map((label) => (
                        <div key={label}>
                          <label className="block text-sm font-medium mb-2">
                            {label}
                          </label>
                          <Tabs defaultValue="no" className="w-full">
                            <TabsList className="w-full">
                              <TabsTrigger value="yes" className="flex-1">
                                Yes
                              </TabsTrigger>
                              <TabsTrigger value="no" className="flex-1">
                                No
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1200px]">
                      <thead>
                        <tr className="bg-gray-50">
                          {tableHeaders.map((header) => (
                            <th key={header.key} className="p-2 text-left border text-sm font-medium">
                              {header.label}
                            </th>
                          ))}
                          <th className="p-2 text-left border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiryData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b hover:bg-gray-50">
                            {tableHeaders.map((header) => (
                              <td key={header.key} className="p-2 border">
                                {header.key === 'enquirySub_product_name' ? (
                                  <Select
                                    onValueChange={(value) => {
                                      const newData = [...enquiryData];
                                      newData[rowIndex][header.key] = value;
                                      setEnquiryData(newData);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {productData?.product?.map((product, idx) => (
                                        <SelectItem key={idx} value={product.product_name}>
                                          {product.product_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    value={row[header.key]}
                                    onChange={(e) => {
                                      const newData = [...enquiryData];
                                      newData[rowIndex][header.key] = e.target.value;
                                      setEnquiryData(newData);
                                    }}
                                    className="w-full"
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
                      onClick={addRow}
                      className="bg-yellow-500 text-black hover:bg-yellow-400"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

          {/* Navigation Buttons */}
                <div className="flex justify-end space-x-4">
                  {activeSection !== "basic" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeSection === "requirements") {
                          setActiveSection("basic");
                          setProgress(33);
                        }
                        if (activeSection === "products") {
                          setActiveSection("requirements");
                          setProgress(66);
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeSection !== "products" && (
                    <Button
                      className="bg-yellow-500 text-black hover:bg-yellow-400"
                      onClick={() => {
                        if (activeSection === "basic") {
                          setActiveSection("requirements");
                          setProgress(66);
                        }
                        if (activeSection === "requirements") {
                          setActiveSection("products");
                          setProgress(100);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {activeSection === "products" && (
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                      Submit Enquiry
                    </Button>
                  )}
                </div>
              </div>
            </Page>
          );
        };
        
        export default EnquiryCreate;


        // tabs view like page 