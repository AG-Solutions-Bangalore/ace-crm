import { useLocation } from "react-router-dom";
import Page from "@/app/dashboard/page";
import { useToast } from "@/hooks/use-toast";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Download, Printer } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";
import { Button } from "@/components/ui/button";

const SalesAccountReport = () => {
  const { toast } = useToast();
  const location = useLocation();
  const containerRef = useRef();
  const reportData = location.state?.reportData;
  const formData = location.state?.formData;
  console.log(formData);
  if (!reportData || !reportData.sales_account) {
    return (
      <Page>
        <p>No data available</p>
      </Page>
    );
  }

  const groupedData = reportData.sales_account.reduce((acc, item) => {
    acc[item.branch_name] = acc[item.branch_name] || [];
    acc[item.branch_name].push(item);
    return acc;
  }, {});

  const overallTotals = reportData.sales_account.reduce(
    (totals, item) => {
      totals.usd += Number(item.invoice_i_value_usd || 0);
      totals.inr += Number(item.invoice_i_value_inr || 0);
      totals.fob += Number(item.invoice_i_value_fob || 0);
      totals.meis += Number(item.meis || 0);
      totals.drawback += Number(item.drawback || 0);
      totals.stax += Number(item.stax || 0);
      return totals;
    },
    { usd: 0, inr: 0, fob: 0, meis: 0, drawback: 0, stax: 0 }
  );

  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "apta",
    pageStyle: `
              @page {
                 size: A4 landscape;
              margin: 5mm;
              
            }
            @media print {
              body {
                border: 0px solid #000;
                    font-size: 10px; 
                margin: 0mm;
                padding: 0mm;
                min-height: 100vh;
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

  const handleDownload = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-download-sales-accounts-report`,
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales_account.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Sales Account downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to download report",
        variant: "destructive",
      });
    }
  };
  return (
    <Page>
      <div className="flex justify-between   items-center p-2 rounded-lg mb-5 bg-gray-200 ">
        <h1 className="text-xl font-bold">Sales Account Summary</h1>
        <div className="flex flex-row items-center gap-4 font-bold">
          <span className="mr-2">
            {" "}
            From -{moment(formData.from_date).format("DD-MMM-YYYY")}
          </span>
          To -{moment(formData.to_date).format("DD-MMM-YYYY")}
          <Button
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            onClick={handlPrintPdf}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>
      <div ref={containerRef}>
        {Object.entries(groupedData).map(([branchName, invoices]) => (
          <div
            key={branchName}
            className="mb-6 border-t mt-6  border-l border-r border-black text-[11px]"
          >
            <h2 className="p-2 bg-gray-200 font-bold border-b border-t border-r border-black">
              {branchName}
            </h2>
            <div
              className="grid bg-white"
              style={{
                gridTemplateColumns:
                  "minmax(30px, auto) minmax(110px, auto) minmax(90px, auto) minmax(90px, auto) minmax(60px, auto) minmax(100px, auto) minmax(110px, auto) minmax(110px, auto) minmax(70px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) ",
              }}
            >
              {/* Header */}
              {[
                "Invoice No",
                "Buyer",
                "S B No",
                "B L No",
                "BL Date",
                "Product",
                "I Value USD",
                "I Value INR",
                "FOB Value",
                "MEIS",
                "Drawback",
                "S.Tax",
              ].map((header, idx) => (
                <div
                  key={idx}
                  className="p-2 font-bold border-b border-r border-t border-black text-gray-900"
                >
                  {header}
                </div>
              ))}
              {/* Data Rows */}
              {invoices.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_no}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_buyer}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_sb_no}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_bl_no}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_bl_date}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.invoice_product}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.invoice_i_value_usd}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.invoice_i_value_inr}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.invoice_i_value_fob}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.meis}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.drawback}
                  </div>
                  <div className="p-2 border-b  border-r border-black text-right">
                    {item.stax}
                  </div>
                </React.Fragment>
              ))}
              {/* Branch Wise Total */}
              <div className="p-2 border-b  border-black font-bold"></div>
              <div className="p-2 border-b border-black"></div>
              <div className="p-2 border-b border-black"></div>
              <div className="p-2 border-b  border-black"></div>
              <div className="p-2 border-b  border-black"></div>
              <div className="p-2 border-b border-r border-black font-bold">
                Total
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.invoice_i_value_usd || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.invoice_i_value_inr || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.invoice_i_value_fob || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.meis || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.drawback || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.stax || 0),
                  0
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Overall Grand Total */}
        <div
          className="grid bg-gray-100 border-t border-l border-r border-black font-bold text-[11px]"
          style={{
            gridTemplateColumns:
              "minmax(88px, auto) minmax(170px, auto) minmax(90px, auto) minmax(90px, auto) minmax(60px, auto) minmax(100px, auto) minmax(110px, auto) minmax(110px, auto) minmax(70px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) ",
          }}
        >
          <div className="p-2 border-b  border-black"></div>
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b  border-black"></div>
          <div className="p-2 border-b border-r border-black font-bold">
            Grand Total
          </div>
          <div className="p-2 border-b border-r border-black text-right">
            {overallTotals.usd}
          </div>
          <div className="p-2 border-b border-r border-black text-right">
            {overallTotals.inr}
          </div>
          <div className="p-2 border-b border-r border-black text-right">
            {overallTotals.fob}
          </div>
          <div className="p-2 border-b border-r border-black text-right">
            {overallTotals.meis}
          </div>
          <div className="p-2 border-b border-r border-black text-right">
            {overallTotals.drawback}
          </div>
          <div className="p-2 border-b border-black text-right">
            {overallTotals.stax}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SalesAccountReport;
