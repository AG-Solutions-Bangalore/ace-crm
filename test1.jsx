import React, { useState } from "react";
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
import {
  PlusCircle,
  MinusCircle,
  ChevronRight,
  Info,
  Package,
  FileText,
  Clock,
  Shield,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
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
    const {toast} = useToast()
  const [activeSection, setActiveSection] = useState("basic");
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
  
  const sidebarItems = [
    {
      id: "basic",
      title: "Basic Details",
      icon: <FileText className="w-4 h-4 mr-2" />,
      description:
        "Enter customer information, enquiry date and packing details",
    },
    {
      id: "requirements",
      title: "Requirements",
      icon: <Clock className="w-4 h-4 mr-2" />,
      description: "Specify shipping, treatment and sample requirements",
    },
    {
      id: "products",
      title: "Product Details",
      icon: <Package className="w-4 h-4 mr-2" />,
      description: "Add products with specifications and pricing",
    },
  ];

  const ProductCard = ({ data, index, onUpdate, onRemove }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-medium">Product {index + 1}</h4>
          <Button
            variant="ghost"
            onClick={() => onRemove(index)}
            className="text-red-500"
            disabled={enquiryData.length === 1}
          >
            <MinusCircle
              className={`h-4 w-4 ${
                enquiryData.length === 1 ? "opacity-50" : ""
              }`}
            />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="col-span-2 md:col-span-4">
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <Select
              value={data.enquirySub_product_name}
              onValueChange={(value) =>
                onUpdate(index, "enquirySub_product_name", value)
              }
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Code
            </label>
            <Input
              value={data.enquirySub_product_code}
              onChange={(e) =>
                onUpdate(index, "enquirySub_product_code", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SHU</label>
            <Input
              value={data.enquirySub_shu}
              onChange={(e) =>
                onUpdate(index, "enquirySub_shu", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ASTA</label>
            <Input
              value={data.enquirySub_asta}
              onChange={(e) =>
                onUpdate(index, "enquirySub_asta", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quality Type
            </label>
            <Input
              value={data.enquirySub_qlty_type}
              onChange={(e) =>
                onUpdate(index, "enquirySub_qlty_type", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stem Type</label>
            <Input
              value={data.enquirySub_stem_type}
              onChange={(e) =>
                onUpdate(index, "enquirySub_stem_type", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Course Type
            </label>
            <Input
              value={data.enquirySub_course_type}
              onChange={(e) =>
                onUpdate(index, "enquirySub_course_type", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Moisture Value
            </label>
            <Input
              value={data.enquirySub_moist_value}
              onChange={(e) =>
                onUpdate(index, "enquirySub_moist_value", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              value={data.enquirySub_qnty}
              onChange={(e) =>
                onUpdate(index, "enquirySub_qnty", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quoted Price
            </label>
            <Input
              value={data.enquirySub_quoted_price}
              onChange={(e) =>
                onUpdate(index, "enquirySub_quoted_price", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Final Price
            </label>
            <Input
              value={data.enquirySub_final_price}
              onChange={(e) =>
                onUpdate(index, "enquirySub_final_price", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">P2B Blend</label>
            <Input
              value={data.enquirySub_p2b_blend}
              onChange={(e) =>
                onUpdate(index, "enquirySub_p2b_blend", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <Page>
      <div className="w-full p-4 ">
        <div className=" mx-auto bg-white rounded-lg flex">
          {/* Sidebar */}
          {/* <div className="w-[25%] border border-gray-200 rounded-l-lg p-6 overflow-auto h-[calc(40rem-3rem)]">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Spice Enquiry Form
              </h2>
              <p className="text-gray-600 text-sm">
                Complete all sections to submit your spice enquiry
              </p>
            </div>

            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id} className="mb-6">
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center w-full p-2  rounded-lg transition-all ${
                      activeSection === item.id
                        ? "bg-yellow-100 text-black shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 "
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 ml-2">
                        {item.description}
                      </p>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="ml-2" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-2 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-800">Need Help?</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Contact our support team for assistance with your enquiry form
                  </p>
                  <Button variant="link" className="text-blue-700 p-0 h-auto mt-2">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div> */}

          <div className="w-[25%] border border-gray-200 rounded-l-lg p-6 overflow-auto h-[calc(40rem-3rem)] bg-white shadow-md">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Spice Enquiry Form
              </h2>
              <p className="text-gray-600 text-sm">
                Complete all sections to submit your spice enquiry
              </p>
            </div>

            <div className="space-y-4">
              {sidebarItems.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center w-full p-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? "bg-yellow-100 text-black shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2 font-medium">{item.title}</span>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="ml-2 w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <div className="mt-2 text-xs text-gray-600 ml-8">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[75%] p-2 border border-gray-200 rounded-r-lg overflow-auto h-[calc(40rem-3rem)]">
            <div className="sticky top-0 bg-yellow-100 p-2 rounded-lg z-10 border border-gray-200">
              {activeSection === "basic" && (
                <h3 className="text-xl font-semibold">Basic Details</h3>
              )}
              {activeSection === "requirements" && (
                <h3 className="text-xl font-semibold">Requirements</h3>
              )}
              {activeSection === "products" && (
                <h3 className="text-xl font-semibold">Product Details</h3>
              )}
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className={activeSection === "basic" ? "block" : "hidden"}>
                {/* <h3 className="text-xl font-semibold mb-6">Basic Details</h3> */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enquiry Year
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            yearData?.year?.current_year || "Select year"
                          }
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
              </div>

              <div
                className={
                  activeSection === "requirements" ? "block" : "hidden"
                }
              >
                {/* <h3 className="text-xl font-semibold mb-6">Requirements</h3> */}
                <div className="space-y-6">
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

                  <div className="  grid grid-cols-3 gap-2">
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
                        <Tabs defaultValue="no">
                          <TabsList>
                            <TabsTrigger value="yes">Yes</TabsTrigger>
                            <TabsTrigger value="no">No</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={activeSection === "products" ? "block" : "hidden"}
              >
                {/* <h3 className="text-xl font-semibold mb-6">Product Details</h3> */}

                {enquiryData.map((row, index) => (
                  <ProductCard
                    key={index}
                    data={row}
                    index={index}
                    onUpdate={(index, key, value) => {
                      const newData = [...enquiryData];
                      newData[index][key] = value;
                      setEnquiryData(newData);
                    }}
                    onRemove={removeRow}
                  />
                ))}

                <Button onClick={addRow} className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Product
                </Button>
              </div>
            </div>

            <div className="flex justify-end  space-x-4 mt-6 ">
              {activeSection !== "basic" && (
                <Button
                  variant="outline"
                  className="bg-yellow-500 text-black"
                  onClick={() => {
                    if (activeSection === "requirements")
                      setActiveSection("basic");
                    if (activeSection === "products")
                      setActiveSection("requirements");
                  }}
                >
                  Previous
                </Button>
              )}
              {activeSection !== "products" && (
                <Button
                  onClick={() => {
                    if (activeSection === "basic")
                      setActiveSection("requirements");
                    if (activeSection === "requirements")
                      setActiveSection("products");
                  }}
                  className="bg-yellow-500 text-black hover:bg-yellow-200"
                >
                  Next
                </Button>
              )}
              {activeSection === "products" && (
                <Button  className="bg-yellow-500 text-black  hover:bg-yellow-200">
                  Submit Enquiry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EnquiryCreate;
// sidebar and main paage like form 