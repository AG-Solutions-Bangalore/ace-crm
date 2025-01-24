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
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";

import { Loader2 } from "lucide-react";
import Page from "@/app/dashboard/page";
import { ButtonConfig } from "@/config/ButtonConfig";

// Header Component
const BranchHeader = ({ branchDetails }) => {
  return (
    <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">{branchDetails?.branch?.branch_name}</h1>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {branchDetails?.branch?.branch_status || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 mt-2">Update branch/company details</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Branch Short Name: {branchDetails?.branch?.branch_short || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Branch Id: {branchDetails?.branch?.id || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};


const updateBranch = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `https://exportbiz.in/public/api/panel-update-branch/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to update branch");
  return response.json();
};

const EditBranch = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_name_short: "",
    branch_address: "",
    branch_spice_board: "",
    branch_iec: "",
    branch_apeda: "",
    branch_gst: "",
    branch_state: "",
    branch_state_no: "",
    branch_scheme: "",
    branch_pan_no: "",
    branch_ecgcncb: "",
    branch_ecgc_policy: "",
    branch_reg_no: "",
    branch_port_of_loading: "",
    branch_sign_name: "",
    branch_sign_no: "",
    branch_status: "Active",
  });

  // Fetch branch data by ID
  const {
    data: branchDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["branch", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://exportbiz.in/public/api/panel-fetch-branch-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch branch");
      return response.json();
    },
  });

  useEffect(() => {
    if (branchDetails) {
      setFormData({
        branch_short: branchDetails?.branch.branch_short,
        branch_name: branchDetails?.branch.branch_name,
        branch_name_short: branchDetails.branch.branch_name_short,
        branch_address: branchDetails.branch.branch_address,
        branch_spice_board: branchDetails.branch.branch_spice_board,
        branch_iec: branchDetails.branch.branch_iec,
        branch_apeda: branchDetails.branch.branch_apeda,
        branch_gst: branchDetails.branch.branch_gst,
        branch_state: branchDetails.branch.branch_state,
        branch_state_no: branchDetails.branch.branch_state_no,
        branch_scheme: branchDetails.branch.branch_scheme,
        branch_pan_no: branchDetails.branch.branch_pan_no,
        branch_ecgcncb: branchDetails.branch.branch_ecgcncb,
        branch_ecgc_policy: branchDetails.branch.branch_ecgc_policy,
        branch_reg_no: branchDetails.branch.branch_reg_no,
        branch_port_of_loading: branchDetails.branch.branch_port_of_loading,
        branch_sign_name: branchDetails.branch.branch_sign_name,
        branch_sign_no: branchDetails.branch.branch_sign_no,
        branch_status: branchDetails.branch.branch_status,
      });
    }
  }, [branchDetails]);

  // Update branch mutation
  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
      navigate("/branch");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBranchMutation.mutate({ id, data: formData });
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Branch Data
          </Button>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardContent>
            <div className="text-destructive text-center">
              Error Fetching Branch Data
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <BranchHeader branchDetails={branchDetails} />

        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Branch Details Section */}
            <div className="grid grid-cols-4 gap-6">
              

              <div>
                <label className="block text-sm font-medium mb-2">
                  Branch Short Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_name_short}
                  onChange={(e) => handleInputChange(e, "branch_name_short")}
                  placeholder="Enter branch short name"
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium mb-2">
                  Spice Board Details <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_spice_board}
                  onChange={(e) => handleInputChange(e, "branch_spice_board")}
                  placeholder="Enter spice board details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  IEC Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_iec}
                  onChange={(e) => handleInputChange(e, "branch_iec")}
                  placeholder="Enter IEC code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  APEDA Details <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_apeda}
                  onChange={(e) => handleInputChange(e, "branch_apeda")}
                  placeholder="Enter APEDA details"
                />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium mb-2">
                  Branch Address <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_address}
                  onChange={(e) => handleInputChange(e, "branch_address")}
                  placeholder="Enter branch address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_gst}
                  onChange={(e) => handleInputChange(e, "branch_gst")}
                  placeholder="Enter GST number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_state}
                  onChange={(e) => handleInputChange(e, "branch_state")}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  State Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_state_no}
                  onChange={(e) => handleInputChange(e, "branch_state_no")}
                  placeholder="Enter state number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Scheme Details <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_scheme}
                  onChange={(e) => handleInputChange(e, "branch_scheme")}
                  placeholder="Enter scheme details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_pan_no}
                  onChange={(e) => handleInputChange(e, "branch_pan_no")}
                  placeholder="Enter PAN number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  ECGC/NCB Details <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_ecgcncb}
                  onChange={(e) => handleInputChange(e, "branch_ecgcncb")}
                  placeholder="Enter ECGC/NCB details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  ECGC Policy Details <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_ecgc_policy}
                  onChange={(e) => handleInputChange(e, "branch_ecgc_policy")}
                  placeholder="Enter ECGC policy details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_reg_no}
                  onChange={(e) => handleInputChange(e, "branch_reg_no")}
                  placeholder="Enter registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Port of Loading <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_port_of_loading}
                  onChange={(e) =>
                    handleInputChange(e, "branch_port_of_loading")
                  }
                  placeholder="Enter port of loading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Signatory Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_sign_name}
                  onChange={(e) => handleInputChange(e, "branch_sign_name")}
                  placeholder="Enter signatory name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Signatory Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.branch_sign_no}
                  onChange={(e) => handleInputChange(e, "branch_sign_no")}
                  placeholder="Enter signatory number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Branch Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.branch_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "branch_status")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          {updateBranchMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
            disabled={updateBranchMutation.isPending}
          >
            {updateBranchMutation.isPending ? "Updating..." : "Update Branch"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default EditBranch;
