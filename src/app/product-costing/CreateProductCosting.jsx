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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";

const CreateProductCosting = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    costing_field_name: "",
    costing_field_type1: "",
    costing_field_type2: "",
    costing_field_type3: "",
  });

  const handleInputChange = (e, key, value) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.costing_field_name ||
      !formData.costing_field_type1 ||
      !formData.costing_field_type3 ||
      !formData.costing_field_type2
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
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-costing-field`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        setFormData({
          costing_field_name: "",
          costing_field_type1: "",
          costing_field_type3: "",
          costing_field_type2: "",
        });
        // Update the query key according to your costing fields query
        await queryClient.invalidateQueries(["costing-fields"]);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create costing field",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {pathname === "/product-costing" ? (
          <Button
            variant="default"
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            <SquarePlus className="h-4 w-4" /> Add Costing Field
          </Button>
        ) : pathname === "/costing-create" ? (
          <p className="text-xs text-blue-600 hover:text-red-800 cursor-pointer">
            <span className="flex items-center flex-row gap-1">
              <SquarePlus className="w-4 h-4" /> <span>Add Costing Field</span>
            </span>
          </p>
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Costing Field</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="costing_field_name">Field Name</Label>
            <Input
              id="costing_field_name"
              name="costing_field_name"
              value={formData.costing_field_name}
              onChange={handleInputChange}
              placeholder="Enter costing field name"
            />
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="grid gap-2 w-full">
              <Label htmlFor="costing_field_type1">Type</Label>
              <Input
                id="costing_field_type1"
                name="costing_field_type1"
                value={formData.costing_field_type1}
                onChange={handleInputChange}
                placeholder="Enter Type"
              />
            </div>
            
            <div className="grid gap-2 w-full">
              <Label htmlFor="costing_field_type2">Unit</Label>
              <Input
                id="costing_field_type2"
                name="costing_field_type2"
                value={formData.costing_field_type2}
                onChange={handleInputChange}
                placeholder="Enter Unit"
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="costing_field_type3">Category</Label>
              <Input
                id="costing_field_type3"
                name="costing_field_type3"
                value={formData.costing_field_type3}
                onChange={handleInputChange}
                placeholder="Enter Categroy"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Costing Field"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductCosting;