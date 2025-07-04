import { getTodayDate } from "@/utils/currentDate";
import moment from "moment";
import React from "react";

const ContractViewPntWthHeader = ({ contractData, SIGN_IN_PURCHASE }) => {
  return (
    <div className="max-w-4xl mx-auto  print:border-l print:border-r print:border-b print:border-black  p-4">
      <div className=" mb-2 flex items-center   justify-between   w-full gap-5">
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
                  {sub.contractSub_packing} KG NET IN {sub.contractSub_bagsize}{" "}
                  {sub.contractSub_sbaga}
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
      <div className="text-[12px] mt-2 ml-[2%] w-[98%] flex flex-col items-start ">
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
          <span className="w-1/4 text-left">Specification (If Any)</span>
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
          <span className="w-1/4 text-left">Terms Of Payment</span>
          <span className="w-1 text-center">:</span>
          <p className="w-3/4">
            {contractData?.contract?.contract_payment_terms}
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
      <div className="text-[12px] mt-2 ml-[2%] w-[98%] flex flex-col items-start ">
        {/* Shipment */}
        <div className="flex items-center gap-4 w-full">
          <span className="w-1/4 text-left">Shipment</span>
          <span className="w-1 text-center">:</span>
          <p className="w-3/4">
            ON OR BEFORE -
            {moment(contractData?.contract?.contract_ship_date).format(
              "DD-MMM-YYYY"
            )}
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

      <div className=" w-fit text-[12px] ml-[2%]   border-b border-black  pt-2 mb-2">
        <p className="font-semibold">
          In Case of Shipment via Direct Vessel by Hyundai Liners:
        </p>
        <hr className="mt-2 border-0 h-[0.5px] bg-black" />
      </div>

      <div className="text-[12px]  ml-[2%] w-[98%] flex flex-col items-start ">
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
          <p className="w-3/4">{contractData?.contract?.contract_remarks}</p>
        </div>

        {/* Shipper's Bank -- if ship_date is not avaiilbe than show remove - */}
        {!contractData?.contract?.contract_shipment && (
          <div className="flex items-center gap-4 w-full">
            <span className="w-1/4 text-left">Shipper's Bank</span>
            <span className="w-1 text-center">:</span>
            <p className="w-3/4">
              {/* {moment(contractData?.contract?.contract_ship_date).format(
              "DD-MMM-YYYY"
            )}
            {contractData?.contract?.contract_ship_date && " - "} */}

              {contractData?.contract?.contract_shipment}
            </p>
          </div>
        )}
      </div>

      {/* add extra start  */}
      {contractData?.contract?.contract_shipment != null && (
        <>
           <div className=" w-fit border-b border-black  text-[12px] ml-[2%]    pt-2 mb-1">
        <p className="font-semibold">
     Bank Details:
        </p>
        <hr className="mt-2 border-0 h-[0.5px] bg-black" />
      </div>



          <div className="text-[12px]  ml-[2%] w-[98%] flex flex-col items-start ">
            {/* Name  */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Name</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">{localStorage.getItem("companyName")}</p>
            </div>
            {/* bank  */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Bank</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">{contractData?.bank?.bank_name}</p>
            </div>

            {/* Branch  */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Branch</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">{contractData?.bank?.bank_branch}</p>
            </div>
            {/* Account No  */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Account No</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">{contractData?.bank?.bank_acc_no}</p>
            </div>
            {/* Shift Code  */}
            <div className="flex items-center gap-4 w-full">
              <span className="w-1/4 text-left">Shift Code</span>
              <span className="w-1 text-center">:</span>
              <p className="w-3/4">{contractData?.bank?.bank_ifsc_code}</p>
            </div>
          </div>
        </>
      )}

      {/* add extra end  */}
      <div className=" w-fit border-b border-black  text-[12px] ml-[2%]    pt-2 mb-1">
        <p className="font-semibold">
          Kindly Mail your Purchase Order at the earliest.
        </p>
        <hr className="mt-2 border-0 h-[0.5px] bg-black" />
      </div>

      <div className="  text-[12px] ml-[2%]  w-[98%] pt-2">
        <p>Thanks & regards,</p>
        <div className="  flex items-center justify-between">
          <p>For {contractData?.contract?.branch_name} (Seller)</p>
          <p className=" mr-[22%]">(Buyer)</p>
        </div>
      </div>
      <div className=" relative text-[12px] ml-[2%]   w-[98%] pt-2">
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
            {contractData?.contract?.contract_date
              ? moment(contractData?.contract?.contract_date).format(
                  "DD-MM-YYYY"
                )
              : ""}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractViewPntWthHeader;
