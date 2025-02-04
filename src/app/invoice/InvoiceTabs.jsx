import React from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import InvoiceView from "./InvoiceView";
import Page from "../dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceSpiceBoard from "./InvoiceSpiceBoard";
import InvoiceApta from "./InvoiceApta";
import InvoiceCertificateOrigin from "./InvoiceCertificateOrigin";
import InvoiceGst from "./InvoiceGst";

const InvoiceTabs = () => {
  return (
    <Page>
      <div>
        <Tabs defaultValue="pending" className="w-full">
          {/* Tab Navigation */}
          <TabsList className="flex justify-center ">
            <TabsTrigger
              value="pending"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 mr-3"
            >
              Pre_Shipment
            </TabsTrigger>

            <TabsTrigger
              value="invoice_packing"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Invoice Packing ECGC
            </TabsTrigger>
            <TabsTrigger
              value="spice_board"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Spice Board
            </TabsTrigger>
            <TabsTrigger
              value="apta"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Apta
            </TabsTrigger>
            <TabsTrigger
              value="certificate_origin"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Cer. Origin
            </TabsTrigger>
            <TabsTrigger
              value="invoice_gst"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Invoice Gsts
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div>
            <TabsContent value="pending">
              <PreshipmentDetails />
            </TabsContent>
            <TabsContent value="invoice_packing">
              <InvoiceView />
            </TabsContent>
            <TabsContent value="spice_board">
              <InvoiceSpiceBoard />
            </TabsContent>
            <TabsContent value="apta">
              <InvoiceApta />
            </TabsContent>
            <TabsContent value="certificate_origin">
              <InvoiceCertificateOrigin />
            </TabsContent>
            <TabsContent value="invoice_gst">
              <InvoiceGst />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Page>
  );
};

export default InvoiceTabs;
