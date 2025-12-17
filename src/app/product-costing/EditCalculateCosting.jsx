import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Save, Plus, X, GripVertical, Eye, Calculator, DollarSign, Receipt, Hand, ArrowLeft, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Page from '@/app/dashboard/page';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'https://exportbiz.in/public';

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands',
  'Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const DroppableArea = ({ children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'selected-parameters-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] bg-white relative ${isOver ? 'ring-2 ring-blue-500 ring-inset' : ''} ${
        isEmpty ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''
      }`}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Plus className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">Drop here to add</p>
          </div>
        </div>
      )}
    </div>
  );
};

const DraggableParameterCard = ({ parameter, onAdd, isAdded }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: parameter.id,
    data: {
      type: 'parameter',
      parameter
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div 
        className="flex items-center justify-between p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors group"
        onClick={() => !isAdded && onAdd(parameter)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div
            className="cursor-move p-1 hover:bg-gray-100 rounded mr-2"
            {...listeners}
            {...attributes}
          >
            <Hand className="h-3.5 w-3.5 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm truncate">{parameter.label}</span>
              <span className="text-xs text-gray-500 ml-2">{parameter.unit}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{parameter.description}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(parameter);
          }}
          disabled={isAdded}
          className={`h-6 w-6 p-0 ml-2 ${isAdded ? 'text-green-600 cursor-default' : 'text-blue-600 hover:text-blue-800'}`}
        >
          {isAdded ? <Eye className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};

const ParameterGroup = ({ groupName, parameters, onAdd, selectedParameters, isExpanded, onToggle }) => {
  const addedCount = parameters.filter(param => 
    selectedParameters.some(p => p.key === param.key && !p.isCustom)
  ).length;

  return (
    <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
          )}
          <span className="font-medium text-sm text-gray-700">{groupName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
            {addedCount}/{parameters.length} added
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-2 bg-white grid grid-cols-2 gap-2 items-center">
          {parameters.map((parameter) => {
            const isAdded = selectedParameters.some(p => p.key === parameter.key && !p.isCustom);
            return (
              <DraggableParameterCard
                key={parameter.id}
                parameter={parameter}
                onAdd={onAdd}
                isAdded={isAdded}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const CostParameterItem = ({ id, parameter, value, onUpdate, onRemove, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      onUpdate(id, '');
      return;
    }
    
    const rawValue = inputValue.replace(/[^0-9.]/g, '');
    
    const parts = rawValue.split('.');
    const cleanedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : rawValue;
    
    onUpdate(id, cleanedValue);
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    if (value.endsWith('.')) {
      onUpdate(id, value.slice(0, -1));
    }
  };

  const handleStateChange = (selectedValue) => {
    onUpdate(id, selectedValue);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border-b border-gray-100 hover:bg-red-50 transition-colors ${isDragging ? 'bg-blue-50' : ''}`}
    >
      <div className="flex items-center py-[0.2rem] px-4">
        <div className="w-8 text-center text-xs text-gray-500 mr-2">
          {index + 1}
        </div>
        
        <div
          className="cursor-move p-1 hover:bg-gray-100 rounded mr-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-700 truncate">
              {parameter.label}
            </span>
            <span className="text-xs text-gray-500">{parameter.description}</span>
          </div>
        </div>
        
        <div className="relative w-48 mx-4">
          {parameter.type === 'dropdown' ? (
            <Select value={value || ''} onValueChange={handleStateChange}>
              <SelectTrigger className="bg-white h-8 text-sm">
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="relative">
              <Input
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-white h-8 text-sm text-right pr-8"
                placeholder="0.00"
              />
              <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {parameter.unit}
              </span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 ml-2"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

const EditCalculateCosting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch existing costing parameters by ID
  const { 
    data: existingCosting,
    isLoading: isLoadingExisting,
    isError: isErrorExisting,
    refetch: refetchExisting
  } = useQuery({
    queryKey: ['costing-parameters-by-id', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-parameters-by-id/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.costing;
    },
    enabled: !!id,
  });

  // Fetch all available cost parameters
  const { 
    data: costParameters = [], 
    isLoading: isLoadingCostParameters,
    isError: isErrorCostParameters,
  } = useQuery({
    queryKey: ['costing-parameters'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-field-list`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.costing) {
        const transformedParams = response.data.costing.map((item, index) => {
          const isState = item.costing_field_name.toLowerCase() === 'state';
          
          return {
            id: `param_${item.id}_${index}`,
            key: item.costing_field_name.toLowerCase().replace(/\s+/g, '_'),
            label: item.costing_field_name,
            unit: item.costing_field_type2 || '',
            description: `${item.costing_field_name} field`,
            type: isState ? 'dropdown' : 'number',
            category: item.costing_field_type3 || 'Other' // Add category field
          };
        });
        
        const hasState = transformedParams.some(p => p.label.toLowerCase() === 'state');
        if (!hasState) {
          transformedParams.unshift({
            id: 'state',
            key: 'state',
            label: 'State',
            unit: '',
            description: 'Select state for pricing',
            type: 'dropdown',
            category: 'Location'
          });
        }
        
        return transformedParams;
      }
      return [];
    },
  });

  // Group parameters by category
  const groupedParameters = React.useMemo(() => {
    const groups = {};
    costParameters.forEach(param => {
      const category = param.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(param);
    });
    return groups;
  }, [costParameters]);

  // Initialize expanded groups
  React.useEffect(() => {
    if (Object.keys(groupedParameters).length > 0) {
      const initialExpanded = {};
      Object.keys(groupedParameters).forEach(category => {
        initialExpanded[category] = true; // Expand all groups by default
      });
      setExpandedGroups(initialExpanded);
    }
  }, [groupedParameters]);

  // Update mutation
  const updateCostingMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-costing-parameters/${id}`,
        data,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if(data?.code === 200) {
        toast({
          title: "Success",
          description: `${data?.msg}` || `Costing parameters updated successfully`,
        
          duration: 2000,
        });
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['costing-parameters-list'] });
        queryClient.invalidateQueries({ queryKey: ['costing-parameters-by-id', id] });
        
        navigate('/product-calculation')
      }else {
        toast({
          title: "Error",
          description: `${data?.msg}` || `Error`,
          duration: 2000,
          
        });
      }
    },
    onError: (error) => {
      console.error('Error updating configuration:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || error.message || "Failed to update configuration",
        variant: "destructive",
      });
    }
  });

  // Load existing data when fetched
  useEffect(() => {
    if (existingCosting && costParameters.length > 0) {
      setFileName(existingCosting.costing_parameters_name || '');
      
      try {
        const parsedParameters = JSON.parse(existingCosting.costing_parameters || '[]');
        
        const newSelectedParameters = parsedParameters.map((param, index) => {
          // Find matching parameter from costParameters
          const matchedParam = costParameters.find(cp => 
            cp.label === param.name || 
            cp.key === param.name.toLowerCase().replace(/\s+/g, '_')
          );
          
          if (matchedParam) {
            return {
              ...matchedParam,
              id: `${matchedParam.id}-edit-${index}-${Date.now()}`,
              type: param.type || matchedParam.type,
              unit: param.unit || matchedParam.unit,
              category: matchedParam.category
            };
          }
          
          // If no match found, create a custom parameter
          return {
            id: `custom-${index}-${Date.now()}`,
            key: param.name.toLowerCase().replace(/\s+/g, '_'),
            label: param.name,
            unit: param.unit || '',
            description: `${param.name} field`,
            type: param.type || 'number',
            category: 'Custom',
            isCustom: true
          };
        });
        
        setSelectedParameters(newSelectedParameters);
        
        const values = {};
        newSelectedParameters.forEach((param, index) => {
          values[param.id] = parsedParameters[index]?.value?.toString() || '';
        });
        setParameterValues(values);
        
      } catch (e) {
        console.error('Failed to parse existing parameters:', e);
        toast({
          title: "Error",
          description: "Failed to load existing configuration",
          variant: "destructive",
        });
      }
    }
  }, [existingCosting, costParameters]);

  const handleAddParameter = (parameter) => {
    if (selectedParameters.some(p => p.key === parameter.key && !p.isCustom)) {
      toast({
        title: "Already Added",
        description: `${parameter.label} is already in the calculation`,
        duration: 1500,
      });
      return;
    }

    const newParam = {
      ...parameter,
      id: `${parameter.id}-${Date.now()}-${Math.random()}`
    };
    
    setSelectedParameters(prev => [...prev, newParam]);
    setParameterValues(prev => ({
      ...prev,
      [newParam.id]: ''
    }));
  };

  const handleUpdateParameter = (id, value) => {
    setParameterValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRemoveParameter = (id) => {
    const paramToRemove = selectedParameters.find(p => p.id === id);
    if (paramToRemove) {
      setSelectedParameters(prev => prev.filter(p => p.id !== id));
      setParameterValues(prev => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragId(active.id);
    
    const parameter = costParameters.find(p => p.id === active.id);
    if (parameter) {
      setActiveDragItem(parameter);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveDragId(null);
    setActiveDragItem(null);

    if (over && over.id === 'selected-parameters-area') {
      const parameter = costParameters.find(p => p.id === active.id);
      if (parameter && !selectedParameters.some(p => p.key === parameter.key && !p.isCustom)) {
        handleAddParameter(parameter);
        toast({
          title: "Item Added",
          description: `${parameter.label} added to calculation`,
          duration: 1000,
        });
      }
    }
    
    if (active && over && active.id !== over.id && over.id !== 'selected-parameters-area') {
      const isFromSelected = selectedParameters.some(p => p.id === active.id);
      if (isFromSelected) {
        setSelectedParameters((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }
    }
  };

  const handleDragOver = (event) => {
    const { over } = event;
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
    setActiveDragItem(null);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleUpdateConfiguration = async () => {
    if (selectedParameters.length === 0) {
      toast({
        title: "No Parameters",
        description: "Add parameters to the canvas first",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for API
    const costingParameters = selectedParameters.map(param => {
      const valueStr = parameterValues[param.id] || '';
      const value = param.type === 'dropdown' ? valueStr : (valueStr === '' ? 0 : parseFloat(valueStr) || 0);
      
      return {
        name: param.label,
        value: value,
        type: param.type,
        unit: param.unit
      };
    });

    const postData = {
      costing_parameters_name: fileName,
      costing_parameters: JSON.stringify(costingParameters),
      costing_parameters_status: existingCosting?.costing_parameters_status || 'Active'
    };

    updateCostingMutation.mutate(postData);
  };

  const hasEmptyFields = () => {
    return selectedParameters.some(param => {
      const value = parameterValues[param.id];
      return !value || value.trim() === '';
    });
  };

  // Calculate total parameters count
  const totalParametersCount = costParameters.length;
  const selectedParametersCount = selectedParameters.length;

  if (isLoadingExisting || isLoadingCostParameters) {
    return (
      <Page>
        <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
          <Calculator className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Page>
    );
  }

  if (isErrorExisting) {
    return (
      <Page>
        <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load costing parameter</p>
            <Button onClick={() => refetchExisting()}>
              Retry
            </Button>
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={() => navigate('/product-calculation')}
            >
              Back to List
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="p-4 bg-gray-50 min-h-screen">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/product-calculation')}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="p-2 bg-blue-100 rounded">
                          <Receipt className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">Edit Product Costing</h2>
                          <Input
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="text-sm border-none p-0 h-auto w-full max-w-md"
                            placeholder="Enter costing name..."
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasEmptyFields() && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Some fields empty
                          </span>
                        )}
                        <Button
                          onClick={handleUpdateConfiguration}
                          disabled={selectedParameters.length === 0 || updateCostingMutation.isLoading}
                          className="gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          {updateCostingMutation.isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {updateCostingMutation.isLoading ? 'Updating...' : 'Update'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DroppableArea isEmpty={selectedParameters.length === 0}>
                    {selectedParameters.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <Calculator className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium text-gray-500 mb-2">No items added yet</p>
                        <p className="text-sm text-gray-400 mb-4">Drag or add cost parameters from the right panel</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <Hand className="h-3 w-3" />
                          <span>Drag items here or click to add</span>
                        </div>
                      </div>
                    ) : (
                      <SortableContext
                        items={selectedParameters.map(p => p.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="divide-y divide-gray-100">
                          <div className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center py-2 px-4 text-xs font-medium text-gray-600">
                              <div className="w-8 text-center mr-2">#</div>
                              <div className="flex-1">ITEM DESCRIPTION</div>
                              <div className="w-48 mx-4 text-right">AMOUNT</div>
                              <div className="w-7"></div>
                            </div>
                          </div>
                          
                          <div className="max-h-[25rem] overflow-y-auto">
                            {selectedParameters.map((param, index) => (
                              <CostParameterItem
                                key={param.id}
                                id={param.id}
                                parameter={param}
                                value={parameterValues[param.id] || ''}
                                onUpdate={handleUpdateParameter}
                                onRemove={handleRemoveParameter}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                      </SortableContext>
                    )}
                  </DroppableArea>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span>Available Cost Items</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {selectedParametersCount}/{totalParametersCount}
                    </span>
                  </h3>
                  
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                    {Object.keys(groupedParameters).length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No parameters available</p>
                      </div>
                    ) : (
                      Object.entries(groupedParameters).map(([category, parameters]) => (
                        <ParameterGroup
                          key={category}
                          groupName={category}
                          parameters={parameters}
                          onAdd={handleAddParameter}
                          selectedParameters={selectedParameters}
                          isExpanded={expandedGroups[category]}
                          onToggle={() => toggleGroup(category)}
                        />
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-600">
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span>Items in receipt: {selectedParametersCount}</span>
                          <span className="font-medium">
                            {totalParametersCount > 0 ? 
                              ((selectedParametersCount / totalParametersCount) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ 
                              width: totalParametersCount > 0 ? 
                                `${(selectedParametersCount / totalParametersCount) * 100}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                        <Hand className="h-3 w-3" />
                        <p>Drag items to the left or click to add</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDragItem && (
              <div className="flex items-center justify-between p-2 rounded border border-blue-200 bg-blue-50 shadow-lg opacity-90">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="cursor-move p-1 hover:bg-gray-100 rounded mr-2">
                    <Hand className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{activeDragItem.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{activeDragItem.unit}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{activeDragItem.description}</p>
                  </div>
                </div>
                
                <div className="h-6 w-6 p-0 ml-2 text-blue-600">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </Page>
  );
};

export default EditCalculateCosting;