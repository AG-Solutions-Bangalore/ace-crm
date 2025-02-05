import React, { useEffect, useRef, useState } from "react";
import Page from "../../app/dashboard/page";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import ReactToPrint from "react-to-print";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import moment from "moment";
import BASE_URL from "@/config/BaseUrl";
const PaymentView = () => {
  const [viewData, setViewData] = useState([]);
  const [invoice, setInvoice] = useState({});

  const containerRef = useRef();
  const { id } = useParams();

  console.log(id);
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-invoice-payment-by-invoiceno/${id}`,
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
        setInvoice(data.invoice);
      } catch (error) {
        console.log(error);
        console.log("erro catch");
      }
    };

    fetchContractData();
  }, [id]);
  const handleSaveAsPdf = () => {
    const element = containerRef.current;
    generatePdf(element);
  };

  const generatePdf = (element) => {
    const options = {
      margin: [15, 5, 5, 5],
      filename: "Payment.pdf",
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

  return (
    <Page>
      <button
        onClick={handleSaveAsPdf}
        className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Save as PDF
      </button>
      <ReactToPrint
        trigger={() => (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            <Printer className="h-4 w-4" />
          </Button>
        )}
        content={() => containerRef.current}
        documentTitle={`Payment-view`}
        pageStyle={`
                            @page {
                                size: auto;
                                margin: 0mm;
                            }
                            @media print {
                                body {
                                //  border: 1px solid #000;
                                    margin: 1mm;
                                     padding: 1mm;
                                  
                                     min-height:100vh
                                }
                            
                            }
                        `}
      />

      <div ref={containerRef} className="min-h-screen font-normal ">
        <div className="max-w-4xl mx-auto p-4  text-[12px]">
          {/* //first */}
          <div className="max-w-4xl mx-auto px-4 pt-4 grid grid-cols-12 gap-4">
            <div className="col-span-7  p-4">
              <p className="mb-1">The Manager</p>
              <p className="mb-1">Bank of India</p>
              <p className="mb-1">Foreign Department</p>
              <p className="mb-1">Bangalore Main Branch</p>
              <p className="mb-1">K.G.Road</p>
              <p className="mb-1">Bangalore - 560009</p>
              <p className="mt-6"> Dear sir ,</p>
            </div>

            <div className="col-span-5 flex items-center justify-center  p-4  ">
              Date:{moment().format("DD-MM-YYYY")}
            </div>
          </div>
          {/* //second */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="px-4 py-2">
              <p>
                {" "}
                Sub : Clousure of GR vide FIRC mentioned below and issue of
                BRC's
              </p>{" "}
              <p className="ml-12">
                Kindly adjust the following TT remittance receive against our
                Export
              </p>
              <p className="ml-12">Bill Raised on {invoice.invoice_buyer}</p>
            </div>
          </div>
          {/* //thord */}
          <div className="max-w-4xl mx-auto px-4 ">
            <div className="col-span-12 grid grid-cols-4 gap-4 mt-4 px-4 py-2">
              <div className="col-span-2  ">IRTT No: 12345</div>
              <div className="col-span-1  ">Date: 08-Nov-21</div>
              <div className="col-span-1  ">Value: $30,616.95</div>
            </div>
          </div>
          {/* //four table */}
          <div className="col-span-12 mt-6 max-w-4xl mx-auto px-4 pb-4">
            <table className="min-w-full text-center">
              <thead className="text-[12px]">
                <tr>
                  <th className="border border-black p-2 w-[7%]">Sl No</th>
                  <th className="border border-black p-2 w-[30%]">
                    INV No & SB No
                  </th>
                  <th className="border border-black p-2 w-[12%]">
                    INV Value (USD)
                  </th>
                  <th className="border border-black p-2 w-[12%]">
                    Adjusted Value (USD)
                  </th>
                  <th className="border border-black p-2 w-[12%]">
                    Discount / Balance
                  </th>
                  <th className="border border-black p-2 w-[26%]">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {viewData && viewData.length > 0 ? (
                  viewData.map((pending, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2">
                        {pending.invoice_no}
                      </td>
                      <td className="border border-black p-2">
                        {pending.invoice_id}
                      </td>
                      <td className="border border-black p-2">
                        {pending.amount}
                      </td>
                      <td className="border border-black p-2">
                        {pending.received}
                      </td>
                      <td className="border border-black p-2">
                        {pending.balance}
                      </td>
                      <td className="border border-black p-2">
                        {pending.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-black p-2 text-center"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    className="border border-black p-2 text-center"
                    colSpan="3"
                  >
                    Total
                  </td>
                  <td className="border border-black p-2 text-center">
                    99228.28
                  </td>
                  <td className="border border-black p-2 text-center">
                    $ 1,102.02
                  </td>

                  <td className="border border-black p-2 text-center"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <div className="px-4 py-2">
              <p className="py-2">
                {" "}
                Kindly close the GR and issue BRC at the earliest.
              </p>{" "}
              <p className="py-2">Thanking You,</p>
              <p className="py-2">Yours Truly</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default PaymentView;
