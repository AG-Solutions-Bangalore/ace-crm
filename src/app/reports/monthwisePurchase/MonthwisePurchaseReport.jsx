import { useLocation } from "react-router-dom";
import Page from "@/app/dashboard/page";
import { useToast } from "@/hooks/use-toast";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";


const MonthwisePurchaseReport = () => {
     const { toast } = useToast();
      const location = useLocation();
        const containerRef = useRef();
      const reportData = location.state?.reportMoPurData;
    
      if (!reportData || !reportData.purchaseProduct) {
        return (
          <Page>
            <p>No data available</p>
          </Page>
        );
      }
    
      const groupedData = reportData.purchaseProduct.reduce((acc, item) => {
        acc[item.branch_name] = acc[item.branch_name] || [];
        acc[item.branch_name].push(item);
        return acc;
      }, {});
      
      const overallTotals = reportData.purchaseProduct.reduce(
        (totals, item) => {
          totals.packing += Number(item.purchase_productSub_packing || 0);
          totals.marking += Number(item.purchase_productSub_marking || 0);
          totals.quantity += Number(item.purchase_productSub_qntyInMt || 0);
          totals.rate += Number(item.purchase_productSub_rateInMt || 0);
          
          return totals;
        },
        { packing: 0, marking: 0, quantity: 0, rate: 0 }
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
  return (
 
     <Page>
          <div className="flex justify-between   items-center p-2 rounded-lg mb-5 bg-gray-200 ">
          <h1 className="text-xl font-bold">Monthwise Purchase Report</h1>
          <button
            className="bg-blue-500 text-white py-1 px-2 rounded"
            onClick={handlPrintPdf}
          >
            Print
          </button>
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
                  " minmax(110px, auto) minmax(90px, auto) minmax(90px, auto) minmax(60px, auto) minmax(100px, auto) minmax(110px, auto) minmax(110px, auto) minmax(70px, auto) minmax(100px, auto) ",
              }}
            >
              {/* Header */}
              {[
              
                "Po No",
                "Po Date",
                "Seller",
                "Delivery Date",
                "Product",
                "Packing",
                "Marking",
                "Qnty in Mt",
                "Rate",
            
              ].map((header, idx) => (
                <div
                  key={idx}
                  className="p-2 font-bold text-center border-b border-r border-t border-black text-gray-900"
                >
                  {header}
                </div>
              ))}
              {/* Data Rows */}
              {invoices.map((item, index) => (
                <React.Fragment key={index}>
                 
                  <div className="p-2 border-b border-r border-black">
                    {item.purchase_product_ref}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.purchase_product_date}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.purchase_product_seller}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.purchase_product_delivery_date}
                  </div>
                  <div className="p-2 border-b border-r border-black">
                    {item.purchase_productSub_name}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.purchase_productSub_packing}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.purchase_productSub_marking}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.purchase_productSub_qntyInMt}
                  </div>
                  <div className="p-2 border-b border-r border-black text-right">
                    {item.purchase_productSub_rateInMt}
                  </div>
                 
                </React.Fragment>
              ))}
              {/* Branch Wise Total */}
             
              <div className="p-2 border-b border-black"></div>
              <div className="p-2 border-b border-black"></div>
              <div className="p-2 border-b  border-black"></div>
              <div className="p-2 border-b  border-black"></div>
              <div className="p-2 border-b border-r border-black font-bold">
                Total
              </div>
              <div className="p-2 border-b border-r border-black text-right">
                {invoices.reduce(
                  (sum, item) => sum + Number(item.purchase_productSub_packing || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
              {invoices.reduce(
                  (sum, item) => sum + Number(item.purchase_productSub_marking || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
              {invoices.reduce(
                  (sum, item) => sum + Number(item.purchase_productSub_qntyInMt || 0),
                  0
                )}
              </div>
              <div className="p-2 border-b border-r border-black text-right">
              {invoices.reduce(
                  (sum, item) => sum + Number(item.purchase_productSub_rateInMt || 0),
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
              " minmax(170px, auto) minmax(90px, auto) minmax(90px, auto) minmax(60px, auto) minmax(100px, auto) minmax(110px, auto) minmax(110px, auto) minmax(70px, auto) minmax(95px, auto)  ",
          }}
        >
       
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b border-black"></div>
          <div className="p-2 border-b  border-black"></div>
          <div className="p-2 border-b border-r border-black font-bold">Grand Total</div>
          <div className="p-2 border-b border-r border-black text-right">{overallTotals.packing}</div>
          <div className="p-2 border-b border-r border-black text-right">{overallTotals.marking}</div>
          <div className="p-2 border-b border-r border-black text-right">{overallTotals.quantity}</div>
          <div className="p-2 border-b border-r border-black text-right">{overallTotals.rate}</div>
          
        </div>
        </div>
      </Page>
 
  )
}

export default MonthwisePurchaseReport