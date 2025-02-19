import React, { useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Page from "@/app/dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import moment from "moment";

const ProductStockView = () => {
  const { toast } = useToast();
  const location = useLocation();
  const containerRef = useRef();

  // Ensure default values to prevent undefined issues
  const formFields = location.state?.formFields || {};
  const from_date = formFields.from_date || "";
  const to_date = formFields.to_date || "";
  const godown = formFields.godown || "";

  const fetchStockData = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.post(
      `${BASE_URL}/api/panel-fetch-item-stocks-report`,
      { from_date, to_date, godown },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Error fetching stock data");
    }
    return response.data;
  };

  const {
    data: stockDatas,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["stockData", from_date, to_date, godown],
    queryFn: fetchStockData,
    enabled: Boolean(from_date && to_date),
  });

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Product_Stock",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      @media print {
        body {
          font-size: 10px; 
          margin: 0mm;
          padding: 0mm;
        }
        table {
          font-size: 11px;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });
  console.log(stockDatas);
  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Stock
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
              Error Fetching Stock
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
  const handleSaveAsPdf = () => {
    const element = containerRef.current;
    generatePdf(element);
  };

  const generatePdf = (element) => {
    const options = {
      margin: [5, 5, 5, 5],
      filename: "Product_Stock.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape",
      },
      pagebreak: { mode: "avoid" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        console.log(`Element Height: ${element.scrollHeight}`);
        console.log(`Page Width: ${pageWidth}, Page Height: ${pageHeight}`);
      })
      .save();
  };

  return (
    <Page>
      <div className="p-4">
        <div className="flex justify-between items-center p-2 rounded-lg mb-5 bg-gray-200">
          <h1 className="text-xl font-bold">Stock Summary</h1>
          <div className="flex flex-row items-center gap-4 font-bold">
            From - {moment(from_date).format("DD-MMM-YYYY")} To -{" "}
            {moment(to_date).format("DD-MMM-YYYY")}
            <Button
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={handleSaveAsPdf}
            >
              <Printer className="h-4 w-4" /> Pdf
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto" ref={containerRef}>
          <table className="w-full border-collapse border border-black text-[12px]">
            <thead className="bg-gray-100 text-[12px]">
              <tr>
                <th
                  className="border border-black px-2 py-2 text-left"
                  colSpan="7"
                >
                  Product Stock-{stockDatas.godown}
                </th>
              </tr>

              <tr>
                <th className="border border-black px-2 py-2 text-left">
                  Product Name
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Opening Stock
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Purchase
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Production
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Processing
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Dispatch
                </th>
                <th className="border border-black px-2 py-2 text-left">
                  Closing Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {stockDatas?.stock?.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black px-2 py-2 ">
                    {stock.purchaseOrderProduct}
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.openpurch_qnty} ({stock.openpurch_bag} Bags)
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.purch_qnty} ({stock.purch_bag} Bags)
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.production_qnty} ({stock.production_bag} Bags)
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.processing_qnty} ({stock.processing_bag} Bags)
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.dispatch_qnty} ({stock.dispatch_bag} Bags)
                  </td>
                  <td className="border border-black px-2 py-2 ">
                    {stock.openpurch_qnty +
                      stock.purch_qnty +
                      stock.production_qnty +
                      stock.processing_qnty -
                      stock.dispatch_qnty}{" "}
                    (
                    {stock.openpurch_bag +
                      stock.purch_bag +
                      stock.production_bag +
                      stock.processing_bag -
                      stock.dispatch_bag}{" "}
                    Bags)
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td className="border border-black px-2 py-2 text-right">
                  Total:
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.openpurch_qnty || 0),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.openpurch_bag || 0),
                    0
                  )}
                  Bags)
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.purch_qnty || 0),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.purch_bag || 0),
                    0
                  )}
                  Bags)
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.production_qnty || 0),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.production_bag || 0),
                    0
                  )}
                  Bags)
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.processing_qnty || 0),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.processing_bag || 0),
                    0
                  )}
                  Bags)
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.dispatch_qnty || 0),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) => sum + Number(stock.dispatch_bag || 0),
                    0
                  )}
                  Bags)
                </td>
                <td className="border border-black text-left px-2 py-2">
                  {stockDatas?.stock?.reduce(
                    (sum, stock) =>
                      sum +
                      Number(
                        stock.openpurch_qnty +
                          stock.purch_qnty +
                          stock.production_qnty +
                          stock.processing_qnty -
                          stock.dispatch_qnty || 0
                      ),
                    0
                  )}
                  ({" "}
                  {stockDatas?.stock?.reduce(
                    (sum, stock) =>
                      sum +
                      Number(
                        stock.openpurch_bag +
                          stock.purch_bag +
                          stock.production_bag +
                          stock.processing_bag -
                          stock.dispatch_bag || 0
                      ),
                    0
                  )}
                  Bags)
                </td>
              </tr>{" "}
            </tfoot>
          </table>
        </div>
      </div>
    </Page>
  );
};

export default ProductStockView;
