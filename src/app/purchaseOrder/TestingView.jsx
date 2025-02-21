import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import BASE_URL from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toWords } from "number-to-words";
import { useReactToPrint } from "react-to-print";
// import logo from "../../../public/letterHead/AceB.png";
// import sign from "../../../public/sign/AceB_sign.png";

const PrintContent = React.forwardRef(
  (
    {
      data,
      purchaseProductData,
      purchaseProductSubData,
      formattedAmount,
      includeSign,
      // sign,
    },
    ref
  ) => {
    return (
      <Page>
        <div ref={ref} className="print-container">
          <table>
            <thead>
              <tr>
                <td colSpan="2">
                  {/* <img src={logo} alt="logo" className="w-full" /> */}
                  <h1 className="text-center text-[15px] font-bold">
                    PURCHASE ORDER
                  </h1>
                </td>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={`print-section`}>
                  <td className="print-body">
                    <div className="border border-black">
                      <div className="mx-4">
                        <div className="w-full mx-auto grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-bold">
                              {purchaseProductData?.purchase_product_seller}
                            </p>
                            <p>
                              {purchaseProductData?.purchase_product_seller_add}
                            </p>
                            <p>
                              GSTIN:{" "}
                              {purchaseProductData?.purchase_product_seller_gst}
                            </p>
                            <p>
                              Kind Attn.:{" "}
                              {
                                purchaseProductData?.purchase_product_seller_contact
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p>
                              PO DATE:{" "}
                              {purchaseProductData?.purchase_product_date
                                ? moment(
                                    purchaseProductData.purchase_product_date
                                  ).format("DD-MM-YYYY")
                                : ""}
                            </p>
                            <p>
                              PO NO.:{" "}
                              <span className="font-semibold">
                                {purchaseProductData?.purchase_product_ref}
                              </span>
                            </p>
                            <p>
                              DELIVERY DATE:{" "}
                              {purchaseProductData?.purchase_product_delivery_date
                                ? moment(
                                    purchaseProductData.purchase_product_delivery_date
                                  ).format("DD-MM-YYYY")
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="w-full mx-auto mt-6">
                          <p>Dear Sir,</p>
                        </div>
                      </div>

                      <div className="text-[12px] mx-4">
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

                            <div className="relative w-[200px] h-auto min-h-36">
                              {/* {includeSign && (
                          <p className="font-bold leading-none absolute bottom-0 right-0 -translate-x-1/2 text-black opacity-50 z-10">
                            Authorised Signatory :
                          </p>
                        )} */}
                              {!includeSign && (
                                <p className="font-bold leading-none absolute bottom-0 right-0 -translate-x-1/2 text-black opacity-50 z-10 ">
                                  Authorised Signatory :
                                </p>
                              )}
                              {includeSign && (
                                <>
                                  <img
                                    // src={sign}
                                    alt="logo MISSING"
                                    className="w-[120px] h-auto relative"
                                  />

                                  <p className="font-bold leading-none absolute bottom-0 right-0 -translate-x-1/2 text-black opacity-50 z-10 ">
                                    Authorised Signatory :
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Page>
    );
  }
);

const TestingView = () => {
  const printRef = useRef();
  const { id } = useParams();
  const [purchaseProductData, setPurchaseProductData] = useState({});
  const [purchaseProductSubData, setPurchaseProductSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [includeSign, setIncludeSign] = useState(true);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-purchase-product-view-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (!data?.branch?.branch_letter_head) {
          setError("Letter head data is missing");
          setLoading(false);
          return;
        }
        setPurchaseProductData(data.purchaseProduct);
        setPurchaseProductSubData(data.purchaseProductSub);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [id]);

  const totalAmount = purchaseProductSubData
    .reduce(
      (total, item) =>
        total +
        (item.purchase_productSub_qntyInMt *
          item.purchase_productSub_rateInMt || 0),
      0
    )
    .toFixed(2);

  const totalInWords = toWords(Math.floor(totalAmount));
  const formattedAmount = `${totalInWords} Dollars`;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Purchase Order",
    pageStyle: `
      @media print {
        thead { display: table-header-group; }
        .print-header {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          background: white;
          border-bottom: 2px solid black;
        }
        .print-container { margin-top: 20px; }
        .print-body { margin-top: 10px; page-break-inside: avoid; }
        .print-section { margin-bottom: 20px; }
        .page-margin { margin-top: 100px !important; }
        .page-break { page-break-before: always; }
        @page { size: A4; margin: 5mm; }
      }
    `,
  });
  const handleSaveAsPdf1 = async () => {
    if (!printRef.current) return;

    const opt = {
      margin: 10,
      filename: "purchase_order.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(printRef.current).set(opt).save();
  };
  return (
    <div>
      <Button onClick={handlePrint}>Print Purchase Order</Button>
      <Button onClick={handleSaveAsPdf1}>Print Purchase Order pdf</Button>

      <PrintContent
        ref={printRef}
        data={purchaseProductSubData}
        purchaseProductData={purchaseProductData}
        purchaseProductSubData={purchaseProductSubData}
        formattedAmount={formattedAmount}
        includeSign={includeSign}
        // sign={sign}
      />
    </div>
  );
};

export default TestingView;
