import React, { useRef } from "react";
import Page from "../dashboard/page";

import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
// import logo from "../../../public/assets/AceB.png"
const ViewContract = () => {
  const containerRef = useRef();
  const handleSaveAsPdf = () => {
    const element = containerRef.current;
    const images = element.getElementsByTagName("img");
    let loadedImages = 0;
    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generatePdf(element);
          }
        };
      }
    });
    if (loadedImages === images.length) {
      generatePdf(element);
    }
  };

  const generatePdf = (element) => {
    const options = {
      margin: 1,
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };
  return (
    <Page>
      <button
        onClick={handleSaveAsPdf}
        className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Save as PDF
      </button>
     
      <div
        ref={containerRef}
        className="p-1 bg-gray-100 min-h-screen  font-mono "
      >
        <div className="max-w-4xl mx-auto bg-white shadow-md print:shadow-none print:rounded-none rounded-lg p-6">
          <div className="mb-4  ">
            <img
              src="/api/public/assets/images/letterHead/AceB.png"
              alt="logo"
              className="w-full"
            />
          </div>
          <h1 className="text-center text-xl underline font-bold mb-6">
            SALES CONTRACT
          </h1>

          <div className="flex items-center justify-between">
            <p>
              <span className="font-semibold">Cont No.:</span>
              AE/HGMPL/2138/202425
            </p>
            <p>
              <span className="font-semibold">DATE:</span> 27-11-2024
            </p>
          </div>
          <div className="border-t border-gray-300 pt-4 mb-6">
            <h2 className="font-bold">Buyer:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Container */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Container</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">25 KGS NET IN, 800 JUTE BAGS</p>
            </div>

            {/* Specification */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Specification (If Any)</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL
              </p>
            </div>

            {/* Terms of Payment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                100% TT TRANSFER WITHIN 7-10 DAYS FROM RECEIPT OF CARGO
              </p>
            </div>

            {/* Shipper's Bank */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">SHIPPER'S BANK</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className=" pt-4 mb-6">
            <h2 className="font-bold">CONSIGNEE:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Shipment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Shipment</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Part of Loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>

            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>
          </div>

          <div className="border-b w-fit text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-4">
            <p>In Case of Shipment via Direct Vessel by Hyundai Liners:</p>
          </div>

          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Port Of loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>
            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>

            {/* Special Remarks */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Special Remarks</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Documents */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Documents</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className="border-b w-fit mt-5 text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-1">
            <p>Kindly Mail your Purchase Order at the earliest.</p>
          </div>

          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <p>Thanks & regards,</p>
            <div className="flex items-center justify-between">
              <p>For ACE EXPORTS (Seller)</p>
              <p className=" mr-[22%]">(Buyer)</p>
            </div>
          </div>
          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <div className="flex justify-between mt-10">
              <div className=" flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Roy D'Souza</p>
                <p>HP : 0091 - 9844072637</p>
              </div>
              <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Accepted with Co Seal </p>
                <p>15-01-2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ViewContract;


// isme logo aayega aur acchi tarah se pdf convert hoga till time 2:25 and date : 22/1/2025



// ye waal header mein aa raha logo on each and every page  but with local logo

import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";

import html2pdf from "html2pdf.js";
import logo from "../../../public/assets/AceB.png"
const ViewContract = () => {
  const containerRef = useRef();
  
  const [logoBase64, setLogoBase64] = useState('');
 
   // Convert image to base64 on component mount
   useEffect(() => {
     const convertImageToBase64 = async () => {
       try {
         const img = new Image();
         img.crossOrigin = "anonymous";
         img.src = logo;
         
         img.onload = () => {
           const canvas = document.createElement('canvas');
           canvas.width = img.width;
           canvas.height = img.height;
           
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0);
           
           const base64String = canvas.toDataURL('image/jpeg');
           setLogoBase64(base64String);
         };
       } catch (error) {
         console.error("Error converting image to base64:", error);
       }
     };
 
     convertImageToBase64();
   }, []);
 
   const handleSaveAsPdf = () => {
     const element = containerRef.current;
     const images = element.getElementsByTagName("img");
     let loadedImages = 0;
     
     if (images.length === 0) {
       generatePdf(element);
       return;
     }
 
     Array.from(images).forEach((img) => {
       if (img.complete) {
         loadedImages++;
         if (loadedImages === images.length) {
           generatePdf(element);
         }
       } else {
         img.onload = () => {
           loadedImages++;
           if (loadedImages === images.length) {
             generatePdf(element);
           }
         };
       }
     });
   };
 
   const generatePdf = (element) => {
     if (!logoBase64) {
       console.error("Logo not yet converted to base64");
       return;
     }
 
     const options = {
       margin: [70, 10, 10, 10],
       filename: "Sales_Contract.pdf",
       image: { type: "jpeg", quality: 0.98 },
       html2canvas: { 
         scale: 2, 
         useCORS: true,
         windowHeight: element.scrollHeight
       },
       jsPDF: { 
         unit: "mm", 
         format: "a4", 
         orientation: "portrait"
       },
       pagebreak: { mode: 'avoid-all' },
       header: {
         height: "50mm",
         contents: {
           default: `
             <div style="text-align: center; width: 100%;">
               <img src="${logoBase64}" alt="logo" style="max-width: 100%; height: auto; margin: 0 auto;" />
             </div>
           `
         }
       }
     };
 
     html2pdf()
       .from(element)
       .set(options)
       .toPdf()
       .get('pdf')
       .then((pdf) => {
         const totalPages = pdf.internal.getNumberOfPages();
         
         for (let i = 1; i <= totalPages; i++) {
           pdf.setPage(i);
           // Convert the base64 string to PDF-compatible format
           const imgData = logoBase64.split(',')[1];
           pdf.addImage(imgData, 'JPEG', 10, 10, 190, 30);
         }
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
     
      <div
        ref={containerRef}
        className="p-1 bg-gray-100 min-h-screen  font-mono "
      >
        <div className="max-w-4xl mx-auto bg-white shadow-md print:shadow-none print:rounded-none rounded-lg p-6">
          {/* <div className="mb-4  ">
            <img
              src={logo}
              alt="logo"
              className="w-full"
            />
          </div> */}
          <h1 className="text-center text-xl underline font-bold mb-6">
            SALES CONTRACT
          </h1>

          <div className="flex items-center justify-between">
            <p>
              <span className="font-semibold">Cont No.:</span>
              AE/HGMPL/2138/202425
            </p>
            <p>
              <span className="font-semibold">DATE:</span> 27-11-2024
            </p>
          </div>
          <div className="border-t border-gray-300 pt-4 mb-6">
            <h2 className="font-bold">Buyer:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Container */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Container</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">25 KGS NET IN, 800 JUTE BAGS</p>
            </div>

            {/* Specification */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Specification (If Any)</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL
              </p>
            </div>

            {/* Terms of Payment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                100% TT TRANSFER WITHIN 7-10 DAYS FROM RECEIPT OF CARGO
              </p>
            </div>

            {/* Shipper's Bank */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">SHIPPER'S BANK</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className=" pt-4 mb-6">
            <h2 className="font-bold">CONSIGNEE:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Shipment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Shipment</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Part of Loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>

            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>
          </div>

          <div className="border-b w-fit text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-4">
            <p>In Case of Shipment via Direct Vessel by Hyundai Liners:</p>
          </div>

          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Port Of loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>
            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>

            {/* Special Remarks */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Special Remarks</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Documents */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Documents</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className="border-b w-fit mt-5 text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-1">
            <p>Kindly Mail your Purchase Order at the earliest.</p>
          </div>

          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <p>Thanks & regards,</p>
            <div className="flex items-center justify-between">
              <p>For ACE EXPORTS (Seller)</p>
              <p className=" mr-[22%]">(Buyer)</p>
            </div>
          </div>
          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <div className="flex justify-between mt-10">
              <div className=" flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Roy D'Souza</p>
                <p>HP : 0091 - 9844072637</p>
              </div>
              <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Accepted with Co Seal </p>
                <p>15-01-2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ViewContract;


// ye waal header mein aa raha logo on each and every page  but with api 


import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";

import html2pdf from "html2pdf.js";
import logo from "../../../public/assets/AceB.png";
const ViewContract = () => {
  const containerRef = useRef();

  const [logoBase64, setLogoBase64] = useState("");
  const logoUrl = "/api/public/assets/images/letterHead/AceB.png";

  // Convert image to base64 on component mount
  useEffect(() => {
    const fetchAndConvertImage = async () => {
      try {
        // Fetch the image from the API endpoint
        const response = await fetch(logoUrl);
        const blob = await response.blob();

        // Create a FileReader to convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching and converting image:", error);
      }
    };

    fetchAndConvertImage();
  }, []);

  const handleSaveAsPdf = () => {
    if (!logoBase64) {
      console.error("Logo not yet loaded");
      return;
    }
    const element = containerRef.current;
    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generatePdf(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generatePdf(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generatePdf(element);
          }
        };
      }
    });
  };

  const generatePdf = (element) => {
    if (!logoBase64) {
      console.error("Logo not yet converted to base64");
      return;
    }

    const options = {

      margin: [40, 5, 5, 5],  // top , left , bottom , right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
      header: {
        height: "50mm",
        contents: {
          default: `
             <div style="text-align: center; width: 100%; backgroundColor:"red">
               <img src="${logoBase64}" alt="logo" style="max-width: 100%; height: auto; margin: 0 auto;" />
             </div>
           `,
        },
      },
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          // Convert the base64 string to PDF-compatible format
          const imgData = logoBase64.split(",")[1];
          pdf.addImage(imgData, "JPEG", 10, 10, 190, 30);
        }
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

      <div
        ref={containerRef}
        className=" bg-gray-100 min-h-screen  font-mono "
      >
        <div className="max-w-4xl mx-auto bg-white  p-6">
          <h1 className="text-center text-xl underline font-bold mb-6">
            SALES CONTRACT
          </h1>

          <div className="flex items-center justify-between">
            <p>
              <span className="font-semibold">Cont No.:</span>
              AE/HGMPL/2138/202425
            </p>
            <p>
              <span className="font-semibold">DATE:</span> 27-11-2024
            </p>
          </div>
          <div className="border-t border-gray-300 pt-4 mb-6">
            <h2 className="font-bold">Buyer:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Container */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Container</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">25 KGS NET IN, 800 JUTE BAGS</p>
            </div>

            {/* Specification */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Specification (If Any)</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL
              </p>
            </div>

            {/* Terms of Payment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                100% TT TRANSFER WITHIN 7-10 DAYS FROM RECEIPT OF CARGO
              </p>
            </div>

            {/* Shipper's Bank */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">SHIPPER'S BANK</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className=" pt-4 mb-6">
            <h2 className="font-bold">CONSIGNEE:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Shipment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Shipment</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Part of Loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>

            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>
          </div>

          <div className="border-b w-fit text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-4">
            <p>In Case of Shipment via Direct Vessel by Hyundai Liners:</p>
          </div>

          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Port Of loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>
            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>

            {/* Special Remarks */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Special Remarks</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Documents */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Documents</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className="border-b w-fit mt-5 text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-1">
            <p>Kindly Mail your Purchase Order at the earliest.</p>
          </div>

          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <p>Thanks & regards,</p>
            <div className="flex items-center justify-between">
              <p>For ACE EXPORTS (Seller)</p>
              <p className=" mr-[22%]">(Buyer)</p>
            </div>
          </div>
          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <div className="flex justify-between mt-10">
              <div className=" flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Roy D'Souza</p>
                <p>HP : 0091 - 9844072637</p>
              </div>
              <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Accepted with Co Seal </p>
                <p>15-01-2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ViewContract;


// isme htm2pdf mein change hai logo ko full width diya gua hai 

"import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";

import html2pdf from "html2pdf.js";
import logo from "../../../public/assets/AceB.png";
const ViewContract = () => {
  const containerRef = useRef();

  const [logoBase64, setLogoBase64] = useState("");
  const logoUrl = "/api/public/assets/images/letterHead/AceB.png";

  useEffect(() => {
    const fetchAndConvertImage = async () => {
      try {
        // Fetch the image from the API endpoint
        const response = await fetch(logoUrl);
        const blob = await response.blob();

        // Create a FileReader to convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching and converting image:", error);
      }
    };

    fetchAndConvertImage();
  }, []);

  const handleSaveAsPdf = () => {
    if (!logoBase64) {
      console.error("Logo not yet loaded");
      return;
    }
    const element = containerRef.current;
    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generatePdf(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generatePdf(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generatePdf(element);
          }
        };
      }
    });
  };

  const generatePdf = (element) => {
    if (!logoBase64) {
      console.error("Logo not yet converted to base64");
      return;
    }

    const options = {
      margin: [40, 0, 5, 0], // top , left , bottom , right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
      header: {
        height: "50mm",
        contents: {
          default: `
             <div style="text-align: center; width: 100%; backgroundColor:"red">
               <img src="${logoBase64}" alt="logo" style="max-width: 100%; height: auto; margin: 0 auto;" />
             </div>
           `,
        },
      },
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          const imgData = logoBase64.split(",")[1];
          pdf.addImage(imgData, "JPEG", 0, 10, pageWidth, 30);
        }
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
      <div className="max-w-4xl mx-auto   ">
        <img
          src="/api/public/assets/images/letterHead/AceB.png"
          alt="logo"
          className="w-full"
        />
      </div>
      <div ref={containerRef} className="   min-h-screen  font-mono ">
        <div className="max-w-4xl mx-auto bg-white  p-6">
          <h1 className="text-center text-xl underline font-bold mb-6">
            SALES CONTRACT
          </h1>

          <div className="flex items-center justify-between">
            <p>
              <span className="font-semibold">Cont No.:</span>
              AE/HGMPL/2138/202425
            </p>
            <p>
              <span className="font-semibold">DATE:</span> 27-11-2024
            </p>
          </div>
          <div className="border-t border-gray-300 pt-4 mb-6">
            <h2 className="font-bold">Buyer:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 table-fixed">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
                <tr>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    HGMPL ,Best, ,AAA, 25 KGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP)
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    25KG NET IN, 800 JUTE BAGS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    20 MTRS
                  </td>
                  <td className="border w-[20%] border-black p-2 text-sm text-gray-900 break-words">
                    1320 USD/MTS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Container */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Container</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">25 KGS NET IN, 800 JUTE BAGS</p>
            </div>

            {/* Specification */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Specification (If Any)</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x
                20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT
                FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL1
                x 20FT FCL1 x 20FT FCL1 x 20FT FCL1 x 20FT FCL
              </p>
            </div>

            {/* Terms of Payment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">
                100% TT TRANSFER WITHIN 7-10 DAYS FROM RECEIPT OF CARGO
              </p>
            </div>

            {/* Shipper's Bank */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">SHIPPER'S BANK</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className=" pt-4 mb-6">
            <h2 className="font-bold">CONSIGNEE:</h2>
            <div className="ml-4">
              <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
              <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
              <p>SINGAPORE</p>
            </div>
          </div>
          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Shipment */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Shipment</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Part of Loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>

            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>
          </div>

          <div className="border-b w-fit text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-4">
            <p>In Case of Shipment via Direct Vessel by Hyundai Liners:</p>
          </div>

          <div className="text-[15px] mt-4 ml-[2%] w-[98%] flex flex-col items-start gap-2">
            {/* Port Of loading */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Loading</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">CHENNAI, INDIA</p>
            </div>
            {/* Port of Discharge */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Port of Discharge</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">SINGAPORE, SINGAPORE</p>
            </div>

            {/* Special Remarks */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Special Remarks</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>

            {/* Documents */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Documents</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">Lorem ipsum</p>
            </div>
          </div>

          <div className="border-b w-fit mt-5 text-[15px] ml-[2%]   font-semibold border-black pt-4 mb-1">
            <p>Kindly Mail your Purchase Order at the earliest.</p>
          </div>

          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <p>Thanks & regards,</p>
            <div className="flex items-center justify-between">
              <p>For ACE EXPORTS (Seller)</p>
              <p className=" mr-[22%]">(Buyer)</p>
            </div>
          </div>
          <div className="text-[15px] ml-[2%]  w-[98%] pt-4">
            <div className="flex justify-between mt-10">
              <div className=" flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Roy D'Souza</p>
                <p>HP : 0091 - 9844072637</p>
              </div>
              <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                <p>Accepted with Co Seal </p>
                <p>15-01-2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ViewContract;
"