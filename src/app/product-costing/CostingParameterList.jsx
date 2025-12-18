import Page from "@/app/dashboard/page";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  Edit,
  Search,
  SquarePlus,
  Trash2,
  Eye,
  FileText,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CostingParameterList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const {
    data: costingParameters,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["costing-parameters-list"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-parameters-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.costing || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BASE_URL}/api/panel-delete-costing-parameters/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["costing-parameters-list"] });
      toast({
        title: "Success",
        description: "Costing parameter deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete costing parameter",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Parse JSON string in costing_parameters
  const parsedData = React.useMemo(() => {
    if (!costingParameters) return [];
    
    return costingParameters.map(item => ({
      ...item,
      parsed_parameters: JSON.parse(item.costing_parameters || "[]"),
      parameters_count: JSON.parse(item.costing_parameters || "[]").length
    }));
  }, [costingParameters]);

  // Define columns for the table
  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "costing_parameters_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costing Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("costing_parameters_name")}</div>
      ),
    },
    {
      accessorKey: "parameters_count",
      header: "Parameters Count",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {row.getValue("parameters_count")}
          </span>
        </div>
      ),
    },
    {
      id: "parameters_preview",
      header: "Parameters Preview",
      cell: ({ row }) => {
        const parameters = row.original.parsed_parameters;
        return (
          <div className="max-w-xs">
            <div className="flex flex-wrap gap-1">
              {parameters.slice(0, 3).map((param, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800"
                >
                  {param.name}
                  {param.value && (
                    <span className="ml-1 text-gray-600">
                      ({param.value} {param.unit})
                    </span>
                  )}
                </span>
              ))}
              {parameters.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-200 text-gray-600">
                  +{parameters.length - 3} more
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "costing_parameters_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("costing_parameters_status");
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const costingId = row.original.id;
        const costingName = row.original.costing_parameters_name;
        
        return (
          <div className="flex items-center gap-2">
            {/* View/Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/costing-parameter-edit/${costingId}`)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            {/* Delete Button with Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteMutation.isLoading}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  {deleteMutation.isLoading && deleteMutation.variables === costingId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the costing parameter "
                    <span className="font-semibold">{costingName}</span>".
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(costingId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: parsedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  if (isLoading) {
    return <LoaderComponent name="Costing Parameters" />;
  }

  if (isError) {
    return (
      <ErrorComponent message="Error Fetching Costing Parameters" refetch={refetch} />
    );
  }

  return (
    <Page>
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-[400] text-gray-800">Costing Parameters</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your product costing templates
            </p>
            
          </div>
          
          <Button
            onClick={() => navigate("/costing-parameter-create")}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <SquarePlus className="h-4 w-4" />
            Create New Costing
          </Button>
        </div>

        {/* Search and column filter */}
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search costing parameters..."
              value={table.getState().globalFilter || ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "index" ? "Sl No" : 
                       column.id === "costing_parameters_name" ? "Costing Name" : 
                       column.id === "parameters_count" ? "Parameters Count" : 
                       column.id === "parameters_preview" ? "Parameters Preview" : 
                       column.id === "costing_parameters_status" ? "Status" : 
                       column.id === "actions" ? "Actions" : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg mb-2">No costing parameters found</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Create your first costing parameter to get started
                      </p>
                      <Button
                        onClick={() => navigate("/dashboard/costing/create")}
                        variant="outline"
                        className="gap-2"
                      >
                        <SquarePlus className="h-4 w-4" />
                        Create Costing Parameter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination and row selection */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Costing Parameters: &nbsp;
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CostingParameterList;