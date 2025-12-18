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
  Calculator,
  Trash2,
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
import { Link } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import CreateProductCosting from "./CreateProductCosting";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import Page from "@/app/dashboard/page";
import { useToast } from "@/hooks/use-toast";



// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ costingId, costingName, onDeleteSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BASE_URL}/api/panel-delete-costing-field/${costingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({
          title: "Success",
          description: data.msg,
        });
        queryClient.invalidateQueries(["costing-fields"]);
        if (onDeleteSuccess) onDeleteSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.msg,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete costing field",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Confirmation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete the costing field{" "}
            <span className="font-semibold">"{costingName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog Components (import these at the top)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import EditProductCosting from "./EditProductCosting";

const ProductCostingList = () => {
  const {
    data: costingFields,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["costing-fields"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-costing-field-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.costing;
    },
  });

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Define columns for the table
  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "costing_field_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Field Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("costing_field_name")}</div>,
    },
    {
      accessorKey: "costing_field_type3",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("costing_field_type3")}</div>
      ),
    },
    {
      accessorKey: "costing_field_type1",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("costing_field_type1")}</div>
      ),
    },
    {
      accessorKey: "costing_field_type2",
      header: "Unit",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("costing_field_type2")}</div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const costingId = row.original.id;
        const costingName = row.original.costing_field_name;

        return (
          <div className="flex flex-row gap-2">
            <EditProductCosting costingId={costingId} refetch={refetch} />
            <DeleteConfirmationDialog 
              costingId={costingId} 
              costingName={costingName}
              onDeleteSuccess={refetch}
            />
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: costingFields || [],
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
    return <LoaderComponent name="Costing Fields Data" />;
  }

  if (isError) {
    return (
      <ErrorComponent message="Error Fetching Costing Fields Data" refetch={refetch} />
    );
  }

  return (
    <Page>
      <div className="w-full p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left text-2xl text-gray-800 font-[400]">
            Product Costing Fields
          </div>
         
        </div>

        {/* Search and column filter */}
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search costing fields..."
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <CreateProductCosting />
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
                    No costing fields found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Row selection and pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Fields: {table.getFilteredRowModel().rows.length}
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

export default ProductCostingList;