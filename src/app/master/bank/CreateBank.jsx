import { useToast } from "@/hooks/use-toast";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const CreateBank = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        branch_short: "",
        bank_name: "",
        bank_details: "",
        bank_acc_no: "",
        bank_branch: "",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      if (
        !formData.branch_short ||
        !formData.bank_name ||
        !formData.bank_details ||
        !formData.bank_acc_no ||
        !formData.bank_branch 
      ) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
  
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.post(`${BASE_URL}/api/anel-create-bank`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        toast({
          title: "Success",
          description: "Bank created successfully",
        });
  
        setFormData({
            branch_short: "",
            bank_name: "",
            bank_details: "",
            bank_acc_no: "",
            bank_branch: "",
        });
        await queryClient.invalidateQueries(["banks"]);
  
        setOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to create Banks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  return (
   
       <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* <Button variant="default" className="ml-2 bg-yellow-500 text-black hover:bg-yellow-100">
            <SquarePlus className="h-4 w-4" /> Customer
          </Button> */}
    
            {pathname === "/bank" ? (
              <Button
                variant="default"
                className="ml-2 bg-yellow-500 text-black hover:bg-yellow-100"
              >
                <SquarePlus className="h-4 w-4" /> Bank
              </Button>
            ) : pathname === "/create-contract" ? (
              <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
                Create Banks
              </p>
            ) : null}
          </DialogTrigger>
    
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Bank</DialogTitle>
            </DialogHeader>
    
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="Enter Bank name"
                />
              </div>
    
              <div className="grid gap-2">
                <Label htmlFor="branch_short">Short Name</Label>
                <Input
                  id="branch_short"
                  name="branch_short"
                  value={formData.branch_short}
                  onChange={handleInputChange}
                  placeholder="Enter Short name"
                />
              </div>
    
              <div className="grid gap-2">
                <Label htmlFor="bank_details">Bank Details</Label>
                <Input
                  id="bank_details"
                  name="bank_details"
                  value={formData.bank_details}
                  onChange={handleInputChange}
                  placeholder="Enter Bank Details "
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_acc_no">Bank A/C Details</Label>
                <Input
                  id="bank_acc_no"
                  name="bank_acc_no"
                  value={formData.bank_acc_no}
                  onChange={handleInputChange}
                  placeholder="Enter Bank A/C Details "
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_branch">Bank Branch Details</Label>
                <Input
                  id="bank_branch"
                  name="bank_branch"
                  value={formData.bank_branch}
                  onChange={handleInputChange}
                  placeholder="Enter Bank Branch Details "
                />
              </div>
            </div>
    
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-yellow-500 text-black hover:bg-yellow-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Bank"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
  )
}

export default CreateBank