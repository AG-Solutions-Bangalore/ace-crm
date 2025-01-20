import Page from '@/app/dashboard/page'
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from '@/components/spinner/ProgressBar';


// Validation Schema
const branchFormSchema = z.object({
  branch_short: z.string().min(1, "Branch short name is required"),
  branch_name: z.string().min(1, "Branch name is required"),
  branch_name_short: z.string().min(1, "Branch short name is required"),
  branch_address: z.string().min(1, "Branch address is required"),
  branch_spice_board: z.string().min(1, "Spice board details are required"),
  branch_iec: z.string().min(1, "IEC code is required"),
  branch_apeda: z.string().min(1, "APEDA details are required"),
  branch_gst: z.string().min(1, "GST number is required"),
  branch_state: z.string().min(1, "State is required"),
  branch_state_no: z.string().min(1, "State number is required"),
  branch_scheme: z.string().min(1, "Scheme details are required"),
  branch_pan_no: z.string().min(1, "PAN number is required"),
  branch_ecgcncb: z.string().min(1, "ECGC/NCB details are required"),
  branch_ecgc_policy: z.string().min(1, "ECGC policy details are required"),
  branch_reg_no: z.string().min(1, "Registration number is required"),
  branch_port_of_loading: z.string().min(1, "Port of loading is required"),
  branch_sign_name: z.string().min(1, "Signatory name is required"),
  branch_sign_no: z.string().min(1, "Signatory number is required"),
});

const BranchHeader = ({ progress }) => {
    return (
      <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Create Branch</h1>
          <p className="text-gray-600 mt-2">Add a new branch to your organization</p>
        </div>
  
        <div className="flex-1 pt-2">
          <div className="sticky top-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Basic Details</span>
              <span className="text-sm font-medium">Additional Details</span>
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

const createBranch = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(
      "https://exportbiz.in/public/api/panel-create-branch",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  
    if (!response.ok) throw new Error("Failed to create branch");
    return response.json();
  };

const CreateBranch = () => {
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
  });
    const [progress, setProgress] = useState(0);

  const createBranchMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Branch created successfully",
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

    useEffect(() => {
      const calculateProgress = () => {
        const totalFields = Object.keys(formData).length;
        const filledFields = Object.values(formData).filter(
          (value) => value.toString().trim() !== ""
        ).length;
        const percentage = Math.round((filledFields / totalFields) * 100);
        setProgress(percentage);
      };
  
      calculateProgress();
    }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = branchFormSchema.parse(formData);
      createBranchMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        });

        toast({
          title: "Validation Error",
          description: (
            <div>
              <ul className="list-disc pl-5">
                {errorMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          ),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  return (
    <Page>
       <form onSubmit={handleSubmit} className="w-full p-4">
       <BranchHeader progress={progress} />
               <Card className="mb-6">
                 <CardContent className="p-6">
                 
       
                   {/* Branch Details Section */}
                   <div className="grid grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium mb-2">
                         Branch Short Name <span className="text-red-500">*</span>
                       </label>
                       <Input
                         value={formData.branch_short}
                         onChange={(e) => handleInputChange(e, "branch_short")}
                         placeholder="Enter branch short name"
                       />
                     </div>
       
                     <div>
                       <label className="block text-sm font-medium mb-2">
                         Branch Name <span className="text-red-500">*</span>
                       </label>
                       <Input
                         value={formData.branch_name}
                         onChange={(e) => handleInputChange(e, "branch_name")}
                         placeholder="Enter branch name"
                       />
                     </div>
       
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
                         onChange={(e) => handleInputChange(e, "branch_port_of_loading")}
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
                   </div>
                 </CardContent>
               </Card>
       
               {/* Submit Button */}
               <div className="flex flex-col items-end">
                 {createBranchMutation.isPending && <ProgressBar progress={70} />}
                 <Button
                   type="submit"
                   className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
                   disabled={createBranchMutation.isPending}
                 >
                   {createBranchMutation.isPending
                     ? "Submitting..."
                     : "Create Branch"}
                 </Button>
               </div>
             </form>
    </Page>
  )
}

export default CreateBranch