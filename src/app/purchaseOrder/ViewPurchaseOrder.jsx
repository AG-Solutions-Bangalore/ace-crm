import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Mail, MessageCircle } from "lucide-react";
import html2pdf from "html2pdf.js";
import BASE_URL, { SIGN_IN_PURCHASE } from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import { getTodayDate } from "@/utils/currentDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import moment from "moment";
import { toWords } from "number-to-words";

const ViewPurchaseOrder = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const [purchaseProductData, setPurchaseProductData] = useState({});
  const [purchaseProductSubData, setPurchaseProductSubData] = useState([]);
  const [branchData, setBranchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-purchase-product-view-by-id/${id}`,
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
        setPurchaseProductData(data.purchaseProduct);
        setPurchaseProductSubData(data.purchaseProductSub);
        setBranchData(data.branch);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [id]);
  const formatToPascalCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const totalAmount = purchaseProductSubData
    .reduce((total, item) => {
      return (
        total +
        (item.purchase_productSub_qntyInMt *
          item.purchase_productSub_rateInMt || 0)
      );
    }, 0)
    .toFixed(2);

  const totalInWords = toWords(Math.floor(totalAmount));
  const cents = Math.round((totalAmount - Math.floor(totalAmount)) * 100);
  const formattedAmount =
    formatToPascalCase(totalInWords) +
    (cents > 0 ? `And${toWords(cents)}Cents` : "") +
    " Dollars";
  useEffect(() => {
    const fetchAndConvertImage = async () => {
      try {
        const logoUrl = `/api/public/assets/images/letterHead/AceB.png`;
        const response = await fetch(logoUrl);
        const blob = await response.blob();

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
      margin: [55, 3, 15, 3],
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

          const imgData = logoBase64.split(",")[1];
          pdf.addImage(imgData, "JPEG", 0, 10, pageWidth, 30);

          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "PURCHASE ORDER";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          pdf.setFontSize(9);

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

  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
      margin: 0mm;
      
    }
    @media print {
      body {
        border: 0px solid #000;
        margin: 1mm;
        padding: 40mm 2mm 2mm 2mm;
        min-height: 100vh;
         
       }

      .print-hide {
        display: none;
      }
      .print-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: white;
        z-index: 1000;
      }
    }
    `,
  });

  const PrintHeader = () => (
    <div
      className="print-header hidden print:block"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        zIndex: 1000,
        height: "150px",
      }}
    >
      <img
        src={`/api/public/assets/images/letterHead/${branchData?.branch_letter_head}`}
        alt="logo"
        className="w-full max-h-[120px] object-contain"
      />
      <h1 className="text-center text-[15px] font-bold mt-2 ">
        PURCHASE ORDER
      </h1>
    </div>
  );
  return (
    <Page>
      <div className=" flex w-full p-2 gap-2 relative ">
        <div>
          <div>
            {" "}
            <img
              src={`/api/public/assets/images/letterHead/${branchData?.branch_letter_head}`}
              alt="logo"
              className="w-full  block print:hidden"
            />
            <h1 className="text-center text-[15px] font-bold block print:hidden ">
              PURCHASE ORDER
            </h1>
          </div>
          <div ref={containerRef}>
            <PrintHeader />

            <div>
              <div className="border border-black">
                <div className="mx-4 ">
                  <div className="w-full mx-auto grid grid-cols-2 gap-4 ">
                    <div>
                      <p className="font-bold">
                        {purchaseProductData.purchase_product_seller}
                      </p>

                      <p> {purchaseProductData.purchase_product_seller_add}</p>
                      <p>
                        GSTIN :{" "}
                        {purchaseProductData.purchase_product_seller_gst}{" "}
                      </p>
                      <p>
                        Kind Attn. :{" "}
                        {purchaseProductData.purchase_product_seller_contact}
                      </p>
                    </div>
                    <div className="text-right ">
                      <p>
                        PO DATE:{" "}
                        {moment(
                          purchaseProductData.purchase_product_date
                        ).format("DD-MM-YYYY")}
                      </p>
                      <p>
                        PO. NO.:
                        <span className="font-semibold">
                          {" "}
                          {purchaseProductData.purchase_product_ref}
                        </span>
                      </p>
                      <p>
                        DELIVERY DATE:{" "}
                        {purchaseProductData.purchase_product_delivery_date &&
                          moment(
                            purchaseProductData.purchase_product_delivery_date
                          ).format("DD-MM-YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full mx-auto mt-6">
                    {" "}
                    <div className="">
                      <p>Dear Sir,</p>
                    </div>
                  </div>

                  <div className="text-[12px]">
                    <table className="w-full border-collapse table-auto border border-black my-2">
                      <thead>
                        <tr className="border-b border-black">
                          <th
                            className="border-r border-black p-2 text-center text-[11px]"
                            style={{ width: "30%" }}
                          >
                            Product
                          </th>

                          <th
                            className="border-r border-black p-2 text-center text-[11px]"
                            style={{ width: "35%" }}
                          >
                            <p> DESCRIPTION OF EXPORT GOODS</p>{" "}
                          </th>
                          <th
                            className="border-r border-black p-2 px-3 text-center text-[11px]"
                            style={{ width: "10%" }}
                          >
                            QUANTITY IN MT
                          </th>
                          <th
                            className="border-r border-black p-2 text-center text-[11px]"
                            style={{ width: "10%" }}
                          >
                            RATE PER MT IN USD
                          </th>
                          <th
                            className="p-2 text-center text-[11px]"
                            style={{ width: "15%" }}
                          >
                            AMOUNT (USD)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {purchaseProductSubData.map((item, index) => (
                          <>
                            <tr key={index}>
                              <td className="border-r border-black p-2">
                                {item.purchase_productSub_name}
                              </td>

                              <td className="border-r border-black p-2">
                                {item.purchase_productSub_description}
                              </td>
                              <td className="border-r border-black p-2 text-center">
                                {item.purchase_productSub_qntyInMt} MTS
                              </td>
                              <td className="border-r border-black p-2 text-center">
                                {item.purchase_productSub_rateInMt} MTS
                              </td>
                              <td className="p-2 text-right">
                                $
                                {(
                                  item.purchase_productSub_qntyInMt *
                                  item.purchase_productSub_rateInMt
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </>
                        ))}

                        <tr>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-t border-black p-2 text-right font-bold">
                            $
                            {purchaseProductSubData
                              .reduce((total, item) => {
                                return (
                                  total +
                                  (item.purchase_productSub_qntyInMt *
                                    item.purchase_productSub_rateInMt || 0)
                                );
                              }, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div>
                      <p>
                        AMOUNT CHARGEABLE IN WORDS -{" "}
                        <span className=" font-semibold ml-3">
                          {formattedAmount}{" "}
                        </span>
                      </p>
                      <p>
                        GST NOTIFICATION :
                        <span className="font-bold">
                          {" "}
                          {
                            purchaseProductData.purchase_product_gst_notification
                          }
                        </span>{" "}
                      </p>
                    </div>

                    <div>
                      QUALITY {purchaseProductData.purchase_product_quality}
                    </div>
                    <div>
                      PAYMENT :{" "}
                      {purchaseProductData.purchase_product_payment_terms}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-3 text-[12px]">
                  <div className="col-span-1 pl-4">
                    <div className="leading-none">
                      <p className="font-bold"> DELIVERY AT </p>

                      <p className="my-2">
                        {purchaseProductData.purchase_product_delivery_at}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 border-t border-l border-black w-full h-full">
                    <div className="p-4 h-full relative">
                      <p className="font-bold leading-none">
                        For {purchaseProductData.branch_name}
                      </p>

                      <div className="relative w-[200px] h-auto">
                        <p className="font-bold leading-none absolute bottom-0 right-0 -translate-x-1/2 text-black opacity-50 z-10">
                          Authorised Signatory :
                        </p>
                        <img
                          src={`${SIGN_IN_PURCHASE}/${branchData.branch_sign}`}
                          alt="logo"
                          className="w-[120px] h-auto relative "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[15%] flex flex-col  border border-gray-200  h-screen rounded-lg  p-2 ">
          <Tabs defaultValue="header" className="w-full ">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="header">Actions</TabsTrigger>
            </TabsList>
            <TabsContent value="header">
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={handlPrintPdf}
                  className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print PDF</span>
                </Button>
                <Button
                  onClick={handleSaveAsPdf}
                  className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Save as PDF</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Page>
  );
};

export default ViewPurchaseOrder;
