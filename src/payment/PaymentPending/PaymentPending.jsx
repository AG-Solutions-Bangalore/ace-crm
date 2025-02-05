import React, { useEffect, useState } from "react";
import Page from "../../app/dashboard/page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Eye, Loader2, Search } from "lucide-react";
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
import BASE_URL from "@/config/BaseUrl";
import moment from "moment";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PaymentPending = () => {
  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [viewData, setViewData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const {
    data: paymentpending,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["paymentpending"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-invoice-payment-pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.invoicePaymentAmount;
    },
  });
  useEffect(() => {
    const fetchContractData = async (selectedId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-invoice-payment-by-invoiceno/${selectedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract data");
        }

        const data = await response.json();
        setViewData(data.paymentSubView);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedId) {
      fetchContractData(selectedId);
    }
  }, [selectedId]);
  console.log(viewData);
  const columns = [
    {
      accessorKey: "invoice_no",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("invoice_no")}</div>,
    },
    {
      accessorKey: "invoice_bl_date",
      header: "BL Date",
      cell: ({ row }) => {
        const date = row.getValue("invoice_bl_date");
        return moment(date).format("DD-MMM-YYYY");
      },
    },
    {
      accessorKey: "invoice_buyer",
      header: "Buyer",
      cell: ({ row }) => <div>{row.getValue("invoice_buyer")}</div>,
    },
    {
      accessorKey: "sum_qnty",
      header: "Qnty",
      cell: ({ row }) => <div>{row.getValue("sum_qnty")}</div>,
    },
    {
      accessorKey: "invoice_i_value_usd",
      header: "Inv USD",
      cell: ({ row }) => <div>{row.getValue("invoice_i_value_usd")}</div>,
    },
    {
      accessorKey: "received",
      header: "Recevied",
      cell: ({ row }) => <div>{row.getValue("received")}</div>,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => <div>{row.getValue("balance")}</div>,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const invoiceId = row.original.id;

        return (
          <div className="flex flex-row">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Eye
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      const id = row.original.invoice_no;
                      setViewData(null);
                      setSelectedId(id);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>View Payment</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: paymentpending || [],
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

  // Render loading state
  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Payment Pending
          </Button>
        </div>
      </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Payment Pending
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
          Payment Pending List
        </div>
        {/* Searching and column filter  */}
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search  Payment Pending ..."
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
        </div>

        {/* Table  */}
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

        {/* Row selection and pagination button  */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Payment Pending : &nbsp;
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

      {/* View Payment Dialog */}
      {viewData && (
        <AlertDialog
          open={viewData !== null}
          onOpenChange={() => setViewData(null)}
          sx={{
            "& .MuiDialog-paper": {
              width: "lg", // You can set a specific width here or use 'lg' if defined
            },
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Details</AlertDialogTitle>
            </AlertDialogHeader>
            {viewData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      P Date
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Adj Adv
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Adj Dp
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Adj Da
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Bank Ch
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Discount
                    </TableHead>
                    <TableHead
                      className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                    >
                      Shortage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewData.map((pending, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {moment(pending.invoiceP_date).format("DD-MMM-YYYY")}
                      </TableCell>
                      <TableCell>{pending.invoicePSub_amt_adv}</TableCell>
                      <TableCell>{pending.invoicePSub_amt_dp}</TableCell>
                      <TableCell>{pending.invoicePSub_amt_da}</TableCell>
                      <TableCell>{pending.invoicePSub_bank_c}</TableCell>
                      <TableCell>{pending.invoicePSub_discount}</TableCell>
                      <TableCell>{pending.invoicePSub_shortage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <h2>No Payment Data Available</h2>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setViewData(null)}>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Page>
  );
};

export default PaymentPending;
