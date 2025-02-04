import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceGst = () => {
    const containerRef = useRef();
    
    
    
    
        const handlPrintPdf = useReactToPrint({
            content: () => containerRef.current,
            documentTitle: "invoice_gst",
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
    <div>
        <div>
     <button
          onClick={handlPrintPdf}
          className="fixed bottom-20 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Print
        </button>
     </div>
      <div ref={containerRef}>
      <p className="text-center font-bold">TAX INVOICE</p>
      <div className="mx-auto text-xs   max-h-screen  border border-black">
        {/* main content  */}
        <div className="grid grid-cols-4 h-[20rem]">
          <div className=" col-span-1 ">
            <div className="grid grid-rows-5 h-[20rem]">
              <div className=" border-r border-b border-black row-span-2 p-1 flex flex-col gap-1 ">
                <p className="text-[10px]">
                  a)Name and address of GSTIN of the supplier :
                </p>
                <p className="font-bold">ACE EXPORTS</p>
                <p>
                  2ND FLOOR, NO.136/4, M.S ARCADE, LALBAGH
                  <br />
                  MAIN ROAD, NEAR SWAGATH POORNIMA
                  <br />
                  THEATER, BENGALURU, KARNATAKA INDIA PIN:
                  <br />
                  560027
                </p>
              </div>
              <div className=" border-b border-r border-black row-span-2 flex flex-col gap-1 p-1">
                <p className="text-[10px]">
                  d) Name, address and GSTIN of the Receipient:
                </p>

                <p>
                  HONG GUAN MARINE PRODUCTS PTE LTD
                  <br />
                  BLOCK 16, WHOLESALE CENTRE, # 01-98
                  <br />
                  SINGAPORE
                </p>
              </div>
              <div className=" border-r border-black row-span-1 flex flex-row  justify-between p-1">
                <p className="text-[10px]">
                  m) Place of Supply with name of State :
                </p>
                <p>BANGALORE</p>
              </div>
            </div>
          </div>
          <div className=" col-span-3 ">
            <div className="grid grid-rows-5 h-[20rem]">
              <div className=" border-b border-black row-span-2 grid grid-cols-1">
                <div className=" border-b border-black flex  items-center justify-between">
                  <p className="ml-2 flex items-center gap-8">
                    <span>b) Inv. No. :</span> <strong>AE2024252138</strong>
                  </p>
                  <p className=" mr-24 flex items-center gap-8">
                    <span>c) Date of Issue :</span> <strong>02-12-2024</strong>
                  </p>
                </div>
                <div className="border-b border-black  font-bold flex items-center justify-between w-full ">
                  <div className="flex items-center  w-[60%]  justify-start gap-20 ml-5  ">
                    <p className="flex flex-col items-center">
                      <span>State Code</span> <span>29</span>
                    </p>

                    <p className="flex flex-col items-center">
                      <span>IEC Code</span> <span>0702011525</span>
                    </p>
                    <p className="flex flex-col items-center">
                      <span>HSN Code</span> <span>1202</span>
                    </p>
                  </div>
                  <p className="text-sm w-[40%]">GSTIN : 29AAHFA7085Q1ZL</p>
                </div>
                <div className=" flex w-full">
                  <p className="border-r border-black w-[40%] flex items-center p-1 pl-2">
                    o) Whether the Tax is payable on reverse charge basis : NIL
                  </p>
                  <p className="w-[60%] flex gap-4 p-1">
                    <span>Payemnt Terms :</span>
                    <span className="mt-1">
                      100% TT TRANSFER WITHIN 7-10 DAYS FROM RECEIPT OF CARGO
                    </span>
                  </p>
                </div>
              </div>
              <div className=" border-b relative  border-black row-span-2 grid grid-cols-5 ">
                <div className=" col-span-3 p-1 border-r border-black">
                  <p className="text-[10px]">
                    i) Name and address of the Receipient /Consignee :
                  </p>

                  <p className="mt-2">
                    HONG GUAN MARINE PRODUCTS PTE LTD
                    <br />
                    BLOCK 16, WHOLESALE CENTRE, # 01-98
                    <br />
                    SINGAPORE.
                  </p>
                  <p className="flex  gap-5 absolute bottom-1 ml-2 ">
                    <span>Name of the Country of Destination : </span>
                    <span>SINGAPORE</span>
                  </p>
                </div>
                <div className=" col-span-2 p-1">
                  <p>Place of delivery in INDIA</p>
                  <p>
                    Nifco Seafreight Pvt. Ltd.
                    <br />
                    (Clearing House Agent)
                    <br />
                    111, CCBF ROAD,
                    <br />
                    ALMATHI, PALPANNA
                    <br />
                    Chennai - 600052 <br />
                    GSTIN : 33AAACN3536H1ZR
                  </p>
                </div>
              </div>
              <div className="  row-span-1 grid grid-cols-5">
                <div className=" col-span-3   p-1 border-r border-black">
                  <p className="p-1 text-[10px]">
                    n) Address of delivery where the same is different from
                    place of supply :
                  </p>
                  <p className="text-center mt-2">CHENNAI, INDIA</p>
                </div>
                <div className=" col-span-2 p-1 ">
                  <p className="flex gap-5 mt-2">
                    <span>Exchange Rate (RBI Reference Rate) :</span>
                    <span>INR</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table  */}
        <div className="border text-[11px] border-black h-[10rem]">
          <div className="">
            <div
              className="grid bg-white"
              style={{
                gridTemplateColumns:
                  "minmax(30px, auto) minmax(200px, auto) minmax(90px, auto) minmax(60px, auto) minmax(100px, auto) minmax(110px, auto) minmax(110px, auto) minmax(70px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto)",
              }}
            >
              {/* Header */}
              <div className="p-2 border-b font-bold border-r border-black text-gray-900">
                S. No.
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                g) Description of goods or Services
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                h) Qty of Goods ( in Bags )
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                Unit (in MT)
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                Rate/Unit (in USD)
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                Total value of supply of Goods (in USD)
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                Total value of supply of Goods (in INR)
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                Discount
              </div>
              <div className="p-2 font-bold border-b border-r border-black text-gray-900">
                J) Taxa. value of Goods (in INR )
              </div>

              {/* CGST Column */}
              <div className="border-r border-black">
                <div className="p-2 font-bold text-center border-b border-black text-gray-900">
                  CGST
                </div>
                <div className="grid grid-cols-2">
                  <div className=" text-[9px] font-bold text-center border-r border-b border-black text-gray-900">
                    K) Rate
                  </div>
                  <div className=" text-[9px] font-bold text-center border-b border-black text-gray-900">
                    I) Amount of Tax
                  </div>
                </div>
              </div>

              {/* SGST Column */}
              <div className="border-r border-black">
                <div className="p-2 font-bold text-center border-b border-black text-gray-900">
                  SGST
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-[9px] font-bold text-center border-r border-b border-black text-gray-900">
                    K) Rate
                  </div>
                  <div className="text-[9px] font-bold text-center border-b border-black text-gray-900">
                    I) Amount of Tax
                  </div>
                </div>
              </div>

              {/* IGST Column */}
              <div>
                <div className="p-2 font-bold text-center border-b border-black text-gray-900">
                  IGST
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-[9px] font-bold text-center border-r border-b border-black text-gray-900">
                    K) Rate
                  </div>
                  <div className="text-[9px] font-bold text-center border-b border-black text-gray-900">
                    I) Amount of Tax
                  </div>
                </div>
              </div>

              {/* Row Data */}
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                1
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                <strong>HS Code : 12024210</strong>
                <br />
                INDIAN GROUNDNUTS 80/90 <br />
                (SOUTH NEW CROP)
                <br />
                PACKED 25 KGS NET IN EACH JUTE BAGS
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                800 JUTE BAGS
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                20.000 MT
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                $ 1,320.00
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                26400.00
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                0.00
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                0
              </div>
              <div className="p-2 border-b border-r border-black text-gray-900 break-words">
                0.00
              </div>

              {/* CGST Data */}
              <div className="grid grid-cols-2 border-r border-b border-black">
                <div className="p-2 text-gray-900 break-words border-r border-black">
                  0
                </div>
                <div className="p-2 text-gray-900 break-words">0</div>
              </div>

              {/* SGST Data */}
              <div className="grid grid-cols-2 border-r border-b border-black">
                <div className="p-2 text-gray-900 break-words border-r border-black">
                  0
                </div>
                <div className="p-2 text-gray-900 break-words">0</div>
              </div>

              {/* IGST Data */}
              <div className="grid grid-cols-2  border-b border-black">
                <div className="p-2 text-gray-900 break-words border-r border-black">
                  5%
                </div>
                <div className="p-2 text-gray-900 break-words">0</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[11px] flex flex-row w-full h-[13rem] ">
          <div className=" w-[60%]  p-1">
            <p>Endorsment :</p>
            <p className="font-bold">
              SUPPLY MEANT FOR EXPORT ON PAYMENT OF IGST 5%
            </p>
            <p className="mt-2 font-bold">
              (INSURANCE : EXPORTER WAREHOUSE TO BUYER/CONSIGHNEE WAREHOUSE)
            </p>
         <div className="flex flex-col gap-1">
         <p className="flex justify-between">
              <span className="w-[25%]">Vehicle No.</span>
              <span>:</span>
              <span className="w-[75%] pl-5"></span>
            </p>
            <p className="flex justify-between">
              <span className="w-[25%]">Freight Amount</span>
              <span>:</span>
              <span className="w-[75%] pl-5"></span>
            </p>
            <p className="flex justify-between">
              <span className="w-[25%]">Advance Paid</span>
              <span>:</span>
              <span className="w-[75%] pl-5"></span>
            </p>
            <p className="flex justify-between">
              <span className="w-[25%]">Balance to pay</span>
              <span>:</span>
              <span className="w-[75%] pl-5"></span>
            </p>
            <p className="flex justify-between">
              <span className="w-[25%]">Date and Time of Dispatch</span>
              <span>:</span>
              <span className="w-[75%] pl-5"></span>
            </p>
            <p className="flex justify-between">
              <span className="w-[25%]">Invoice Value (INR IN WORDS)</span>
              <span>:</span>
              <span className="w-[75%] pl-5">No Rupees Only .....</span>
            </p>
         </div>
          </div>










          
          <div className=" w-[40%] grid grid-rows-2 ">
            <div className=" flex flex-col  gap-1">
            <p className=" text-[13px] flex items-center justify-end gap-2 mt-1">
              <span >Total Invoice Amount before Tax</span>
              <span>:</span>
              <span className="w-14 text-end pr-1" >0.00</span>
            </p>
            <p className="text-[13px] flex items-center justify-end gap-2">
              <span >ADD - CGST</span>
              <span>:</span>
              <span className="w-14 text-end pr-1" >0.00</span>
            </p>
            <p className="text-[13px] flex items-center justify-end gap-2">
              <span >ADD - SGST</span>
              <span>:</span>
              <span className="w-14 text-end pr-1">0.00</span>
            </p>
            <p className="text-[13px] flex items-center justify-end gap-2" >
              <span >ADD - IGST</span>
              <span>:</span>
              <span className="w-14 text-end pr-1">0.00</span>
            </p>
            <p className="text-[13px] flex items-center justify-end gap-2" >
              <span className="font-bold">Total Amount after Tax</span>
              <span>:</span>
              <span className="w-14 text-end pr-1">0.00</span>
            </p>
           
            </div>
            <div className=" border-t border-l relative border-black">
               <p className="p-1 ml-2  font-bold">
               Certified that the particulars given above are true and acorrect.
               </p>
               <div className=" absolute bottom-0 flex flex-row   items-center ">
               <p className="border-t border-r border-black p-[2px] w-56  ">p)Signature of the Supplier : </p>
               <p className="border-t border-r border-black p-[2px] w-20 text-center ">02-12-2024</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default InvoiceGst;
// ss
