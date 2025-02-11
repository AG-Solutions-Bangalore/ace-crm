import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import BASE_URL from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import moment from "moment";
import { toWords } from "number-to-words";

const WordTest = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const [invoicePackingData, setInvoicePackingData] = useState(null);
  const [branchData, setBranchData] = useState({});
  const [invoiceSubData, setInvoiceSubData] = useState([]);
  const [prouducthsn, setProuductHsn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sumbag, setSumBag] = useState(0);

  // Keep your existing useEffect and other functions...
  // [Previous code for useEffect, handleSaveAsPdf, handleSaveAsWord, etc. remains the same]
  const logoUrl = "/api/public/assets/images/letterHead/AceB.png";
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-invoice-view-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preshipmentData ");
        }

        const data = await response.json();
        setInvoicePackingData(data.invoice);
        setBranchData(data.branch);
        setInvoiceSubData(data.invoiceSub);
        setProuductHsn(data.producthsn);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);
  useEffect(() => {
    if (invoiceSubData.length > 0) {
      const totalBags = invoiceSubData.reduce((sum, item) => {
        return sum + (item.invoiceSub_item_bag || 0);
      }, 0);
      setSumBag(totalBags);
    }
  }, [invoiceSubData]);
  const handleSaveAsPdf = () => {
    const element = containerRef.current;
    generatePdf(element);
  };

  const generatePdf = (element) => {
    const options = {
      margin: [5, 5, 5, 5],
      filename: "Pre_Shipment.pdf",
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
        orientation: "portrait",
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


  const handleSaveAsWord = () => {

    const content = containerRef.current.innerHTML;
    
    
    const styles = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        td { border: 0px solid black; padding: 0px; }
      </style>
    `;
    
   
    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset="utf-8">
          ${styles}
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

   
    const blob = new Blob([html], { type: 'application/msword' });
    

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SpiceBoard_Document.doc';
    
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  if (loading) {
    return (
      <Card className="w-[80vw] h-[80vh] flex items-center justify-center">
        <CardContent>
          <Button disabled className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Pre_Shipment Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button variant="outline">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = invoiceSubData.reduce((total, item) => {
    return total + (item.invoiceSub_qntyInMt * item.invoiceSub_rateMT || 0);
  }, 0);

  const dollars = Math.floor(totalAmount);
  const cents = Math.round((totalAmount - dollars) * 100);
  const totalInWords = `${toWords(dollars).toUpperCase()} DOLLARS AND ${
    cents > 0 ? toWords(cents).toUpperCase() + " CENTS" : "NO CENTS"
  }`;

  return (
    <div>
      <button
        onClick={handleSaveAsWord}
        className="fixed top-5 right-34 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
      >
       Word
       <FileText className="w-4 h-4"/>
      </button>
      <button
        onClick={handleSaveAsPdf}
        className="fixed top-5 right-24 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
      >
        <FileText className="w-4 h-4"/>
      </button>
      <ReactToPrint
        trigger={() => (
          <button className="fixed top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600">
            <Printer className="h-4 w-4" />
          </button>
        )}
        content={() => containerRef.current}
        documentTitle="Preshiment-view"
        pageStyle={`
          @page {
              size: auto;
              margin: 0mm;
          }
          @media print {
              body {
                  margin: 2mm;
                  padding: 2mm;
                  min-height:100vh
              }
              .page-break {
                  page-break-before: always;
              }
          }
      `}
      />

      <div ref={containerRef} className="min-h-screen font-normal">
        <div className="max-w-4xl my-4 mx-auto">
          <h1 className="text-center text-[15px] font-bold">
            PRESHIPMENT CHECKING
          </h1>
        </div>

        {invoicePackingData && (
          <div className="max-w-4xl mx-auto text-[12px]">
            <table className="w-full border-collapse border border-black">
              <tbody>
                {/* Header Section */}
                <tr>
                  <td className="border-r border-b border-black p-1 font-bold w-5/12">
                    ACE EXPORTS
                  </td>
                  <td className="border-r border-b border-black p-1 w-2/12">
                    Inv. No. & Dt:
                  </td>
                  <td className="border-r border-b border-black p-1 w-3/12 font-bold">
                    {invoicePackingData.invoice_ref}
                  </td>
                  <td className="border-b border-black p-1 w-2/12">
                    {moment(invoicePackingData.invoice_date).format("DD-MM-YYY")}
                  </td>
                </tr>

                {/* Address Section */}
                <tr>
                  <td className="border-r border-b border-black p-2 align-top">
                    {invoicePackingData.branch_address}
                  </td>
                  <td colSpan="3" className="border-b border-black p-0">
                    <table className="w-full border-collapse">
                      <tr>
                        <td className="border-b border-r border-black p-1 w-1/4">
                          ORDER TYPE:
                        </td>
                        <td className="border-b border-black p-1 font-bold" colSpan="3">
                          {invoicePackingData.contract_ref} Dt:
                          <span className="ml-2">
                            {moment(invoicePackingData.contract_date).format("DD-MM-YYY")}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 text-center">
                          State Code
                        </td>
                        <td className="border-r border-black p-1 text-center">
                          IEC Code
                        </td>
                        <td className="border-r border-black p-1 text-center">
                          GSTIN
                        </td>
                        <td className="p-1 text-center">
                          HSN Code
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 text-center">
                          {branchData.branch_state_no}
                        </td>
                        <td className="border-r border-black p-1 text-center">
                          {branchData.branch_iec}
                        </td>
                        <td className="border-r border-black p-1 text-center">
                          {branchData.branch_gst}
                        </td>
                        <td className="p-1 text-center">
                          {prouducthsn.product_hsn}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Buyer and Consignee Section */}
                <tr>
                  <td className="border-r border-b border-black p-0">
                    <table className="w-full border-collapse">
                      <tr>
                        <td className="border-b border-black p-1 text-center font-bold" colSpan="2">
                          Buyer
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 w-1/2 text-center">
                          Buyer
                        </td>
                        <td className="p-1 text-center">
                          {invoicePackingData.invoice_buyer}
                          {invoicePackingData.invoice_buyer_add}
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td colSpan="3" className="border-b border-black p-0">
                    <table className="w-full border-collapse">
                      <tr>
                        <td className="border-r border-black p-1 text-center font-bold w-1/2">
                          Consignee
                        </td>
                        <td className="p-1 text-center font-bold">
                          Consignee Bank
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 text-center">
                          {invoicePackingData.invoice_consignee}
                          {invoicePackingData.invoice_consignee_add}
                        </td>
                        <td className="p-1 text-center">
                          {invoicePackingData.invoice_consig_bank}
                          {invoicePackingData.invoice_consig_bank_address}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Product Description */}
                <tr>
                  <td colSpan="4" className="border-b border-black p-1">
                    {invoicePackingData.invoice_product_cust_des}
                  </td>
                </tr>

                {/* Shipping Details */}
                <tr>
                  <td className="border-r border-b border-black p-1 text-center font-bold">
                    Pre-carriage by:
                  </td>
                  <td className="border-r border-b border-black p-1 text-center font-bold">
                    Port of Loading:
                  </td>
                  <td className="border-r border-b border-black p-1 text-center font-bold">
                    Port of Discharge:
                  </td>
                  <td className="border-b border-black p-1 text-center font-bold">
                    Final Destination:
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b border-black p-1 text-center">
                    {invoicePackingData.invoice_precarriage}
                  </td>
                  <td className="border-r border-b border-black p-1 text-center">
                    {invoicePackingData.invoice_loading}, INDIA
                  </td>
                  <td className="border-r border-b border-black p-1 text-center">
                    {invoicePackingData.invoice_discharge}
                  </td>
                  <td className="border-b border-black p-1 text-center">
                    {invoicePackingData.invoice_destination_port}
                  </td>
                </tr>

                {/* Items Table */}
                <tr>
                  <td colSpan="4" className="p-0">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border-r border-b border-black p-2 text-center w-[20%]">
                            Marks & Nos./ Container No.
                          </th>
                          <th className="border-r border-b border-black p-2 text-center w-[12%]">
                            No. / KIND OF
                          </th>
                          <th className="border-r border-b border-black p-2 text-center w-[30%]">
                            DESCRIPTION OF EXPORT GOODS
                            <br />
                            {prouducthsn.product_hs}
                          </th>
                          <th className="border-r border-b border-black p-2 text-center w-[10%]">
                            QUANTITY IN MT
                          </th>
                          <th className="border-r border-b border-black p-2 text-center w-[10%]">
                            RATE PER MT IN USD
                          </th>
                          <th className="border-b border-black p-2 text-center w-[13%]">
                            AMOUNT (USD)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceSubData.map((item, index) => (
                          <tr key={index}>
                            <td className="border-r border-black p-2">
                              {item.invoiceSub_marking}
                            </td>
                            <td className="border-r border-black p-2 text-center">
                              {item.invoiceSub_item_bag}
                              <br />
                              {item.invoiceSub_sbaga}
                            </td>
                            <td className="border-r border-black p-2">
                              {item.invoiceSub_item_name && (
                                <p>{item.invoiceSub_item_name}</p>
                              )}
                              {item.invoiceSub_descriptionofGoods && (
                                <p>{item.invoiceSub_descriptionofGoods}</p>
                              )}
                              {(item.invoiceSub_packing ||
                                item.invoiceSub_sbaga) && (
                                <p>
                                  PACKED {item.invoiceSub_packing} KGS NET IN
                                  EACH {item.invoiceSub_sbaga}
                                </p>
                              )}
                            </td>
                            <td className="border-r border-black p-2 text-center">
                              {item.invoiceSub_qntyInMt}
                            </td>
                            <td className="border-r border-black p-2 text-center">
                              {item.invoiceSub_rateMT}
                            </td>
                            <td className="p-2 text-right">
                              ${(
                                item.invoiceSub_qntyInMt *
                                item.invoiceSub_rateMT
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Totals and Footer */}
                <tr>
                  <td colSpan="4" className="border-t border-black p-2">
                    <table className="w-full">
                      <tr>
                        <td className="p-1">AMOUNT CHARGEABLE IN WORDS -</td>
                      </tr>
                      <tr>
                        <td className="p-1 font-semibold">{totalInWords}</td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          TOTAL NET WEIGHT: {invoiceSubData.reduce(
                            (total, item) =>
                              total + (item.invoiceSub_qntyInMt * 1000 || 0),
                            0
                          )} KGS
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          TOTAL GROSS WEIGHT: {invoiceSubData.reduce(
                            (total, item) =>
                              total +
                              item.invoiceSub_item_bag * item.invoiceSub_bagsize,
                            0
                        )} KGS
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1 border-t border-b border-black">
                          <p className="font-bold">{invoicePackingData.invoice_lut_code}</p>
                          <p className="font-bold">{invoicePackingData.invoice_gr_code}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">
                          <p>Remark: {invoicePackingData.invoice_remarks}</p>
                          <p className="text-right p-6">Checked By</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="page-break"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTest;