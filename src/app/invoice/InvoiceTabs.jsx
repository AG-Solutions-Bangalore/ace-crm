import React from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import InvoiceView from "./InvoiceView";
import Page from "../dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="invoice_packing"
              className="px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
            >
              Invoice Packing ECGC
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
          </div>
        </Tabs>
      </div>
    </Page>
  );
};

export default InvoiceTabs;
