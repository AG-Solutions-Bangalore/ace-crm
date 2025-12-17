import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonConfig } from "@/config/ButtonConfig";

const EditProductCosting = ({ costingId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    costing_field_name: "",
    costing_field_type1: "",
    costing_field_type2: "",
    costing_field_type3: "",
    status: "Active", // Adding status field if needed
  });

  const fetchCostingFieldData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-field-by-id/${costingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const costingData = response.data.costing;
      setFormData({
        costing_field_name: costingData.costing_field_name || "",
        costing_field_type1: costingData.costing_field_type1 || "",
        costing_field_type3: costingData.costing_field_type3 || "",
        costing_field_type2: costingData.costing_field_type2 || "",
        status: "Active", // You can add status field if your API returns it
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch costing field data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && costingId) {
      fetchCostingFieldData();
    }
  }, [open, costingId]);

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
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-costing-field/${costingId}`,
        {
          costing_field_name: formData.costing_field_name,
          costing_field_type1: formData.costing_field_type1,
          costing_field_type3: formData.costing_field_type3,
          costing_field_type2: formData.costing_field_type2,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

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
        description:
          error.response?.data?.message || "Failed to update costing field",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 ${
                  isHovered ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Edit
                  className={`h-4 w-4 transition-all duration-200 ${
                    isHovered ? "text-blue-500" : ""
                  }`}
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Costing Field</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Costing Field -{" "}
            <span className="text-xl text-blue-500">
              {formData.costing_field_name}
            </span>
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
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
                <Label htmlFor="costing_field_type3">Category</Label>
                <Input
                  id="costing_field_type3"
                  name="costing_field_type3"
                  value={formData.costing_field_type3}
                  onChange={handleInputChange}
                  placeholder="Enter Category"
                />
              </div>
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
                  placeholder="Enter unit"
                />
              </div>
            </div>

            {/* Status field - uncomment if your API supports status updates */}
            {/* <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange(null, "status", value)
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
            </div> */}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Costing Field"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductCosting;