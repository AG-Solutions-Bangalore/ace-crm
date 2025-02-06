

















import React, { useState } from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import InvoiceView from "./InvoiceView";
import Page from "../dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceSpiceBoard from "./InvoiceSpiceBoard";
import InvoiceApta from "./InvoiceApta";
import InvoiceCertificateOrigin from "./InvoiceCertificateOrigin";
import InvoiceGst from "./InvoiceGst";
import BuyerInvoice from "./BuyerInvoice";
import PerfomaInvoice from "./PerfomaInvoice";
import BlDraft from "./BlDraft";
import InvoicePytho from "./InvoicePytho";
import InvoiceTripartite from "./InvoiceTripartite";

const TABS = [
  { value: "pending", label: "Pre_Shipment", component: PreshipmentDetails },
  { value: "invoice_packing", label: "Invoice Packing ECGC", component: InvoiceView },
  { value: "spice_board", label: "Spice Board", component: InvoiceSpiceBoard },
  { value: "apta", label: "Apta", component: InvoiceApta },
  { value: "certificate_origin", label: "Cer. Origin", component: InvoiceCertificateOrigin },
  { value: "invoice_gst", label: "Invoice Gsts", component: InvoiceGst },
  { value: "tripartite", label: "Tripartite", component: InvoiceTripartite },
  { value: "bldraft", label: "Bl Draft", component: BlDraft },
  { value: "buyerinvoice", label: "Buyer Invoice", component: BuyerInvoice },
  { value: "performainvoice", label: "Performa Invoice", component: PerfomaInvoice },
  { value: "pytho", label: "Pytho", component: InvoicePytho }
];

const InvoiceTabs = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Page>
      <div className="relative flex w-full">
        {/* left 85 %  */}
        <div className="w-[85%] overflow-x-auto overflow-scroll p-4">
          <div className="bg-white rounded-lg  shadow-sm">
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {TABS.map(({ value, component: Component }) => (
                  <TabsContent key={value} value={value}>
                    <Component />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right  - 15% width */}
        <div className="w-[15%] fixed right-0 top-20 h-[90vh] p-2">
          <div className="h-full bg-white border border-gray-200  rounded-lg p-4">
            <div className="flex flex-col h-full overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                orientation="vertical"
                className="w-full h-full"
              >
                <TabsList className="flex flex-col w-full h-full space-y-2 overflow-y-auto justify-start">
                  {TABS.map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="w-full px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=inactive]:bg-blue-400 data-[state=active]:text-white  data-[state=inactive]:text-black data-[state=inactive]:hover:bg-gray-200 shrink-0"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

       
        <div className="w-[15%] " />
      </div>
    </Page>
  );
};

export default InvoiceTabs;

//sajid
























import React, { useState } from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import InvoiceView from "./InvoiceView";
import Page from "../dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceSpiceBoard from "./InvoiceSpiceBoard";
import InvoiceApta from "./InvoiceApta";
import InvoiceCertificateOrigin from "./InvoiceCertificateOrigin";
import InvoiceGst from "./InvoiceGst";
import BuyerInvoice from "./BuyerInvoice";
import PerfomaInvoice from "./PerfomaInvoice";
import BlDraft from "./BlDraft";
import InvoicePytho from "./InvoicePytho";
import InvoiceTripartite from "./InvoiceTripartite";
import { StepBack, StepForward, Home, Printer, PrinterCheckIcon } from "lucide-react"; // Home and Printer icons

const TABS = [
  { value: "pending", label: "Pre_Shipment", component: PreshipmentDetails },
  {
    value: "invoice_packing",
    label: "Invoice Packing ECGC",
    component: InvoiceView,
  },
  { value: "spice_board", label: "Spice Board", component: InvoiceSpiceBoard },
  { value: "apta", label: "Apta", component: InvoiceApta },
  {
    value: "certificate_origin",
    label: "Cer. Origin",
    component: InvoiceCertificateOrigin,
  },
  { value: "invoice_gst", label: "Invoice Gsts", component: InvoiceGst },
  { value: "tripartite", label: "Tripartite", component: InvoiceTripartite },
  { value: "bldraft", label: "Bl Draft", component: BlDraft },
  { value: "buyerinvoice", label: "Buyer Invoice", component: BuyerInvoice },
  {
    value: "performainvoice",
    label: "Performa Invoice",
    component: PerfomaInvoice,
  },
  { value: "pytho", label: "Pytho", component: InvoicePytho },
];

const InvoiceTabs = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
  };

  return (
    <Page>
      <div className="relative flex w-full">
        <div
          className={`${
            sidebarOpen ? "w-[85%]" : "w-[100%]"
          } overflow-x-auto overflow-scroll p-2 transition-all duration-300`}
        >
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                {TABS.map(({ value, component: Component }) => (
                  <TabsContent key={value} value={value}>
                    <Component />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right Sidebar - 15% width */}
        <div
          className={`fixed right-0 top-20 h-[90vh] p-2 bg-white border border-gray-200 rounded-lg transition-all duration-300 ${
            sidebarOpen ? "w-[15%]" : "w-0"
          }`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              orientation="vertical"
              className="w-full h-full"
            >
              <TabsList className="flex flex-col w-full h-full space-y-2 overflow-y-auto justify-start">
                {TABS.map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="w-full px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=inactive]:bg-blue-400 data-[state=active]:text-white  data-[state=inactive]:text-black data-[state=inactive]:hover:bg-gray-200 shrink-0"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Toggle Button for Sidebar */}
        <div
          onClick={toggleSidebar}
          className="fixed bottom-5 right-5 bg-blue-500 text-black p-2 rounded-full cursor-pointer shadow-lg transition duration-300 hover:bg-yellow-600"
        >
          {sidebarOpen ? <StepForward /> : <StepBack />}
        </div>
      </div>

      {/* Bottom Left Navigation */}
      <div className="fixed bottom-5 left-0 right-0 mx-auto flex justify-center items-center p-4 bg-blue-300/60 h-12 rounded-xl w-48 shadow-lg">
        <div className="flex space-x-8">
          {/* Home Icon */}
          <div className="cursor-pointer p-2 rounded-full hover:bg-gray-200">
            <PrinterCheckIcon size={24} className="text-black-500" />
          </div>

          {/* Print Icon */}
          <div className="cursor-pointer p-2 rounded-full hover:bg-gray-200">
            <Printer size={24} className="text-black-500" />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default InvoiceTabs;



































































// final code 


import React, { useState } from "react";
import PreshipmentDetails from "./PreshipmentDetails";
import InvoiceView from "./InvoiceView";
import Page from "../dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceSpiceBoard from "./InvoiceSpiceBoard";
import InvoiceApta from "./InvoiceApta";
import InvoiceCertificateOrigin from "./InvoiceCertificateOrigin";
import InvoiceGst from "./InvoiceGst";
import BuyerInvoice from "./BuyerInvoice";
import PerfomaInvoice from "./PerfomaInvoice";
import BlDraft from "./BlDraft";
import InvoicePytho from "./InvoicePytho";
import InvoiceTripartite from "./InvoiceTripartite";
import { StepBack, StepForward } from "lucide-react";

const TABS = [
  { value: "pending", label: "Pre_Shipment", component: PreshipmentDetails },
  {
    value: "invoice_packing",
    label: "Invoice Packing ECGC",
    component: InvoiceView,
  },
  { value: "spice_board", label: "Spice Board", component: InvoiceSpiceBoard },
  { value: "apta", label: "Apta", component: InvoiceApta },
  {
    value: "certificate_origin",
    label: "Cer. Origin",
    component: InvoiceCertificateOrigin,
  },
  { value: "invoice_gst", label: "Invoice Gsts", component: InvoiceGst },
  { value: "tripartite", label: "Tripartite", component: InvoiceTripartite },
  { value: "bldraft", label: "Bl Draft", component: BlDraft },
  { value: "buyerinvoice", label: "Buyer Invoice", component: BuyerInvoice },
  {
    value: "performainvoice",
    label: "Performa Invoice",
    component: PerfomaInvoice,
  },
  { value: "pytho", label: "Pytho", component: InvoicePytho },
];

const InvoiceTabs = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [sidebarOpen, setSidebarOpen] = useState(true); 

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); 
  };

  return (
    <Page>
      <div className="relative flex w-full">
        <div
          className={`${
            sidebarOpen ? "w-[85%]" : "w-[100%]"
          } overflow-x-auto overflow-scroll p-2 transition-all duration-300`}
        >
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                {TABS.map(({ value, component: Component }) => (
                  <TabsContent key={value} value={value}>
                    <Component />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right Sidebar - 15% width */}
        <div
          className={`fixed right-0 top-20 h-[90vh] p-2 bg-white border border-gray-200 rounded-lg transition-all duration-300 ${
            sidebarOpen ? "w-[15%]" : "w-0"
          }`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              orientation="vertical"
              className="w-full h-full"
            >
              <TabsList className="flex flex-col w-full h-full space-y-2 overflow-y-auto justify-start">
                {TABS.map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="w-full px-4 py-2 text-sm font-medium transition duration-300 rounded-md data-[state=active]:bg-yellow-500 data-[state=inactive]:bg-blue-400 data-[state=active]:text-white  data-[state=inactive]:text-black data-[state=inactive]:hover:bg-gray-200 shrink-0"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Toggle Button for Sidebar */}
        <div
          onClick={toggleSidebar}
          className="fixed bottom-5 right-5 bg-blue-500 text-black p-2 rounded-full cursor-pointer shadow-lg transition duration-300 hover:bg-yellow-600"
        >
          {sidebarOpen ? <StepForward /> : <StepBack />}
        </div>

        {/* <div className="w-[15%]" /> */}
      </div>
    </Page>
  );
};

export default InvoiceTabs;








// to lock the inspect 


// src/index.js
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppProvider from './lib/ContextPanel.jsx';

function AppWithDevToolsProtection() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // Block right-click menu
  const preventRightClick = (e) => {
    e.preventDefault();
  };

  // Block DevTools shortcut keys (F12, Ctrl+Shift+I)
  const blockDevToolsShortcut = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    // Prevent right-click
    document.addEventListener("contextmenu", preventRightClick);

    // Detect DevTools open state
    const checkDevTools = () => {
      const threshold = 160; // When the console is opened, it changes the window size
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      if (widthThreshold) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    // Listen for resize to detect DevTools opening
    window.addEventListener("resize", checkDevTools);
    checkDevTools(); // Initial check
    document.addEventListener("keydown", blockDevToolsShortcut);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keydown", blockDevToolsShortcut);
      window.removeEventListener("resize", checkDevTools);
    };
  }, []);

  return (
    <div>
      {devToolsOpen && (
        <div style={{ color: 'red', fontSize: '20px' }}>
          Developer tools are open! This can compromise security.
        </div>
      )}
      <App />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AppWithDevToolsProtection />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
