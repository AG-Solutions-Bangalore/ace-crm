
import React, { useState, useEffect } from 'react';
import Page from '@/app/dashboard/page';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, GripVertical, X, Eye, Save, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import BASE_URL from '@/config/BaseUrl';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchCountrys, useFetchPorts } from '@/hooks/useApi';


const CanvasItem = ({ id, field, index, onRemove, onChange, formData }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const { data: portsData } = useFetchPorts();
  const { data: countryData } = useFetchCountrys();

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.key}
            name={field.key}
            value={formData[field.key] || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="bg-white h-9 text-sm"
            size="sm"
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.key}
            name={field.key}
            value={formData[field.key] || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={2}
            className="bg-white text-sm min-h-[60px]"
          />
        );
      case 'select':
        const options = field.key === 'buyer_port' 
          ? portsData?.country?.map((item) => ({ value: item.country_port, label: item.country_port })) || []
          : field.key === 'buyer_country'
          ? countryData?.country?.map((item) => ({ value: item.country_name, label: item.country_name })) || []
          : [];
        
        return (
          <Select 
            value={formData[field.key] || ''} 
            onValueChange={(val) => onChange(field.key, val)}
          >
            <SelectTrigger className="bg-white h-9 text-sm">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white text-sm max-h-60">
              {options.map((option, index) => (
                <SelectItem key={index} value={option.value} className="text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={field.key}
            name={field.key}
            value={formData[field.key] || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="bg-white h-9 text-sm"
            size="sm"
          />
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-md border ${isDragging ? 'border-blue-400 shadow-lg' : 'border-gray-200'} p-3 mb-3 hover:border-blue-300 transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="cursor-move p-1 hover:bg-gray-100 rounded flex-shrink-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Label className="font-medium text-gray-700 text-sm truncate">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex-shrink-0">
                {field.type}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 ml-2 flex-shrink-0"
          title="Remove field"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="ml-6">
        {renderField()}
      </div>
    </div>
  );
};

const AvailableFieldItem = ({ field, onAdd, isAdded }) => {
  return (
    <div className="flex items-center justify-between p-2 mb-2 rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 text-sm truncate">{field.label}</span>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{field.type}</span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAdd(field)}
        disabled={isAdded}
        className={`h-6 w-6 p-0 ml-2 flex-shrink-0 ${isAdded ? 'text-green-600 cursor-default' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`}
        title={isAdded ? "Already added" : "Add to form"}
      >
        {isAdded ? (
          <Eye className="h-3 w-3" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

const BuyerCanvas = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

 
  const availableFields = [
    { 
      id: '1', 
      key: 'buyer_name', 
      label: 'Buyer Name', 
      type: 'text', 
      required: true,
      placeholder: 'John Doe Inc.',
      description: 'Full name of the buyer'
    },
    { 
      id: '2', 
      key: 'buyer_sort', 
      label: 'Short Name', 
      type: 'text', 
      required: true,
      placeholder: 'JD Inc.',
      description: 'Abbreviated name'
    },
    { 
      id: '3', 
      key: 'buyer_group', 
      label: 'Group', 
      type: 'text', 
      required: false,
      placeholder: 'Corporate Group',
      description: 'Company affiliation'
    },
    { 
      id: '4', 
      key: 'buyer_address', 
      label: 'Address', 
      type: 'textarea', 
      required: true,
      placeholder: '123 Street, City, Country',
      description: 'Complete postal address'
    },
    { 
      id: '5', 
      key: 'buyer_port', 
      label: 'Port', 
      type: 'select', 
      required: true,
      placeholder: 'Select port',
      description: 'Port of loading'
    },
    { 
      id: '6', 
      key: 'buyer_country', 
      label: 'Country', 
      type: 'select', 
      required: true,
      placeholder: 'Select country',
      description: 'Country of origin'
    },
    { 
      id: '7', 
      key: 'buyer_ecgc_ref', 
      label: 'ECGC Ref', 
      type: 'text', 
      required: false,
      placeholder: 'ECGC-12345',
      description: 'ECGC reference number'
    },
  ];


  const [canvasFields, setCanvasFields] = useState([]);


  useEffect(() => {
    const savedCanvas = localStorage.getItem('buyerCanvasFields');
    const savedFormData = localStorage.getItem('buyerFormData');
    
    if (savedCanvas) {
      try {
        const parsedCanvas = JSON.parse(savedCanvas);
        setCanvasFields(parsedCanvas);
      } catch (e) {
        console.error('Failed to load saved canvas:', e);
      }
    }
    
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData);
        setFormData(parsedFormData);
      } catch (e) {
        console.error('Failed to load saved form data:', e);
      }
    }
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem('buyerCanvasFields', JSON.stringify(canvasFields));
    localStorage.setItem('buyerFormData', JSON.stringify(formData));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setCanvasFields((items) => {
        const oldIndex = items.findIndex((item) => item.canvasId === active.id);
        const newIndex = items.findIndex((item) => item.canvasId === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newArray = arrayMove(items, oldIndex, newIndex);
          saveToLocalStorage();
          return newArray;
        }
        return items;
      });
    }
  };

  const handleAddField = (field) => {
    if (canvasFields.some(f => f.id === field.id)) {
      toast({
        title: "Already Added",
        description: `${field.label} is already in the form`,
        duration: 2000,
      });
      return;
    }

    const newField = { 
      ...field, 
      canvasId: `${field.id}-${Date.now()}` 
    };
    
    setCanvasFields(prev => {
      const newCanvasFields = [...prev, newField];
      saveToLocalStorage();
      return newCanvasFields;
    });
    
    setFormData(prev => {
      const newFormData = { ...prev, [field.key]: '' };
      localStorage.setItem('buyerFormData', JSON.stringify(newFormData));
      return newFormData;
    });

    toast({
      title: "Field Added",
      description: `${field.label} added to canvas`,
      duration: 1500,
    });
  };

  const handleRemoveField = (canvasId) => {
    const fieldToRemove = canvasFields.find(f => f.canvasId === canvasId);
    if (fieldToRemove) {
      setCanvasFields(prev => {
        const newCanvasFields = prev.filter(f => f.canvasId !== canvasId);
        saveToLocalStorage();
        return newCanvasFields;
      });
      
      setFormData(prev => {
        const newData = { ...prev };
        delete newData[fieldToRemove.key];
        localStorage.setItem('buyerFormData', JSON.stringify(newData));
        return newData;
      });

      toast({
        title: "Field Removed",
        description: `${fieldToRemove.label} removed from canvas`,
        duration: 1500,
      });
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: value };
      localStorage.setItem('buyerFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleClearCanvas = () => {
    setCanvasFields([]);
    setFormData({});
    localStorage.removeItem('buyerCanvasFields');
    localStorage.removeItem('buyerFormData');
    
    toast({
      title: "Canvas Cleared",
      description: "All fields have been removed",
      duration: 1500,
    });
  };

  const handleSaveCanvas = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveToLocalStorage();
      setIsSaving(false);
      toast({
        title: "Canvas Saved",
        description: "Your form layout has been saved",
        duration: 1500,
      });
    }, 500);
  };

  const handleSubmit = async () => {
    if (canvasFields.length === 0) {
      toast({
        title: "No Fields",
        description: "Add fields to the canvas first",
        variant: "destructive",
      });
      return;
    }

    const requiredFields = canvasFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Missing Fields",
        description: `Please fill: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-buyer`,
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

        setFormData({});
        setCanvasFields([]);
        localStorage.removeItem('buyerCanvasFields');
        localStorage.removeItem('buyerFormData');

        await queryClient.invalidateQueries(["buyers"]);
        
        toast({
          title: "Buyer Created",
          description: "New buyer has been created successfully",
        });
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
        description: error.response?.data?.message || "Failed to create buyer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-[calc(100vh-140px)]">

          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-blue-600" />
                    Form Canvas
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {canvasFields.length} field{canvasFields.length !== 1 ? 's' : ''} added • Drag to reorder
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCanvas}
                    disabled={canvasFields.length === 0 || isLoading}
                    className="h-8 text-xs"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveCanvas}
                    disabled={isSaving}
                    className="h-8 text-xs"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Save className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden p-4">
                {canvasFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <Plus className="h-10 w-10 mb-3 opacity-50" />
                    <h3 className="font-medium text-gray-500 mb-1">Empty Canvas</h3>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                      Add fields from the panel on the right
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={canvasFields.map(f => f.canvasId)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 h-[25rem] overflow-y-auto pr-2">
                        {canvasFields.map((field) => (
                          <CanvasItem
                            key={field.canvasId}
                            id={field.canvasId}
                            field={field}
                            onRemove={handleRemoveField}
                            onChange={handleInputChange}
                            formData={formData}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {canvasFields.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{canvasFields.length}</span> field{canvasFields.length !== 1 ? 's' : ''} • 
                      <span className="ml-2">
                        {canvasFields.filter(f => f.required).length} required
                      </span>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 bg-blue-600 hover:bg-blue-700 text-white h-9"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Buyer'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Available Fields</h2>
                <p className="text-gray-500 text-sm">
                  Click <Plus className="h-3 w-3 inline text-blue-600" /> to add fields
                </p>
              </div>

              <div className="flex-1 overflow-hidden p-4">
                <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span>Fields Used</span>
                    <span className="font-medium">
                      {canvasFields.length}/{availableFields.length}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${(canvasFields.length / availableFields.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 h-[calc(100%-60px)] overflow-y-auto pr-1">
                  {availableFields.map((field) => {
                    const isAdded = canvasFields.some(f => f.id === field.id);
                    return (
                      <AvailableFieldItem
                        key={field.id}
                        field={field}
              