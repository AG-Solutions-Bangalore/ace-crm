import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from 'react-to-print';
import { getTodayDate } from "@/utils/currentDate";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
const InvoiceCertificateOrigin = () => {
     const containerRef = useRef();
    
    
     const { id } = useParams();
  const [spiceBoard, setSpiceBoard] = useState(null);
  const [invoiceSubData, setInvoiceSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          throw new Error("Failed to fetch invoice data");
        }

        const data = await response.json();
        setSpiceBoard(data?.invoice);
        setInvoiceSubData(data?.invoiceSub);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);
    
        const handlPrintPdf = useReactToPrint({
            content: () => containerRef.current,
            documentTitle: "apta",
            pageStyle: `
                @page {
                size: auto;
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

          if (loading) {
              return (
                <div className="flex justify-center items-center h-full">
                  <Button disabled>
                    <Loader2 className=" h-4 w-4 animate-spin" />
                    Loading Certificate Origin Data
                  </Button>
                </div>
              );
            }
          
            if (error) {
              return (
                <Card className="w-full max-w-md mx-auto mt-10">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Error Fetching Certificate Origin Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">Try Again</Button>
                  </CardContent>
                </Card>
              );
            }
  return (
    <div>
    <div>
    <button
         onClick={handlPrintPdf}
         className="fixed bottom-20 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
       >
         Print
       </button>
    </div>
  
   <div ref={containerRef} className="max-w-4xl mx-auto p-6 bg-white  ">
     <div className="mb-4 mt-5 ">
       <p className=" text-left text-[13px] ">{spiceBoard?.branch_name}</p>
       <p className=" text-left text-[13px] w-60 ">
       {spiceBoard?.branch_address}
         <br />
       </p>
     </div>
     <div className="mt-14 ">
     <p className=" text-left text-[13px] ">
            {spiceBoard?.invoice_consignee}
          </p>
          <p className="text-left text-[13px] w-60">
            {" "}
            {spiceBoard?.invoice_consignee_add}
          </p>
     </div>
 
     <div className="mt-20 ml-5 flex items-center flex-row  gap-32 ">
       <p className="  text-[13px] ">ROAD</p>
       <p className="  text-[13px] ">{spiceBoard?.invoice_prereceipts}</p>
     </div>
    
     <div className="mt-2 ml-5 flex items-center flex-row  gap-[7.6rem] ">
       <p className="  text-[13px] ">BY SEA</p>
       <p className="   text-[13px] ">{spiceBoard?.invoice_loading}, INDIA</p>
     </div>
     <div className="mt-2 ml-5 flex items-center flex-row  gap-[5.7rem] ">
       <p className="  text-[13px] ">    {spiceBoard?.invoice_destination_port}</p>
       <p className="  text-[13px] ">SINGAPORE</p>
     </div>
     <div className="overflow-x-auto mt-14 ">
       <table className="w-full bg-white  text-[12px] table-fixed">
         <tbody className="divide-y divide-gray-200">
         {invoiceSubData?.map((item,index) => (
           <tr key={item.id}>
           
             <td className=" w-[15%] text-[12px] p-2 text-sm text-gray-900 break-words">
        
               {item.invoiceSub_marking}
             
             </td>
             <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
              
             {item.invoiceSub_item_bag} {item.invoiceSub_sbaga}
            </td>
             <td className=" w-[40%] text-[12px]  p-2 text-sm text-gray-900 break-words">
               {/* {sub.contractSub_descriptionofGoods} */}
               {item.invoiceSub_descriptionofGoods}
                    <br />
                    PACKED {item.invoiceSub_packing} KGS NET IN EACH{" "}
                    {item.invoiceSub_sbaga}
             </td>
          
             <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
              
             {invoiceSubData
                      ?.reduce(
                        (total, currItem) =>
                          total +
                          (parseFloat(currItem?.invoiceSub_qntyInMt) || 0),
                        0
                      )
                      .toFixed(2)}{" "}
MT
             </td>
            
             {index == 0 && (
          <td className="w-[15%] text-[12px] p-2 text-sm text-gray-900 break-words">
            {spiceBoard?.invoice_ref}
            <br />
            DT.{spiceBoard?.invoice_date}<br/>
        
            ${invoiceSubData
    ?.reduce(
      (total, item) =>
        total + (parseFloat(item?.invoiceSub_qntyInMt) || 0) * (parseFloat(item?.invoiceSub_rateMT) || 0),
      0
    )
    .toFixed(2)}
          </td>
        )}
           </tr>
            ))} 
         </tbody>
       </table>
     </div>

     <div className=" mt-80 flex  flex-col items-start gap-10">
       <p className=" text-left text-[13px] ">(IN 1 x 20FT FCL (800BAGS IN 1 x 20FT FCL)
       </p>
       <p className=" text-left text-[13px] ">SINGAPORE</p>
     </div>
     <div className="mt-8  ">
       <p className=" text-left text-[13px] ">BANGALORE</p>
       <p className=" text-left text-[13px] ">04 February 2025</p>
     </div>
    
   </div>
   </div>
  )
}

export default InvoiceCertificateOrigin