// import React, { useState } from "react";
// import PreshipmentDetails from "./PreshipmentDetails";
// import Page from "../dashboard/page";
// import InvoiceView from "./InvoiceView";
// import InvoicePacking from "./InvoicePacking";

// const InvoiceTabs = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   const tabs = [
//     { id: 0, label: "Pending", component: <PreshipmentDetails /> },
//     { id: 1, label: "Invoice Packing ECGC", component: <InvoiceView /> },
//   ];

//   return (
//     <Page>
//       <div className="w-full">
//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-200">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`px-4 py-2 font-medium ${
//                 activeTab === tab.id
//                   ? "border-b-2 border-indigo-500 text-indigo-500"
//                   : "text-gray-600 hover:text-indigo-500"
//               }`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="p-4">
//           {tabs.map((tab) =>
//             activeTab === tab.id ? (
//               <div key={tab.id} className="transition-opacity duration-300">
//                 {tab.component}
//               </div>
//             ) : null
//           )}
//         </div>
//       </div>
//     </Page>
//   );
// };

// export default InvoiceTabs;

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
