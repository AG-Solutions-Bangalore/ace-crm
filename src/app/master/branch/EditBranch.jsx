import { ProgressBar } from "@/components/spinner/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Page from "@/app/dashboard/page";
import { Textarea } from "@/components/ui/textarea";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  useFetchPortofLoadings,
  useFetchPreReceipt,
  useFetchScheme,
  useFetchState,
} from "@/hooks/useApi";
import { decryptId } from "@/utils/encyrption/Encyrption";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";

// Header Component
const BranchHeader = ({ branchDetails }) => {
  return (
    <div
      className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 ${ButtonConfig.cardheaderColor} p-4 shadow-sm`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {branchDetails?.branch?.branch_name}
          </h1>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {branchDetails?.branch?.branch_status || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 mt-2">Update company details</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Company Short : {branchDetails?.branch?.branch_short || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Company Prefix: {branchDetails?.branch?.branch_name_short || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const updateBranch = async ({ decryptedId, data }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${BASE_URL}/api/panel-update-branch/${decryptedId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to update Company");
  return response.json();
};

const EditBranch = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);
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
    branch_sign_name1: "",
    branch_sign_no1: "",
    branch_sign_name2: "",
    branch_sign_no2: "",
    branch_state_short: "",
    branch_prereceipts: "",
    branch_status: "Active",
  });

  const [errors, setErrors] = useState({});

  // Validation rules for each field
  const validationRules = {
    branch_name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s&.,'-]+$/,
      message: "Valid company name required"
    },
    branch_name_short: {
      required: true,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9\s&.-]+$/,
      message: "Only letters, numbers, spaces, &, ., - allowed"
    },
    branch_address: {
      required: true,
     
      message: "Address must required"
    },
    branch_iec: {
      required: true,
    
      message: "Valid IEC code required"
    },
    branch_gst: {
      required: true,
     
      message: "Valid GST number required (15 characters)"
    },
    branch_pan_no: {
      required: true,
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: "Valid PAN number required (10 characters)"
    },
    branch_state: {
      required: true,
      message: "State is required"
    },
    branch_state_no: {
      required: true,
    
      message: "Valid state code required"
    },
    branch_state_short: {
      required: true,
   
      message: "Valid  state code required"
    },
    branch_prereceipts: {
      required: true,
      message: "Pre-receipt is required"
    },
    branch_status: {
      required: true,
      message: "Status is required"
    },
    branch_spice_board: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_apeda: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_scheme: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_ecgcncb: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_ecgc_policy: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_reg_no: {
      pattern: /^[A-Z0-9\s/-]*$/,
      message: "Only alphanumeric, spaces, / and - allowed"
    },
    branch_port_of_loading: {
      pattern: /^[a-zA-Z\s,.-]*$/,
      message: "Only letters, spaces, commas, . and - allowed"
    },
    branch_sign_name: {
      pattern: /^[a-zA-Z\s.'-]*$/,
      message: "Only letters, spaces, ., ' and - allowed"
    },
    branch_sign_no: {
      pattern: /^[0-9\s-]*$/,
      message: "Only numbers, spaces and - allowed"
    },
    branch_sign_name1: {
      pattern: /^[a-zA-Z\s.'-]*$/,
      message: "Only letters, spaces, ., ' and - allowed"
    },
    branch_sign_no1: {
      pattern: /^[0-9\s-]*$/,
      message: "Only numbers, spaces and - allowed"
    },
    branch_sign_name2: {
      pattern: /^[a-zA-Z\s.'-]*$/,
      message: "Only letters, spaces, ., ' and - allowed"
    },
    branch_sign_no2: {
      pattern: /^[0-9\s-]*$/,
      message: "Only numbers, spaces and - allowed"
    }
  };

  // Fetch branch data by ID
  const {
    data: branchDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["branch", decryptedId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/panel-fetch-branch-by-id/${decryptedId}`,
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

  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: stateData } = useFetchState();
  const { data: schemeData } = useFetchScheme();
  const { data: prereceiptsData } = useFetchPreReceipt();

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
        branch_state: branchDetails?.branch?.branch_state,
        branch_state_no: branchDetails.branch.branch_state_no,
        branch_scheme: branchDetails?.branch?.branch_scheme,
        branch_pan_no: branchDetails.branch.branch_pan_no,
        branch_ecgcncb: branchDetails.branch.branch_ecgcncb,
        branch_ecgc_policy: branchDetails.branch.branch_ecgc_policy,
        branch_reg_no: branchDetails.branch.branch_reg_no,
        branch_port_of_loading: branchDetails.branch.branch_port_of_loading,
        branch_sign_name: branchDetails.branch.branch_sign_name,
        branch_sign_no: branchDetails.branch.branch_sign_no,
        branch_sign_name1: branchDetails.branch.branch_sign_name1,
        branch_sign_no1: branchDetails.branch.branch_sign_no1,
        branch_sign_name2: branchDetails.branch.branch_sign_name2,
        branch_sign_no2: branchDetails.branch.branch_sign_no2,
        branch_state_short: branchDetails.branch.branch_state_short,
        branch_prereceipts: branchDetails.branch.branch_prereceipts,
        branch_status: branchDetails.branch.branch_status,
      });
    }
  }, [branchDetails]);

  // Validate a single field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (rules.required && !value) {
      return "This field is required";
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message;
    }

    return "";
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'branch_name', 'branch_address', 'branch_iec', 'branch_gst', 
      'branch_pan_no', 'branch_state', 'branch_state_no', 
      'branch_state_short', 'branch_prereceipts', 'branch_status'
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Optional fields validation (only if they have value)
    const optionalFields = [
      'branch_name_short', 'branch_spice_board', 'branch_apeda', 
      'branch_scheme', 'branch_ecgcncb', 'branch_ecgc_policy', 
      'branch_reg_no', 'branch_port_of_loading', 'branch_sign_name', 
      'branch_sign_no', 'branch_sign_name1', 'branch_sign_no1', 
      'branch_sign_name2', 'branch_sign_no2'
    ];
    
    optionalFields.forEach(field => {
      if (formData[field] && formData[field].trim()) {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update branch mutation
  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: (response) => {
      if (response.code == 200) {
        toast({
          title: "Success",
          description: response.msg,
        });
        navigate("/master/branch");
      } else {
        toast({
          title: "Error",
          description: response.msg,
          variant: "destructive",
        });
      }
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
    
    // Auto-uppercase for specific fields
    let processedValue = value;
    if (['branch_gst', 'branch_pan_no', 'branch_iec', 'branch_state_short'].includes(field)) {
      processedValue = value.toUpperCase();
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleStateChange = (value) => {
    handleInputChange({ target: { value } }, "branch_state");
    
    const selectedState = stateData?.state?.find(
      (state) => state.state_name === value
    );
    
    if (selectedState) {
      setFormData((prev) => ({
        ...prev,
        branch_state: value,
        branch_state_no: selectedState.state_no,
        branch_state_short: selectedState.state_short_name,
      }));
      
      // Clear state-related errors
      setErrors(prev => ({
        ...prev,
        branch_state: "",
        branch_state_no: "",
        branch_state_short: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form",
      });
      return;
    }
    
    updateBranchMutation.mutate({ decryptedId, data: formData });
  };

  if (isLoading) {
    return <LoaderComponent name="Company Data" />;
  }
  
  if (isError) {
    return (
      <ErrorComponent message="Error Fetching Company Data" refetch={refetch} />
    );
  }

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <BranchHeader branchDetails={branchDetails} />

        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            {/* Branch Details Section */}
            <div className="grid grid-cols-4 gap-6">
              {/* Company Address */}
              <div className="col-span-1 row-span-2">
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Company Address <span className="text-red-500">*</span>
                </label>
                <Textarea
                  className={`bg-white ${errors.branch_address ? 'border-red-500' : ''}`}
                  rows={5}
                  value={formData.branch_address}
                  onChange={(e) => handleInputChange(e, "branch_address")}
                  placeholder="Enter company address"
                />
                {errors.branch_address && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_address}</p>
                )}
              </div>

              {/* IEC Code */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  IEC Code <span className="text-red-500">*</span>
                </label>
                <Input
                  className={`bg-white ${errors.branch_iec ? 'border-red-500' : ''}`}
                  value={formData.branch_iec}
                  onChange={(e) => handleInputChange(e, "branch_iec")}
                  placeholder="Enter IEC code"
                />
                {errors.branch_iec && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_iec}</p>
                )}
              </div>

              {/* GST Number */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  GST Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className={`bg-white ${errors.branch_gst ? 'border-red-500' : ''}`}
                  value={formData.branch_gst}
                  onChange={(e) => handleInputChange(e, "branch_gst")}
                  placeholder="Enter GST number"
              
                />
                {errors.branch_gst && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_gst}</p>
                )}
              </div>

              {/* PAN Number */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className={`bg-white ${errors.branch_pan_no ? 'border-red-500' : ''}`}
                  value={formData.branch_pan_no}
                  onChange={(e) => handleInputChange(e, "branch_pan_no")}
                  placeholder="Enter PAN number"
                />
                {errors.branch_pan_no && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_pan_no}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  State <span className="text-red-500">*</span>
                </label>
                <Select
                  key={formData.branch_state}
                  value={formData.branch_state}
                  onValueChange={handleStateChange}
                >
                  <SelectTrigger className={`bg-white ${errors.branch_state ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Enter state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {stateData?.state?.map((item) => (
                      <SelectItem value={item.state_name} key={item.state_name}>
                        {item.state_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch_state && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_state}</p>
                )}
              </div>

              {/* State Code */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  State Code <span className="text-red-500">*</span>
                </label>
                <Input
                  className={`bg-white ${errors.branch_state_no ? 'border-red-500' : ''}`}
                  value={formData.branch_state_no}
                  onChange={(e) => handleInputChange(e, "branch_state_no")}
                  placeholder="Enter state code"
                  readOnly
                />
                {errors.branch_state_no && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_state_no}</p>
                )}
              </div>

              {/* State Short */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  State Short <span className="text-red-500">*</span>
                </label>
                <Input
                  className={`bg-white ${errors.branch_state_short ? 'border-red-500' : ''}`}
                  value={formData.branch_state_short}
                  onChange={(e) => handleInputChange(e, "branch_state_short")}
                  placeholder="Enter state short"
                  readOnly
                />
                {errors.branch_state_short && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_state_short}</p>
                )}
              </div>

              {/* Pre Receipt */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Pre Receipt <span className="text-red-500">*</span>
                </label>
                <Select
                  key={formData.branch_prereceipts}
                  value={formData.branch_prereceipts}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "branch_prereceipts")
                  }
                >
                  <SelectTrigger className={`bg-white ${errors.branch_prereceipts ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Enter pre receipt" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {prereceiptsData?.prereceipts?.map((item) => (
                      <SelectItem value={item.prereceipts_name} key={item.prereceipts_name}>
                        {item.prereceipts_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch_prereceipts && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_prereceipts}</p>
                )}
              </div>

              {/* Spice Board Details */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Spice Board Details
                </label>
                <Input
                  className={`bg-white ${errors.branch_spice_board ? 'border-red-500' : ''}`}
                  value={formData.branch_spice_board}
                  onChange={(e) => handleInputChange(e, "branch_spice_board")}
                  placeholder="Enter spice board details"
                />
                {errors.branch_spice_board && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_spice_board}</p>
                )}
              </div>

              {/* APEDA Details */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  APEDA Details
                </label>
                <Input
                  className={`bg-white ${errors.branch_apeda ? 'border-red-500' : ''}`}
                  value={formData.branch_apeda}
                  onChange={(e) => handleInputChange(e, "branch_apeda")}
                  placeholder="Enter APEDA details"
                />
                {errors.branch_apeda && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_apeda}</p>
                )}
              </div>

              {/* LUT Scheme */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  LUT Scheme
                </label>
                <Select
                  key={formData.branch_scheme}
                  value={formData.branch_scheme}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "branch_scheme")
                  }
                >
                  <SelectTrigger className={`bg-white ${errors.branch_scheme ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Enter LUT scheme" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {schemeData?.scheme?.map((item) => (
                      <SelectItem
                        value={item.scheme_short}
                        key={item.scheme_short}
                      >
                        {item.scheme_short}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch_scheme && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_scheme}</p>
                )}
              </div>

              {/* Port of Loading */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Port of Loading
                </label>
                <Select
                  key={formData.branch_port_of_loading}
                  value={formData.branch_port_of_loading}
                  onValueChange={(value) =>
                    handleInputChange(
                      { target: { value } },
                      "branch_port_of_loading"
                    )
                  }
                >
                  <SelectTrigger className={`bg-white ${errors.branch_port_of_loading ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Enter port of loading" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {portofLoadingData?.portofLoading?.map((item) => (
                      <SelectItem
                        value={item.portofLoading}
                        key={item.portofLoading}
                      >
                        {item.portofLoading}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch_port_of_loading && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_port_of_loading}</p>
                )}
              </div>

              {/* Signatory Name 1 */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Signatory Name 1
                </label>
                <Input
                  className={`bg-white ${errors.branch_sign_name ? 'border-red-500' : ''}`}
                  value={formData.branch_sign_name}
                  onChange={(e) => handleInputChange(e, "branch_sign_name")}
                  placeholder="Enter signatory name 1"
                />
                {errors.branch_sign_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_sign_name}</p>
                )}
              </div>

              {/* Signatory Number 1 */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Signatory Number 1
                </label>
                <Input
                  className={`bg-white ${errors.branch_sign_no ? 'border-red-500' : ''}`}
                  value={formData.branch_sign_no}
                  onChange={(e) => handleInputChange(e, "branch_sign_no")}
                  placeholder="Enter signatory number 1"
                />
                {errors.branch_sign_no && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_sign_no}</p>
                )}
              </div>

              {/* Signatory Name 2 */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Signatory Name 2
                </label>
                <Input
                  className={`bg-white ${errors.branch_sign_name1 ? 'border-red-500' : ''}`}
                  value={formData.branch_sign_name1}
                  onChange={(e) => handleInputChange(e, "branch_sign_name1")}
                  placeholder="Enter signatory Name 2"
                />
                {errors.branch_sign_name1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_sign_name1}</p>
                )}
              </div>

              {/* Signatory No 2 */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Signatory No 2
                </label>
                <Input
                  className={`bg-white ${errors.branch_sign_no1 ? 'border-red-500' : ''}`}
                  value={formData.branch_sign_no1}
                  onChange={(e) => handleInputChange(e, "branch_sign_no1")}
                  placeholder="Enter signatory No 2"
                />
                {errors.branch_sign_no1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_sign_no1}</p>
                )}
              </div>

              {/* Company Status */}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Company Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.branch_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "branch_status")
                  }
                >
                  <SelectTrigger className={`bg-white ${errors.branch_status ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.branch_status && (
                  <p className="text-red-500 text-xs mt-1">{errors.branch_status}</p>
                )}
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
            {updateBranchMutation.isPending ? "Updating..." : "Update Company"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default EditBranch;