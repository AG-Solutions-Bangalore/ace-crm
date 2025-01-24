import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import logo from "../../../public/assets/AceB.png";
import BASE_URL from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import ReactToPrint from "react-to-print";
import { ButtonConfig } from "@/config/ButtonConfig";
const ViewContract = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
  const logoUrl = "/api/public/assets/images/letterHead/AceB.png";
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
    const fetchAndConvertImage = async () => {
      try {
        const response = await fetch(logoUrl);
        const blob = await response.blob();

        // Create a FileReader to convert blob to base64  - because some packge dont take it with base64
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
      header: {
        height: "90mm",
        contents: {
          default: `
             <div style="text-align: center; width: 100%; >
               <img src="${logoBase64}" alt="logo" style="max-width: 100%; height: auto; margin: 0 auto;" />
                <h1 style="text-align: center; font-size: 16px; text-decoration: underline; font-weight: bold; margin: 15px 0;">
                SALES CONTRACT
              </h1>
              <div style="display: flex; justify-content: space-between; margin: 10px 40px;">
                <p>
                  <span style="font-weight: 600; font-size: 15px;">Cont No.:</span>
                  ${contractData?.contract?.contract_ref || ""}
                </p>
                <p>
                  <span style="font-weight: 600; font-size: 15px;">DATE:</span>
                  ${contractData?.contract?.contract_date || ""}
                </p>
              </div>
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
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          // for logo
          const imgData = logoBase64.split(",")[1];
          pdf.addImage(imgData, "JPEG", 0, 10, pageWidth, 30);

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

  const PrintHeader = () => (
    <div className="print-header">
      <img
        src="/api/public/assets/images/letterHead/AceB.png"
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
          {contractData?.contract?.contract_date}
        </p>
      </div>
    </div>
  );

  return (
    <Page>
      <button
        onClick={handleSaveAsPdf}
        className={`fixed bottom-10 right-10 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} px-4 py-2 rounded-lg shadow-lg `}
      >
        Save as PDF
      </button>
      <ReactToPrint
            trigger={() => (
              <Button
                variant="outline"
                size="icon"
                className={`fixed bottom-20 right-10 px-4 py-2 rounded-lg shadow-lg ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
            content={() => containerRef.current}
            documentTitle={`contract-view`}
            pageStyle={`
                            @page {
                                size: auto;
                                margin: 0mm;
                            }
                            @media print {
                                body {
                                 border: 1px solid #000;
                                    margin: 1mm;
                                     padding: 1mm;
                                     min-height:100vh
                                }
                                .print-hide {
                                    display: none;
                                }
                            }
                        `}
          />
      
      <div className="max-w-4xl mt-4 mx-auto    ">
        <img
          src="/api/public/assets/images/letterHead/AceB.png"
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
            {contractData?.contract?.contract_date}
          </p>
        </div>
      </div>
      <div ref={containerRef} className="   min-h-screen font-normal ">
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
                    ON OR BEFORE - {contractData?.contract?.contract_ship_date}
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
                <p>In Case of Shipment via Direct Vessel by Hyundai Liners:</p>
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

                {/* Documents */}
                {/* <div className="flex items-center gap-4 w-full">
                  <span className="w-1/4 text-left">Documents</span>
                  <span className="w-1 text-center">:</span>
                  <p className="w-3/4">Lorem ipsum</p>
                </div> */}
              </div>

              <div className="border-b w-fit mt-5 text-[12px] ml-[2%]   font-semibold border-black pt-4 mb-1">
                <p>Kindly Mail your Purchase Order at the earliest.</p>
              </div>

              <div className="text-[12px] ml-[2%]  w-[98%] pt-4">
                <p>Thanks & regards,</p>
                <div className="flex items-center justify-between">
                  <p>For {contractData?.contract?.branch_name} (Seller)</p>
                  <p className=" mr-[22%]">(Buyer)</p>
                </div>
              </div>
              <div className="text-[12px] ml-[2%]  w-[98%] pt-4">
                <div className="flex justify-between mt-10">
                  <div className=" flex flex-col border-t-2 w-[18rem]  border-black items-center">
                    <p>{contractData?.branch?.branch_sign_name}</p>
                    <p>HP : {contractData?.branch?.branch_sign_no}</p>
                  </div>
                  <div className=" mr-[7%] flex flex-col border-t-2 w-[18rem]  border-black items-center">
                    <p>Accepted with Co Seal </p>
                    <p>{getTodayDate()}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default ViewContract;
