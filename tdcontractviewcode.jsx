import { getTodayDate } from "@/utils/currentDate";
import moment from "moment";
import React from "react";

const ContractViewPdf = ({ contractData, showSignature, signPdf }) => {
  return (
    <div className="max-w-4xl mx-auto print:border-l print:border-r print:border-b print:border-black p-4">
      <table className="w-full mb-2">
        <tr>
          <td className="w-1/2 align-top">
            <h2 className="font-semibold text-[12px]">
              Buyer: {contractData?.contract?.contract_buyer}
            </h2>
            <div className="ml-4 text-[12px]">
              {contractData?.contract?.contract_buyer_add
                ?.split(/(.{32})/)
                .filter(Boolean)
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>
          </td>
          <td className="w-1/2 align-top text-right">
            <h2 className="font-semibold text-[12px]">
              CONSIGNEE: {contractData?.contract?.contract_consignee}
            </h2>
            <div className="text-[12px]">
              {contractData?.contract?.contract_consignee_add
                ?.split(/(.{32})/)
                .filter(Boolean)
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>
          </td>
        </tr>
      </table>

      <table className="w-full bg-white border border-gray-300 text-[12px] table-fixed">
        <tbody className="divide-y divide-gray-200">
          {contractData.contractSub.map((sub) => (
            <tr key={sub.id}>
              <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                {sub.contractSub_marking}
              </td>
              <td className="border w-[30%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                {sub.contractSub_descriptionofGoods}
              </td>
              <td className="border w-[20%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                {sub.contractSub_packing} KG NET IN {sub.contractSub_bagsize}{" "}
                {sub.contractSub_sbaga}
              </td>
              <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                {sub.contractSub_qntyInMt} MTS
              </td>
              <td className="border w-[10%] text-[12px] border-black p-2 text-sm text-gray-900 break-words">
                {sub.contractSub_rateMT} USD/MTS
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full text-[12px] mt-2">
        <tr>
          <td className="w-1/4">Container</td>
          <td className="w-1">:</td>
          <td className="w-3/4">{contractData?.contract?.contract_container_size}</td>
        </tr>
        <tr>
          <td className="w-1/4">Specification (If Any)</td>
          <td className="w-1">:</td>
          <td className="w-3/4">{contractData?.contract.contract_specification1}</td>
        </tr>
        {contractData?.contract?.contract_specification2 && (
          <tr>
            <td className="w-1/4"></td>
            <td className="w-1">:</td>
            <td className="w-3/4">{contractData?.contract.contract_specification2}</td>
          </tr>
        )}
        <tr>
          <td className="w-1/4">Terms Of Payment</td>
          <td className="w-1">:</td>
          <td className="w-3/4">{contractData?.contract?.contract_payment_terms}</td>
        </tr>
      </table>

      <table className="w-full text-[12px] mt-2">
        <tr>
          <td className="w-1/4">Shipment</td>
          <td className="w-1">:</td>
          <td className="w-3/4">
            ON OR BEFORE -{" "}
            {moment(contractData?.contract?.contract_ship_date).format(
              "DD-MMM-YYYY"
            )}
          </td>
        </tr>
        <tr>
          <td className="w-1/4">Port of Loading</td>
          <td className="w-1">:</td>
          <td className="w-3/4">
            {contractData?.contract?.contract_loading}, INDIA
          </td>
        </tr>
        <tr>
          <td className="w-1/4">Port of Discharge</td>
          <td className="w-1">:</td>
          <td className="w-3/4">
            {contractData?.contract?.contract_discharge},{" "}
            {contractData?.contract?.contract_destination_country}
          </td>
        </tr>
      </table>

      <div className="w-fit text-[12px] ml-[2%] border-b border-black pt-2 mb-2">
        <p className="font-semibold">
          In Case of Shipment via Direct Vessel by Hyundai Liners:
        </p>
        <hr className="mt-2 border-0 h-[0.5px] bg-black" />
      </div>

      <table className="w-full text-[12px]">
        <tr>
          <td className="w-1/4">Port of Loading</td>
          <td className="w-1">:</td>
          <td className="w-3/4">
            {contractData?.contract?.contract_loading}, INDIA
          </td>
        </tr>
        <tr>
          <td className="w-1/4">Port of Discharge</td>
          <td className="w-1">:</td>
          <td className="w-3/4">
            {contractData?.contract?.contract_discharge},{" "}
            {contractData?.contract?.contract_destination_country}
          </td>
        </tr>
        <tr>
          <td className="w-1/4">Special Remarks</td>
          <td className="w-1">:</td>
          <td className="w-3/4">{contractData?.contract?.contract_remarks}</td>
        </tr>
        {!contractData?.contract?.contract_shipment && (
          <tr>
            <td className="w-1/4">Shipper's Bank</td>
            <td className="w-1">:</td>
            <td className="w-3/4">
              {contractData?.contract?.contract_shipment}
            </td>
          </tr>
        )}
      </table>

      {contractData?.contract?.contract_shipment != null && (
        <>
          <div className="w-fit border-b border-black text-[12px] ml-[2%] pt-2 mb-1">
            <p className="font-semibold">Bank Details:</p>
            <hr className="mt-2 border-0 h-[0.5px] bg-black" />
          </div>
          <table className="w-full text-[12px]">
            <tr>
              <td className="w-1/4">Account Name</td>
              <td className="w-1">:</td>
              <td className="w-3/4">{localStorage.getItem("companyName")}</td>
            </tr>
            <tr>
              <td className="w-1/4">Bank</td>
              <td className="w-1">:</td>
              <td className="w-3/4">{contractData?.bank?.bank_name}</td>
            </tr>
            <tr>
              <td className="w-1/4">Branch</td>
              <td className="w-1">:</td>
              <td className="w-3/4">{contractData?.bank?.bank_branch}</td>
            </tr>
            <tr>
              <td className="w-1/4">Account No</td>
              <td className="w-1">:</td>
              <td className="w-3/4">{contractData?.bank?.bank_acc_no}</td>
            </tr>
            <tr>
              <td className="w-1/4">Shift Code</td>
              <td className="w-1">:</td>
              <td className="w-3/4">{contractData?.bank?.bank_ifsc_code}</td>
            </tr>
          </table>
        </>
      )}

      <div className="w-fit border-b border-black text-[12px] ml-[2%] pt-2 mb-1">
        <p className="font-semibold">
          Kindly Mail your Purchase Order at the earliest.
        </p>
        <hr className="mt-2 border-0 h-[0.5px] bg-black" />
      </div>

      <table className="w-full text-[12px] ml-[2%] pt-2">
        <tr>
          <td colSpan="3">Thanks & regards,</td>
        </tr>
        <tr>
          <td>For {contractData?.contract?.branch_name} (Seller)</td>
          <td></td>
          <td className="text-right mr-[22%]">(Buyer)</td>
        </tr>
      </table>

      <div className="relative text-[12px] ml-[2%] w-[98%] pt-2">
        <table className="w-full mt-10">
          <tr>
            <td className="w-1/2">
              <div className="flex flex-col border-t-2 w-[18rem] border-black items-center">
                <p>{contractData?.branch?.branch_sign_name}</p>
                {showSignature && (
                  <img
                    src={`${signPdf}/${contractData.branch.branch_sign}`}
                    alt="logo"
                    className="w-[120px] h-auto absolute print-hide -top-10"
                  />
                )}
                <p>HP : {contractData?.branch?.branch_sign_no}</p>
              </div>
            </td>
            <td className="w-1/2">
              <div className="flex flex-col border-t-2 w-[18rem] border-black items-center float-right mr-[7%]">
                <p>Accepted with Co Seal</p>
                <p>
                  {contractData?.contract?.contract_date
                    ? moment(contractData?.contract?.contract_date).format(
                        "DD-MM-YYYY"
                      )
                    : ""}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default ContractViewPdf;