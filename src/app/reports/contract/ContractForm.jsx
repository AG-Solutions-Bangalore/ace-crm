import Page from "@/app/dashboard/page";
import React, { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  Edit,
  Search,
  SquarePlus,
} from "lucide-react";

import { Input } from "@/components/ui/input";

const ContractForm = () => {
  return (
    <Page>
      <div className="w-full p-4">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Type List
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Enter From Date <span className="text-red-500">*</span>
          </label>
          <Input type="date" placeholder="Enter From Date" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter To Date <span className="text-red-500">*</span>
          </label>
          <Input type="date" placeholder="Enter To Date" />
        </div>




        
      </div>
    </Page>
  );
};

export default ContractForm;
