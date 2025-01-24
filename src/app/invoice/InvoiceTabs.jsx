import React, { useState } from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import Page from "../dashboard/page";
import InvoiceView from "./InvoiceView";
import InvoicePacking from "./InvoicePacking";

const InvoiceTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Pending", component: <PreshipmentDetails /> },
    { id: 1, label: "Invoice Packing ECGC", component: <InvoiceView /> },
    // { id: 2, label: "Invoice Packing", component: <InvoicePacking /> },
  ];

  return (
    <Page>
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-500 text-indigo-500"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <div key={tab.id} className="transition-opacity duration-300">
                {tab.component}
              </div>
            ) : null
          )}
        </div>
      </div>
    </Page>
  );
};

export default InvoiceTabs;
