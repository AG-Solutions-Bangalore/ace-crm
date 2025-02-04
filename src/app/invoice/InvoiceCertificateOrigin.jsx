import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';

const InvoiceCertificateOrigin = () => {
     const containerRef = useRef();
    
    
    
    
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
       <p className=" text-left text-[13px] ">ACE EXPORTS</p>
       <p className=" text-left text-[13px] ">
         2ND FLOOR, NO.136/4, M.S ARCADE, <br />
         LALBAGH MAIN ROAD, NEAR SWAGATH <br />
         POORNIMA THEATER, BENGALURU, <br />
         KARNATAKA INDIA PIN: 560027
         <br />
       </p>
     </div>
     <div className="mt-14 ">
       <p className=" text-left text-[13px] ">
         HONG GUAN MARINE PRODUCTS PTE LTD <br />
         BLOCK 16, WHOLESALE CENTRE, # 01-98 <br />
         SINGAPORE. <br />
       </p>
     </div>
 
     <div className="mt-20 ml-5 flex items-center flex-row  gap-32 ">
       <p className="  text-[13px] ">ROAD</p>
       <p className="  text-[13px] ">BANGALORE</p>
     </div>
    
     <div className="mt-2 ml-5 flex items-center flex-row  gap-[7.6rem] ">
       <p className="  text-[13px] ">BY SEA</p>
       <p className="   text-[13px] ">CHENNAI, INDIA</p>
     </div>
     <div className="mt-2 ml-5 flex items-center flex-row  gap-[5.7rem] ">
       <p className="  text-[13px] ">SINGAPORE</p>
       <p className="  text-[13px] ">SINGAPORE</p>
     </div>
     <div className="overflow-x-auto mt-14 ">
       <table className="w-full bg-white  text-[12px] table-fixed">
         <tbody className="divide-y divide-gray-200">
           {/* {contractData.contractSub.map((sub) => ( */}
           <tr>
           
             <td className=" w-[15%] text-[12px] p-2 text-sm text-gray-900 break-words">
               {/* {sub.contractSub_marking} */}
               HGMPL ,Best, ,AAA, 25 KGS
             
             </td>
             <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
              
              800 JUTE BAGS
            </td>
             <td className=" w-[40%] text-[12px]  p-2 text-sm text-gray-900 break-words">
               {/* {sub.contractSub_descriptionofGoods} */}
               INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
               <br />
               PACKED 25 KGS NET IN EACH JUTE BAGS
             </td>
          
             <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
              
               20.000
MT
             </td>
             <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
               AE202425 2138 <br />
               02-12-2024 <br/>
               $ 26,400.00
             </td>
           </tr>
           {/* ))} */}
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