import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceApta = () => {
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
      <div className="mt-14 ">
        <p className=" text-left text-[13px] ">
          BANGALORE To CHENNAI, INDIA BY ROAD <br />
          CHENNAI, INDIA To SINGAPORE / SINGAPORE BY SEA
        </p>
      </div>
      <div className="overflow-x-auto mt-14 ">
        <table className="w-full bg-white  text-[12px] table-fixed">
          <tbody className="divide-y divide-gray-200">
            {/* {contractData.contractSub.map((sub) => ( */}
            <tr>
              <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
                {/* {sub.contractSub_marking} */}
                09042110
              </td>
              <td className=" w-[15%] text-[12px] p-2 text-sm text-gray-900 break-words">
                {/* {sub.contractSub_marking} */}
                HGMPL ,Best, ,AAA, 25 KGS
                <br />
                800 JUTE BAGS{/*  2nd col */}
              </td>
              <td className=" w-[30%] text-[12px]  p-2 text-sm text-gray-900 break-words">
                {/* {sub.contractSub_descriptionofGoods} */}
                INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                <br />
                PACKED 25 KGS NET IN EACH JUTE BAGS
              </td>
              <td className=" w-[10%] text-[12px]  p-2 text-sm text-gray-900 break-words">
                A
              </td>
              <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
                Gross Weight
                <br />
                20160 KGS
              </td>
              <td className=" w-[15%] text-[12px]  p-2 text-sm text-gray-900 break-words">
                AE202425 2138 <br />
                DT.02-Dec-24
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>

      <div className=" mt-80 flex  flex-col items-start gap-10">
        <p className=" text-left text-[13px] ">INDIA</p>
        <p className=" text-left text-[13px] ">SINGAPORE</p>
      </div>
      <div className="mt-8  ">
        <p className=" text-left text-[13px] ">BANGALORE</p>
        <p className=" text-left text-[13px] ">03-Feb-25</p>
      </div>
      <div className="mt-16  ">
        <p className=" text-center text-[13px] ">(ANIL KUMAR JAIN)
        </p>
     
      </div>
      <div className="mt-48 break-before-page">
        <p className=" text-left text-[13px] ">
          AS SHOWN IN COLUMN NO. 1. GOODS NOT YET SHIPPED
        </p>
      </div>
      <div className="mt-24 ">
        <p className=" text-left text-[13px] ">
          GOODS WHOLLY OBTAINED IN INDIA. NO IMPORTED MATERIALS USED
        </p>
      </div>
      <div className="mt-16  ">
        <p className=" text-left text-[13px] ">
          INVOICE NO. 03-Feb-25 AE2024252138 Dtd. : 02-12-2024
        </p>
        <p className=" text-left text-[13px] ">CIF VALUE IN USD $ 26,400.00</p>
        <p className=" text-left text-[13px] ">REG. NO. 151015</p>
      </div>
      <div className="mt-16  flex flex-col items-end mr-20  gap-10 ">
        <p className=" pr-20  text-[13px] ">
        (ANIL KUMAR JAIN)
        </p>
        <p className="  text-[13px] ">BANGALORE DTD.
INVOICE NO.
03-Feb-25</p>
       
      </div>
    </div>
    </div>
  );
};

export default InvoiceApta;
