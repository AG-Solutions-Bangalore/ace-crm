import Page from '@/app/dashboard/page'
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  Edit,
  Eye,
  Loader2,
  Search,
  SquarePlus,
  Trash,
  UserPen,
  View,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BASE_URL from "@/config/BaseUrl";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { ButtonConfig } from "@/config/ButtonConfig";

const MarketDispatch = () => {

  const { toast } = useToast();
  const {
    data: marketDispatchs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["marketDispatchs"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-market-dispatch-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.marketDispatch;
    },
  });

 
  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  // Define columns for the table
  const columns = [
    {
      accessorKey: "mpd_date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("mpd_date");
        return moment(date).format("DD-MMM-YYYY");
      },
    },
    {
      accessorKey: "mpd_bill_ref",
      header: "Ref",
      cell: ({ row }) => <div>{row.getValue("mpd_bill_ref")}</div>,
    },

   
    {
      accessorKey: "mpd_dc_no",
      header: "Dc No",
      cell: ({ row }) => <div>{row.getValue("mpd_dc_no")}</div>,
    },
    {
      accessorKey: "mpd_vendor_name",
      header: "Vendor",
      cell: ({ row }) => <div>{row.getValue("mpd_vendor_name")}</div>,
    },
    {
      accessorKey: "mpd_bill_value",
      header: "Bill Value",
      cell: ({ row }) => <div>{row.getValue("mpd_bill_value")}</div>,
    },
    {
      accessorKey: "mpd_godown",
      header: "Go Down",
      cell: ({ row }) => <div>{row.getValue("mpd_godown")}</div>,
    },
  
 
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const dispatchId = row.original.id;

        return (
          <div className="flex flex-row">
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/view-purchase-order`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                 
                </TooltipTrigger>
                <TooltipContent>View Dispatch</TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/purchase/market-dispatch/editDispatch/${dispatchId}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                 
                </TooltipTrigger>
                <TooltipContent>Edit Dispatch</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: marketDispatchs || [],
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
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading dispatch 
          </Button>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching dispatch 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }
  return (
    <Page>
     
      
            <div className="w-full p-4">
                          <div className="flex text-left text-2xl text-gray-800 font-[400]">
                            Dispatch  List
                          </div>
                          {/* searching and column filter  */}
                          <div className="flex items-center py-4">
                            <div className="relative w-72">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="Search dispatch ..."
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
                            <Button
            variant="default"
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            onClick={() =>
              navigate("/purchase/market-dispatch/createDispatch")
            }
          >
            <SquarePlus className="h-4 w-4" /> Dispatch
          </Button>
                        
                          </div>
                          {/* table  */}
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                  <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                      return (
                                        <TableHead
                                          key={header.id}
                                          className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
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
                                      No results.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          {/* row slection and pagintaion button  */}
                          <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                              Total Dispatch : &nbsp;
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
  )
}

export default MarketDispatch