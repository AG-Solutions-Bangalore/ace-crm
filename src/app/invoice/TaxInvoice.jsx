import BASE_URL from "@/config/BaseUrl";
import { decryptId } from "@/utils/encyrption/Encyrption";
import axios from "axios";
import { Printer } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint, { useReactToPrint } from "react-to-print";
const TaxInvoice = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const [invoice, setInvoice] = useState(null);
  const [branch, setBranch] = useState(null);
  const [productHsn, setProductHsn] = useState(null);
  const [lut, setLut] = useState(null);
  const [invoiceSubData, setInvoiceSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaxInvoiceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-invoice-view-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      console.log(data, "data");
      setInvoice(data?.invoice);
      setBranch(data?.branch);
      setInvoiceSubData(data?.invoiceSub);
      setProductHsn(data?.producthsn);
      setLut(data?.lut);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTaxInvoiceData();
  }, [decryptedId]);
  console.log(invoice);
  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "invoice_gst",
    pageStyle: `
                @page {
                size: A4 portrait;
                margin: 0mm;
                
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
    <>
      <div className="relative">
        <button
          onClick={handlPrintPdf}
          className="fixed top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          <Printer className="h-4 w-4" />
        </button>

        <div ref={containerRef} className="font-normal text-sm mt-2">
          <>
            <div className="p-4 m-[1rem] font-normal text-[11px]">
              <div className="max-w-4xl mx-auto border-2 border-black">
                <h3 className=" border-b border-black text-xl font-bold flex justify-center p-1">
                  TAX INVOICE
                </h3>
                <div className="grid grid-cols-2">
                  <div>
                    <div className=" text-[11px] leading-relaxed mb-1 px-2 border-b border-black">
                      <p className="mb-2">
                        <strong>{invoice?.branch_name}</strong> <br />
                        {invoice?.branch_address} <br />
                        <span className="mr-1">FSSAI :</span> <br />
                        <span className="mr-1">GSTIN/UIN :</span>{" "}
                        {branch?.branch_gst}
                        <br />
                        <span className="mr-1">State Name :</span>{" "}
                        {branch?.branch_state} , Code: {branch?.branch_state_no}
                        <br />
                      </p>
                    </div>

                    <div className=" text-[11px]   px-2 border-b border-black">
                      <p className="leading-relaxed mb-2">
                        <p>Consignee (Ship to)</p>
                        <strong>{invoice?.invoice_buyer}</strong> <br />
                        {invoice?.invoice_buyer_add}
                        <br />
                        {/* TIRUVOTTIYUR, CHENNAI
                        <br />
                        <p>State Name : Tamil Nadu, Code : 33 </p> */}
                      </p>
                    </div>
                    <div className=" text-[11px]  px-2">
                      <p className="leading-relaxed mb-1">
                        <p> Buyer (Bill to)</p>
                        <strong>JL AGRI EXPORTS</strong> <br />
                        189/9 & 189/10
                        <br />
                        C/O RAVI AGRI COLD STORAGE, OV ROAD VELLATUR,PONNALUR,
                        PRAKASAM
                        <br />
                        <p>GSTIN/UIN : 37AASFJ5400H1Z8</p>
                        <p> State Name : Andhra Pradesh, Code : 37</p>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="grid  text-[11px]">
                      <div className="grid grid-cols-2 border-b border-l border-black w-full px-1">
                        <div className="w-full border-r border-black grid grid-cols-2 gap-2">
                          <div>
                            <h3>Invoice No.</h3>
                            <p className="text-[10px] font-semibold text-black">
                              {invoice?.invoice_no}
                            </p>
                          </div>
                          <div>
                            <h3>e-Way Bill No</h3>
                            <p className="text-[10px] font-semibold text-black"></p>
                          </div>
                        </div>
                        <div className="w-full px-1">
                          <h3>Dated</h3>
                          <p className="font-semibold text-black">
                            {moment(invoice?.invoice_date).format(
                              "DD-MMM-YYYY"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border-b border-l border-black w-full px-1">
                        <div className="w-full border-r border-black">
                          <h3>Delivery Note</h3>
                          <p>Dummy</p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Mode/Terms of Payment</h3>
                          <p>Dummy</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 w-full px-1 border-l border-b border-black">
                        <div className="w-full border-r border-black">
                          <h3>Reference No. & Date.</h3>
                          <p>Dummy</p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Other References</h3>
                          <p>Dummy</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid  text-[11px]">
                      <div className="grid grid-cols-2 border-b border-l border-black w-full px-1">
                        <div className="w-full border-r border-black">
                          <h3>Buyer’s Order No. .</h3>
                          <p className="font-semibold text-black">
                            V3C/G155/24-25
                          </p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Dated</h3>
                          <p className="font-semibold text-black">5-Aug-24</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border-b border-l border-black w-full px-1">
                        <div className="w-full border-r border-black">
                          <h3>Dispatch Doc No.</h3>
                          <p>Dummy</p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Delivery Note Date</h3>
                          <p>Dummy</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 w-full px-1 border-l border-b  border-black">
                        <div className="w-full border-r border-black">
                          <h3>Dispatched through .</h3>
                          <p>dummy</p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Destination</h3>
                          <p>Dummy</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 w-full px-1 border-l border-b  border-black">
                        <div className="w-full border-r border-black">
                          <h3>Bill of Lading/LR-RR No. .</h3>
                          <p>dummy</p>
                        </div>
                        <div className="w-full px-1">
                          <h3>Motor Vehicle No.</h3>
                          <p>Dummy</p>
                        </div>
                      </div>

                      <div className="text-[11px] border-l border-black">
                        <div className="w-full px-1">
                          <div className="w-full">
                            <h3>Terms of Delivery</h3>

                            <h3>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Aliquid dolorem esse possimus
                            </h3>
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                </div>
                {/* //second */}

                {/* //third */}

                <div className="grid grid-cols-2"></div>
                {/* //fourth */}
                <div>
                  <table className="w-full border-t border-black text-[11px]">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="w-[5%] border-r border-black p-1 text-center">
                          S. No
                        </th>
                        <th className="w-[10%] border-r border-black p-1 text-center">
                          Marks & Nos./Container No.
                        </th>
                        <th className="w-[10%] border-r border-black p-1 text-center">
                          No. & Kind of Pkgs
                        </th>
                        <th className="w-[25%] border-r border-black p-1 text-center">
                          Description of Goods
                        </th>
                        <th className="w-[8%] border-r border-black p-1 text-center">
                          HSN/SAC
                        </th>
                        <th className="w-[10%] border-r border-black p-1 text-center">
                          Quantity
                        </th>
                        <th className="w-[7%] border-r border-black p-1 text-center">
                          Rate
                        </th>
                        <th className="w-[7%] border-r border-black p-1 text-center">
                          per
                        </th>
                        <th className="w-[10%] p-1 text-center">Amount</th>
                      </tr>
                    </thead>

                    <tbody className="text-[12px]">
                      <tr>
                        <td className="border-r border-black p-1 text-center">
                          1
                        </td>
                        <td className="border-r border-black p-1">JEAB RED</td>
                        <td className="border-r border-black p-1 text-center">
                          1350 BAGS
                        </td>
                        <td className="border-r border-black p-1 text-end font-semibold">
                          DRY CHILLIES (TEJA WITH STEM RED
                        </td>
                        <td className="p-1 text-end border-r border-black">
                          09042110
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          12,825.000 Kgs
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          120.00{" "}
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          Kgs
                        </td>
                        <td className="p-1 text-end">16,200.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 text-center">
                          2
                        </td>
                        <td className="border-r border-black p-1">JEAB RED1</td>
                        <td className="border-r border-black p-1 text-center">
                          1250 BAGS
                        </td>
                        <td className="border-r border-black p-1 text-end font-semibold">
                          DRY CHILLIES (TEJA WITH STEM REDS
                        </td>
                        <td className="p-1 text-end border-r border-black">
                          09042110
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          12,825.000 Kgs
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          110.00{" "}
                        </td>
                        <td className="p-1 text-center border-r border-black">
                          Kgs
                        </td>
                        <td className="p-1 text-end">10,240.00</td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-left"></td>
                        <td className="border-r text-end border-black p-1 font-bold"></td>
                        <td className="border-r border-black p-1 text-center"></td>
                        <td className="border-r border-black p-1 text-end font-semibold">
                          <p>(Each Bag Net Weight : 9.500 KGS</p>
                          <p>CGST</p>
                          <p>SGST</p>
                          <p>Rounded Off</p>
                        </td>
                        <td className="border-r text-end border-black p-1 font-bold">
                          <p></p>
                          <p> </p>
                        </td>
                        <td className="border-r text-left border-black p-1 font-bold">
                          <p></p>
                          <p></p>
                        </td>{" "}
                        <td className="p-1 text-center border-r border-black"></td>
                        <td className="p-1 text-center border-r border-black"></td>
                        <td className=" text-end  p-1 font-bold">
                          <p>1,458.00</p>
                          <p>1,258.00</p>
                        </td>{" "}
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2 text-left"></td>
                        <td className="border-r text-end border-black p-2 font-bold"></td>
                        <td className="border-r border-black p-2 text-center"></td>
                        <td className="border-r border-black p-2 text-end font-semibold">
                          Total
                        </td>
                        <td className="border-r text-end border-black p-2 font-bold"></td>
                        <td className="p-1 text-center border-r border-black font-bold">
                          {" "}
                          12,825.000 Kgs
                        </td>
                        <td className="p-1 text-center border-r border-black"></td>
                        <td className="border-r text-left border-black p-2 font-bold"></td>{" "}
                        <td className=" text-end  p-2 font-bold ">
                          ₹ 19,116.00
                        </td>{" "}
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* //fifth */}
                <div className="text-[11px] mb-1">
                  <div className="flex justify-between">
                    <h2 className="items-start px-1">
                      Amount Chargeable (in words)
                    </h2>
                  </div>
                  <h2 className="font-bold px-1 text-sm">
                    {" "}
                    INR Fourteen Lakh Twelve Thousand One Hundred Sixty One Only
                  </h2>
                </div>
                {/* sixth */}

                <table className="w-full border-y border-black text-[11px]">
                  <thead className="leading-tight">
                    {" "}
                    <tr>
                      <th
                        className="border-r border-black px-2 py-0.5 text-center"
                        rowSpan={2}
                      >
                        HSN/SAC
                      </th>
                      <th
                        className="border-r border-black px-2  py-0.5 text-center"
                        rowSpan={2}
                      >
                        Taxable Value
                      </th>
                      <th
                        colSpan="2"
                        className="border-r border-b border-black px-2  py-1 text-center"
                      >
                        CGST
                      </th>
                      <th
                        colSpan="2"
                        className="border-r border-b border-black px-2 py-1 text-center"
                      >
                        SGST/UTGST
                      </th>
                      <th className="px-2 py-0.5 text-center" rowSpan={2}>
                        Total Tax Amount
                      </th>
                    </tr>
                    <tr className="border-b border-black">
                      <th className="border-r border-black px-2 py-1 text-center">
                        Rate
                      </th>
                      <th className="border-r border-black px-2 py-1 text-center">
                        Amount
                      </th>
                      <th className="border-r border-black px-2 py-1 text-center">
                        Rate
                      </th>
                      <th className="border-r border-black px-2 py-1 text-center">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="leading-tight text-[11px]">
                    <tr className="border-b border-black">
                      <td className="border-r border-black px-2 py-1 text-center">
                        9958
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        16,200.00
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        9%
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        1,458.00
                      </td>

                      <td className="border-r border-black px-2 py-1 text-center">
                        9%
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        1,458.00
                      </td>
                      <td className="px-2 py-1 text-center">2,916.00</td>
                    </tr>

                    <tr className="border-t border-black font-semibold leading-tight text-[11px]">
                      <td className="border-r border-black px-2 py-1 text-center">
                        Total
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        16,200.00
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center"></td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        1,458.00
                      </td>
                      <td className="border-r border-black px-2 py-1 text-center"></td>
                      <td className="border-r border-black px-2 py-1 text-center">
                        1,458.00
                      </td>
                      <td className="px-2 py-1 text-center">2,916.00</td>
                    </tr>
                  </tbody>
                </table>

                {/* //seven */}
                <div className="text-[11px] px-1 ">
                  <p>
                    {" "}
                    Tax Amount (in words) :{" "}
                    <span className="font-bold">
                      INR One Thousand Four Hundred Ten and Seventy Six paise
                      Only
                    </span>
                  </p>
                  {/* exight */}
                  <div className="grid grid-cols-2">
                    <div className="flex item items-end"></div>
                    <div className="mb-1">
                      Company's Bank Details
                      <p>
                        {" "}
                        A/c Holder’s Name
                        <span className="font-bold"> ADITYA TRADERS</span>
                      </p>
                      <p>
                        {" "}
                        Bank Name :
                        <span className="font-bold">
                          {" "}
                          UNION BANK OF INDIA -9390
                        </span>
                      </p>
                      <p>
                        {" "}
                        A/c No. :
                        <span className="font-bold"> 510101002469390 </span>
                      </p>
                      <p>
                        {" "}
                        Branch & IFS Code :
                        <span className="font-bold">
                          {" "}
                          KANDUKUR & UBIN0803049{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* //nine */}
                <div className="grid grid-cols-2">
                  <div>
                    <div className="px-1 mb-1">
                      <p>Declaration:</p>
                      <p>
                        We declare that this invoice shows the actual price of
                        the goods described and that all particulars are true
                        and
                      </p>
                    </div>
                  </div>
                  <div className="relative border-t border-l border-black h-20">
                    <p className="absolute top-0 right-0 p-1">
                      for ADITYA TRADERS
                    </p>
                    <div className="flex justify-center">
                      {/* <img
                        src={stamplogo}
                        alt="Seal"
                        className="w-full max-w-[80px] h-auto"
                      /> */}
                    </div>

                    <p className="absolute bottom-0 right-0 p-1">
                      {" "}
                      Authorised Signatory
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center ">
                {" "}
                <div>
                  {" "}
                  <p>This is a Computer Generated Invoice</p>
                </div>
              </div>
              <div className="page-break"></div>
              <div className="empty-page"></div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default TaxInvoice;
