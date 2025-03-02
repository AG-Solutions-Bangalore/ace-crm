here is my code "

import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Mail, MessageCircle } from "lucide-react";
import html2pdf from "html2pdf.js";
import BASE_URL, { getImageUrl, LetterHead, SIGN_IN_PURCHASE } from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import moment from "moment";
import LetterHeadImage from "../../assets/letterHead/AceB.png"
import ContractActions from "./ContractActions";
import SignHeadImage from "../../assets/sign/AceB_sign.png"
const ViewContract = () => {
  const withoutHeaderSignRef = useRef()
  const HeaderWithSignRef = useRef()
  const pdfRef = useRef()
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
   const [showLetterhead, setShowLetterhead] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [error, setError] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-contract-by-id/${id}`,
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
        if (!data?.branch?.branch_letter_head) {
          setLoading(true);
          setError("Letter head data is missing");
          return;
        }

        setContractData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);

 useEffect(() => {
          const convertLocalImageToBase64 = async () => {
            try {
              const img = new Image();
              img.src = LetterHeadImage;
              
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
      
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              const base64String = canvas.toDataURL('image/jpeg', 0.98);
              setLogoBase64(base64String);
            } catch (error) {
              console.error("Error converting local image to base64:", error);
            }
          };
      
          convertLocalImageToBase64();
        }, []);





        const handleHeaderWithSignPdf = () => {
            if (!logoBase64) {
              console.error("Logo not yet loaded");
              return;
            }
            const element = pdfRef.current;
        
            const images = element.getElementsByTagName("img");
            let loadedImages = 0;
        
            if (images.length === 0) {
              generateHeaderWithSignPdf(element);
              return;
            }
        
            Array.from(images).forEach((img) => {
              if (img.complete) {
                loadedImages++;
                if (loadedImages === images.length) {
                  generateHeaderWithSignPdf(element);
                }
              } else {
                img.onload = () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    generateHeaderWithSignPdf(element);
                  }
                };
              }
            });
          };
        

  const generateHeaderWithSignPdf = (element) => {
    if (!logoBase64) {
      console.error("Logo not yet converted to base64");
      return;
    }

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
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
      // its no use
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
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          // for logo
          pdf.addImage(logoBase64, "JPEG", 0, 10, pageWidth, 30);

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  }; 





 
  const handleWithHeaderPdf = () => {
    if (!logoBase64) {
      console.error("Logo not yet loaded");
      return;
    }
    setShowSignature(false);
    const element = pdfRef.current;

    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generateWithHeaderPdf(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generateWithHeaderPdf(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generateWithHeaderPdf(element);
          }
        };
      }
    });
  
  };


const generateWithHeaderPdf = (element) => {
if (!logoBase64) {
console.error("Logo not yet converted to base64");
return;
}

const options = {
margin: [55, 0, 15, 0], // top , left , bottom , right
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
// its no use
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
for (let i = 1; i <= totalPages; i++) {
  pdf.setPage(i);

  // for logo
  pdf.addImage(logoBase64, "JPEG", 0, 10, pageWidth, 30);

  // Add contract title
  pdf.setFontSize(12);
  pdf.setFont(undefined, "normal");
  const title = "SALES CONTRACT";
  const titleWidth =
    (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
  pdf.text(title, (pageWidth - titleWidth) / 2, 45);

  // Add contract details
  pdf.setFontSize(9);
  pdf.text(
    `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
    4,
    55
  );
  pdf.text(
    `DATE: ${contractData?.contract?.contract_date || ""}`,
    pageWidth - 31,
    55
  );
  // Add page no at the Bottom

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const text = `Page ${i} of ${totalPages}`;
  const textWidth =
    (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
  const x = pageWidth - textWidth - 10;
  const y = pageHeight - 10;
  pdf.text(text, x, y);
}
})
.save();
};





  const handleSignWithoutHeaderPdf = () => {
   
    const element = pdfRef.current;
    generateSignWithoutHeaderPdf(element);
  };
  const generateSignWithoutHeaderPdf = (element) => {

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
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
      // its no use
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
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

      

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  };









  const handleWithoutHeaderPdf = () => {
    setShowSignature(false); 
    const element = pdfRef.current;
    generateWithoutHeaderPdf(element);
    
  };
  const generateWithoutHeaderPdf = (element) => {

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
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
      // its no use
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
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

      

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  };























  const handleWithHeaderPrint = useReactToPrint({
    content: () => HeaderWithSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
     margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid red;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });
  const handleWithoutHeaderPrint = useReactToPrint({
    content: () => withoutHeaderSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
       margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid blue;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide-header {
        display: none;
      }
     
    }
    `,
  });

  const handleSignWithHeaderPrint = useReactToPrint({
    content: () => HeaderWithSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
    margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid yellow;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide-header-sign {
        display: none;
      }
     
    }
    `,
  });

  const handleSignWithoutHeader = useReactToPrint({
    content: () => withoutHeaderSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
      margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid purple;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });
  

  const PdfHeader = () => (
    <div
      className="print-header hidden print:block"
     
    >
      <img
        src={LetterHeadImage}
        alt="logo"
        className="w-full max-h-[120px] object-contain"
      />
      <h1 className="text-center text-[15px] underline font-bold mt-4">
        SALES CONTRACT
      </h1>
      <div className="p-4 flex items-center justify-between">
        <p>
          <span className="font-semibold text-[12px]">Cont No.:</span>
          {contractData?.contract?.contract_ref}
        </p>
        <p>
          <span className="font-semibold text-[12px]">DATE:</span>
          {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
        </p>
      </div>
    </div>
  );
  const PrintHeader = () => (
    <div
      className="print-header hidden print:block"
     
    >
      <img
       src={getImageUrl(contractData?.branch?.branch_letter_head)}
        alt="logo"
        className="w-full max-h-[120px] object-contain"
      />
      <h1 className="text-center text-[15px] underline font-bold mt-4">
        SALES CONTRACT
      </h1>
      <div className="p-4 flex items-center justify-between">
        <p>
          <span className="font-semibold text-[12px]">Cont No.:</span>
          {contractData?.contract?.contract_ref}
        </p>
        <p>
          <span className="font-semibold text-[12px]">DATE:</span>
          {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
        </p>
      </div>
    </div>
  );
  const PrintWithoutHeader = () => (
    <div
      className="without-print-header hidden print:block"
 
    >
     <div  style={{
      marginTop:"130px"
     }}>
      <h1 className="text-center text-[15px] underline font-bold mt-4">
        SALES CONTRACT 
      </h1>
      <div className="p-4 flex items-center justify-between">
        <p>
          <span className="font-semibold text-[12px]">Cont No.:</span>
          {contractData?.contract?.contract_ref}
        </p>
        <p>
          <span className="font-semibold text-[12px]">DATE:</span>
          {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
        </p>
      </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading contract Data
          </Button>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching contract Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </Page>
    );
  }
  return (
    <Page>
      <div className="  flex w-full p-2 gap-2 relative ">
        <div className="w-[85%] border border-gray-200 rounded-lg p-1">
        {showLetterhead && (
          <div className="      ">
            <img
             src={getImageUrl(contractData?.branch?.branch_letter_head)}
              alt="logo"
              className="w-full"
            />
            <h1 className="text-center text-[15px] underline font-bold ">
              SALES CONTRACT
            </h1>
            <div className=" p-4 flex items-center justify-between">
              <p>
                <span className="font-semibold text-[12px]">Cont No.:</span>
                {contractData?.contract?.contract_ref}
              </p>
              <p>
                <span className="font-semibold text-[12px]">DATE:</span>{" "}
                {moment(contractData?.contract?.contract_date).format(
                  "DD-MMM-YYYY"
                )}
              </p>
            </div>
          </div>
             )}
          <div ref={HeaderWithSignRef} className="  hidden print:block     font-normal ">
           
           <PrintHeader/>
           {contractData && (
             <>
               <div className="max-w-4xl mx-auto    p-4">
                 <div className=" mb-6 flex items-center   justify-between   w-full gap-5">
                   <div className="  w-1/2 ">
                     <h2 className=" font-semibold  text-[12px]">
                       Buyer: {contractData?.contract?.contract_buyer}
                     </h2>
                     <div className="ml-4 text-[12px]">
                       {" "}
                       {contractData?.contract?.contract_buyer_add
                         ?.split(/(.{32})/)
                         .filter(Boolean)
                         .map((line, index) => (
                           <p key={index}>{line}</p>
                         ))}
                       {/* <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
                 <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
                 <p>SINGAPORE</p> */}
                     </div>
                   </div>
                   <div className="   flex flex-col items-end   w-1/2  ">
                     <h2 className="font-semibold text-[12px] ">
                       CONSIGNEE:{contractData?.contract?.contract_consignee}
                     </h2>
                     <div className="   text-[12px] ">
                       {contractData?.contract?.contract_consignee_add
                         ?.split(/(.{32})/)
                         .filter(Boolean)
                         .map((line, index) => (
                           <p key={index}>{line}</p>
                         ))}
                     </div>
                   </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full bg-white border border-gray-300 text-[12px] table-fixed">
                     <tbody className="divide-y divide-gray-200">
                       {contractData.contractSub.map((sub) => (
                         <tr key={sub.id}>
                           <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_marking}
                             {/* HGMPL ,Best, ,AAA, 25 KGS  // marking , item name */}
                           </td>
                           <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_descriptionofGoods}
                             {/* INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP) */}
                           </td>
                           <td className="border w-[20%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_packing} KG NET IN{" "}
                             {sub.contractSub_bagsize} {sub.contractSub_sbaga}
                             {/* 25KG NET IN, 800 JUTE BAGS */}
                           </td>
                           <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {/* 20 MTRS */}
                             {sub.contractSub_qntyInMt} MTS
                           </td>
                           <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_rateMT} USD/MTS
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Container */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Container</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_container_size}
                     </p>
                   </div>

                   {/* Specification */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">
                       Specification (If Any)
                     </span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract.contract_specification1}
                     </p>
                   </div>
                   {contractData?.contract?.contract_specification2 && (
                     <div className="flex items-center gap-4 w-full">
                       <span className="w-1/4 text-left"></span>
                       <span className="w-1 text-center">:</span>
                       <p className="w-3/4">
                         {contractData?.contract.contract_specification2}
                       </p>
                     </div>
                   )}

                   {/* Terms of Payment */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_payment_terms}
                     </p>
                   </div>

                   {/* Shipper's Bank -- if ship_date is not avaiilbe than show remove - */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">SHIPPER'S BANK</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_ship_date}
                       {contractData?.contract?.contract_ship_date && " - "}

                       {contractData?.contract?.contract_shipment}
                     </p>
                   </div>
                 </div>

                 {/* <div className=" pt-4 mb-6">
               <h2 className="font-bold">
                 CONSIGNEE:{contractData?.contract?.contract_consignee}
               </h2>
               <div className="ml-4">
                 {contractData?.contract?.contract_consignee_add
                   ?.split(/(.{32})/)
                   .filter(Boolean)
                   .map((line, index) => (
                     <p key={index}>{line}</p>
                   ))}
           
               </div>
             </div> */}
                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Shipment */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Shipment</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       ON OR BEFORE -{" "}
                       {contractData?.contract?.contract_ship_date}
                     </p>
                   </div>

                   {/* Part of Loading */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Loading</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_loading}, INDIA
                     </p>
                   </div>

                   {/* Port of Discharge */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Discharge</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_discharge},{" "}
                       {contractData?.contract?.contract_destination_country}
                     </p>
                   </div>
                 </div>

                 <div className="border-b w-fit text-[12px] ml-[2%]   font-semibold border-black pt-4 mb-4">
                   <p>
                     In Case of Shipment via Direct Vessel by Hyundai Liners:
                   </p>
                 </div>

                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Port Of loading */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Loading</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_loading}, INDIA
                     </p>
                   </div>
                   {/* Port of Discharge */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Discharge</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_discharge},{" "}
                       {contractData?.contract?.contract_destination_country}
                     </p>
                   </div>

                   {/* Special Remarks */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Special Remarks</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_remarks}
                     </p>
                   </div>
                 </div>

                 <div className="border-b w-fit mt-5 text-[12px] ml-[2%]   font-semibold border-black pt-4 mb-1">
                   <p>Kindly Mail your Purchase Order at the earliest.</p>
                 </div>

                 <div className="  text-[12px] ml-[2%]  w-[98%] pt-4">
                   <p>Thanks & regards,</p>
                   <div className="  flex items-center justify-between">
                     <p>For {contractData?.contract?.branch_name} (Seller)</p>
                     <p className=" mr-[22%]">(Buyer)</p>
                   </div>
                 </div>
                 <div className=" relative text-[12px] ml-[2%]   w-[98%] pt-4">
                   <div className="  flex justify-between mt-10">
                     <div className="  flex flex-col border-t-2 w-[18rem]  border-black items-center">
                       <p>{contractData?.branch?.branch_sign_name}</p>
                       {showSignature && (
                    <img
                                                src={`${SIGN_IN_PURCHASE}/${contractData.branch.branch_sign}`}
                                                 alt="logo"
                                                 className="w-[120px] h-auto absolute print-hide -top-10 "
                                               /> 
                                              )}
                       <p>HP : {contractData?.branch?.branch_sign_no}</p>
                     </div>
                     <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                       <p>Accepted with Co Seal </p>
                       <p>{moment(getTodayDate()).format("DD-MM-YYYY")}</p>
                     </div>
                   </div>
                 </div>
               </div>
             </>
           )}
         </div>





 {/* only for pdf  */}
 <div ref={pdfRef} className="    min-h-screen font-normal ">
           
           <PdfHeader/>
           {contractData && (
             <>
               <div className="max-w-4xl mx-auto    p-4">
                 <div className=" mb-6 flex items-center   justify-between   w-full gap-5">
                   <div className="  w-1/2 ">
                     <h2 className=" font-semibold  text-[12px]">
                       Buyer: {contractData?.contract?.contract_buyer}
                     </h2>
                     <div className="ml-4 text-[12px]">
                       {" "}
                       {contractData?.contract?.contract_buyer_add
                         ?.split(/(.{32})/)
                         .filter(Boolean)
                         .map((line, index) => (
                           <p key={index}>{line}</p>
                         ))}
                       {/* <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
                 <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
                 <p>SINGAPORE</p> */}
                     </div>
                   </div>
                   <div className="   flex flex-col items-end   w-1/2  ">
                     <h2 className="font-semibold text-[12px] ">
                       CONSIGNEE:{contractData?.contract?.contract_consignee}
                     </h2>
                     <div className="   text-[12px] ">
                       {contractData?.contract?.contract_consignee_add
                         ?.split(/(.{32})/)
                         .filter(Boolean)
                         .map((line, index) => (
                           <p key={index}>{line}</p>
                         ))}
                     </div>
                   </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full bg-white border border-gray-300 text-[12px] table-fixed">
                     <tbody className="divide-y divide-gray-200">
                       {contractData.contractSub.map((sub) => (
                         <tr key={sub.id}>
                           <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_marking}
                             {/* HGMPL ,Best, ,AAA, 25 KGS  // marking , item name */}
                           </td>
                           <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_descriptionofGoods}
                             {/* INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP) */}
                           </td>
                           <td className="border w-[20%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_packing} KG NET IN{" "}
                             {sub.contractSub_bagsize} {sub.contractSub_sbaga}
                             {/* 25KG NET IN, 800 JUTE BAGS */}
                           </td>
                           <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {/* 20 MTRS */}
                             {sub.contractSub_qntyInMt} MTS
                           </td>
                           <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                             {sub.contractSub_rateMT} USD/MTS
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Container */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Container</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_container_size}
                     </p>
                   </div>

                   {/* Specification */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">
                       Specification (If Any)
                     </span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract.contract_specification1}
                     </p>
                   </div>
                   {contractData?.contract?.contract_specification2 && (
                     <div className="flex items-center gap-4 w-full">
                       <span className="w-1/4 text-left"></span>
                       <span className="w-1 text-center">:</span>
                       <p className="w-3/4">
                         {contractData?.contract.contract_specification2}
                       </p>
                     </div>
                   )}

                   {/* Terms of Payment */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_payment_terms}
                     </p>
                   </div>

                   {/* Shipper's Bank -- if ship_date is not avaiilbe than show remove - */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">SHIPPER'S BANK</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_ship_date}
                       {contractData?.contract?.contract_ship_date && " - "}

                       {contractData?.contract?.contract_shipment}
                     </p>
                   </div>
                 </div>

                 {/* <div className=" pt-4 mb-6">
               <h2 className="font-bold">
                 CONSIGNEE:{contractData?.contract?.contract_consignee}
               </h2>
               <div className="ml-4">
                 {contractData?.contract?.contract_consignee_add
                   ?.split(/(.{32})/)
                   .filter(Boolean)
                   .map((line, index) => (
                     <p key={index}>{line}</p>
                   ))}
           
               </div>
             </div> */}
                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Shipment */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Shipment</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       ON OR BEFORE -{" "}
                       {contractData?.contract?.contract_ship_date}
                     </p>
                   </div>

                   {/* Part of Loading */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Loading</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_loading}, INDIA
                     </p>
                   </div>

                   {/* Port of Discharge */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Discharge</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_discharge},{" "}
                       {contractData?.contract?.contract_destination_country}
                     </p>
                   </div>
                 </div>

                 <div className=" w-fit text-[12px] ml-[2%]     pt-4 mb-4">
                   <p className="font-semibold">
                     In Case of Shipment via Direct Vessel by Hyundai Liners:
                   </p>
                   <hr className="mt-2 border-0 h-[0.5px] bg-black" />

                 </div>

                 <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                   {/* Port Of loading */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Loading</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_loading}, INDIA
                     </p>
                   </div>
                   {/* Port of Discharge */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Port of Discharge</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_discharge},{" "}
                       {contractData?.contract?.contract_destination_country}
                     </p>
                   </div>

                   {/* Special Remarks */}
                   <div className="flex items-center gap-4 w-full">
                     <span className="w-1/4 text-left">Special Remarks</span>
                     <span className="w-1 text-center">:</span>
                     <p className="w-3/4">
                       {contractData?.contract?.contract_remarks}
                     </p>
                   </div>
                 </div>

                 <div className=" w-fit mt-5 text-[12px] ml-[2%]    pt-4 mb-1">
                   <p className="font-semibold">Kindly Mail your Purchase Order at the earliest.</p>
                   <hr className="mt-2 border-0 h-[0.5px] bg-black" />
                 </div>

                 <div className="  text-[12px] ml-[2%]  w-[98%] pt-4">
                   <p>Thanks & regards,</p>
                   <div className="  flex items-center justify-between">
                     <p>For {contractData?.contract?.branch_name} (Seller)</p>
                     <p className=" mr-[22%]">(Buyer)</p>
                   </div>
                 </div>
                 <div className=" relative text-[12px] ml-[2%]   w-[98%] pt-4">
                   <div className="  flex justify-between mt-10">
                     <div className="  flex flex-col border-t-2 w-[18rem]  border-black items-center">
                       <p>{contractData?.branch?.branch_sign_name}</p>
                       {showSignature && (
                    <img
                                                 src={SignHeadImage}
                                                 alt="logo"
                                                 className="w-[120px] h-auto absolute print-hide -top-10 "
                                               /> 
                                              )}
                       <p>HP : {contractData?.branch?.branch_sign_no}</p>
                     </div>
                     <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                       <p>Accepted with Co Seal </p>
                       <p>{moment(getTodayDate()).format("DD-MM-YYYY")}</p>
                     </div>
                   </div>
                 </div>
               </div>
             </>
           )}
         </div>





       {/* only for print  */}
          <div ref={withoutHeaderSignRef} className=" hidden print:block     font-normal ">
           
            <PrintWithoutHeader/>
            {contractData && (
              <>
                <div className="max-w-4xl mx-auto    p-4">
                  <div className=" mb-6 flex items-center   justify-between   w-full gap-5">
                    <div className="  w-1/2 ">
                      <h2 className=" font-semibold  text-[12px]">
                        Buyer: {contractData?.contract?.contract_buyer}
                      </h2>
                      <div className="ml-4 text-[12px]">
                        {" "}
                        {contractData?.contract?.contract_buyer_add
                          ?.split(/(.{32})/)
                          .filter(Boolean)
                          .map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        {/* <p>HONG GUAN MARINE PRODUCTS PTE LTD</p>
                  <p>BLOCK 16, WHOLESALE CENTRE, #01-98</p>
                  <p>SINGAPORE</p> */}
                      </div>
                    </div>
                    <div className="   flex flex-col items-end   w-1/2  ">
                      <h2 className="font-semibold text-[12px] ">
                        CONSIGNEE:{contractData?.contract?.contract_consignee}
                      </h2>
                      <div className="   text-[12px] ">
                        {contractData?.contract?.contract_consignee_add
                          ?.split(/(.{32})/)
                          .filter(Boolean)
                          .map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 text-[12px] table-fixed">
                      <tbody className="divide-y divide-gray-200">
                        {contractData.contractSub.map((sub) => (
                          <tr key={sub.id}>
                            <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                              {sub.contractSub_marking}
                              {/* HGMPL ,Best, ,AAA, 25 KGS  // marking , item name */}
                            </td>
                            <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                              {sub.contractSub_descriptionofGoods}
                              {/* INDIAN GROUNDNUTS 80/90 (SOUTH NEW CROP) */}
                            </td>
                            <td className="border w-[20%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                              {sub.contractSub_packing} KG NET IN{" "}
                              {sub.contractSub_bagsize} {sub.contractSub_sbaga}
                              {/* 25KG NET IN, 800 JUTE BAGS */}
                            </td>
                            <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                              {/* 20 MTRS */}
                              {sub.contractSub_qntyInMt} MTS
                            </td>
                            <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                              {sub.contractSub_rateMT} USD/MTS
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                    {/* Container */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Container</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_container_size}
                      </p>
                    </div>

                    {/* Specification */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">
                        Specification (If Any)
                      </span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract.contract_specification1}
                      </p>
                    </div>
                    {contractData?.contract?.contract_specification2 && (
                      <div className="flex items-center gap-4 w-full">
                        <span className="w-1/4 text-left"></span>
                        <span className="w-1 text-center">:</span>
                        <p className="w-3/4">
                          {contractData?.contract.contract_specification2}
                        </p>
                      </div>
                    )}

                    {/* Terms of Payment */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">TERMS OF PAYMENT</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_payment_terms}
                      </p>
                    </div>

                    {/* Shipper's Bank -- if ship_date is not avaiilbe than show remove - */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">SHIPPER'S BANK</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_ship_date}
                        {contractData?.contract?.contract_ship_date && " - "}

                        {contractData?.contract?.contract_shipment}
                      </p>
                    </div>
                  </div>

                  {/* <div className=" pt-4 mb-6">
                <h2 className="font-bold">
                  CONSIGNEE:{contractData?.contract?.contract_consignee}
                </h2>
                <div className="ml-4">
                  {contractData?.contract?.contract_consignee_add
                    ?.split(/(.{32})/)
                    .filter(Boolean)
                    .map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
            
                </div>
              </div> */}
                  <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                    {/* Shipment */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Shipment</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        ON OR BEFORE -{" "}
                        {contractData?.contract?.contract_ship_date}
                      </p>
                    </div>

                    {/* Part of Loading */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Port of Loading</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_loading}, INDIA
                      </p>
                    </div>

                    {/* Port of Discharge */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Port of Discharge</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_discharge},{" "}
                        {contractData?.contract?.contract_destination_country}
                      </p>
                    </div>
                  </div>

                  <div className="border-b w-fit text-[12px] ml-[2%]   font-semibold border-black pt-4 mb-4">
                    <p>
                      In Case of Shipment via Direct Vessel by Hyundai Liners:
                    </p>
                  </div>

                  <div className="text-[12px] mt-4 ml-[2%] w-[98%] flex flex-col items-start ">
                    {/* Port Of loading */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Port of Loading</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_loading}, INDIA
                      </p>
                    </div>
                    {/* Port of Discharge */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Port of Discharge</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_discharge},{" "}
                        {contractData?.contract?.contract_destination_country}
                      </p>
                    </div>

                    {/* Special Remarks */}
                    <div className="flex items-center gap-4 w-full">
                      <span className="w-1/4 text-left">Special Remarks</span>
                      <span className="w-1 text-center">:</span>
                      <p className="w-3/4">
                        {contractData?.contract?.contract_remarks}
                      </p>
                    </div>
                  </div>

                  <div className="border-b w-fit mt-5 text-[12px] ml-[2%]   font-semibold border-black pt-4 mb-1">
                    <p>Kindly Mail your Purchase Order at the earliest.</p>
                  </div>

                  <div className="  text-[12px] ml-[2%]  w-[98%] pt-4">
                    <p>Thanks & regards,</p>
                    <div className="  flex items-center justify-between">
                      <p>For {contractData?.contract?.branch_name} (Seller)</p>
                      <p className=" mr-[22%]">(Buyer)</p>
                    </div>
                  </div>
                  <div className=" relative text-[12px] ml-[2%]   w-[98%] pt-4">
                    <div className="  flex justify-between mt-10">
                      <div className="  flex flex-col border-t-2 w-[18rem]  border-black items-center">
                        <p>{contractData?.branch?.branch_sign_name}</p>
                         <img
                                                   src={`${SIGN_IN_PURCHASE}/${contractData.branch.branch_sign}`}
                                                  alt="logo"
                                                  className="w-[120px] h-auto absolute print-hide  -top-10 "
                                                />
                        <p>HP : {contractData?.branch?.branch_sign_no}</p>
                      </div>
                      <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                        <p>Accepted with Co Seal </p>
                        <p>{moment(getTodayDate()).format("DD-MM-YYYY")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>





       
        </div>
















        <div className="fixed w-[15%] flex flex-col right-0 bottom-10 h-[30vh] border border-gray-200   rounded-lg  p-2 ">
          <ContractActions
           showLetterhead={showLetterhead}
           setShowLetterhead={setShowLetterhead}
           showSignature={showSignature}
           setShowSignature={setShowSignature}
          // print 
            handleWithHeaderPrint={handleWithHeaderPrint}
            handleWithoutHeaderPrint={handleWithoutHeaderPrint}
            handleSignWithoutHeader={handleSignWithoutHeader}
            handleSignWithHeaderPrint={handleSignWithHeaderPrint}
            // pdf 


            handleHeaderWithSignPdf={handleHeaderWithSignPdf}
            handleWithHeaderPdf={handleWithHeaderPdf}
            handleSignWithoutHeaderPdf={handleSignWithoutHeaderPdf}
            handleWithoutHeaderPdf={handleWithoutHeaderPdf}
            // whatsappWithoutHeaderPdf={whatsappWithoutHeaderPdf}
          />
        </div>
      </div>
      
    </Page>
  );
};

export default ViewContract;



"