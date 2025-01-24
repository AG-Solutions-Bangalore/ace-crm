import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";

import ContractList from "./app/contract/ContractList";
import ContractAdd from "./app/contract/ContractAdd";
import InvoiceList from "./app/invoice/InvoiceList";
import InvoiceAdd from "./app/invoice/InvoiceAdd";
import BranchList from "./app/master/branch/BranchList";
import CreateBranch from "./app/master/branch/CreateBranch";
import EditBranch from "./app/master/branch/EditBranch";
import StateList from "./app/master/state/StateList";
import BankList from "./app/master/bank/BankList";
import SchemeList from "./app/master/scheme/SchemeList";
import CountryList from "./app/master/country/CountryList";
import ContainerSizeList from "./app/master/ContainerSize/ContainerSizeList";
import PaymentTermCList from "./app/master/paymentTermC/PaymentTermCList";
import ItemList from "./app/master/item/ItemList";
import MarkingList from "./app/master/marking/MarkingList";
import DescriptionGoodsList from "./app/master/descriptionGoods/DescriptionGoodsList";
import CustomDescription from "./app/master/customDescription/CustomDescription";
import BagTypeList from "./app/master/bagType/BagTypeList";
import TypeList from "./app/master/type/TypeList";
import QualityList from "./app/master/quality/QualityList";
import ViewContract from "./app/contract/ViewContract";
import EditContract from "./app/contract/EditContract";
import Buyer from "./app/reports/buyer/Buyer";
import ContractForm from "./app/reports/contract/ContractForm";
import ContractReport from "./app/reports/contract/ContractReport";
import PreshipmentDetails from "./app/invoice/PreshipmentDetails";
import InvoiceTabs from "./app/invoice/InvoiceTabs";
import PortOfLoadingList from "./app/master/portofLoading/PortofLoadingList";
import GrCodeList from "./app/master/grcode/GrCodeList";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          {/* Login Page        */}
          <Route path="/" element={<Login />} />
          {/* Dashboard  */}
          <Route path="/home" element={<Home />} />
          {/* Contract  */}
          <Route path="/contract" element={<ContractList />} />
          <Route path="/create-contract" element={<ContractAdd />} />
          <Route path="/view-contract/:id" element={<ViewContract />} />
          <Route path="/edit-contract/:id" element={<EditContract />} />
          {/* Invoice  */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/create-invoice" element={<InvoiceAdd />} />
          <Route path="/view-invoice/:id" element={<InvoiceTabs />} />

          {/* Master - Branch  */}

          <Route path="/branch" element={<BranchList />} />
          <Route path="/create-branch" element={<CreateBranch />} />
          <Route path="/edit-branch/:id" element={<EditBranch />} />

          {/* Master -State  */}
          <Route path="/state" element={<StateList />} />
          {/* Master -  Bank */}
          <Route path="/bank" element={<BankList />} />
          {/* Master Scheme  */}
          <Route path="/scheme" element={<SchemeList />} />

          {/* Master -Country */}
          <Route path="/country" element={<CountryList />} />
          {/* Master -ContainerSize */}
          <Route path="/containersize" element={<ContainerSizeList />} />
          {/* Master -Payment Term C */}
          <Route path="/paymentTermC" element={<PaymentTermCList />} />
          {/* Master -Description of Goods */}
          <Route path="/descriptionGoods" element={<DescriptionGoodsList />} />
          {/* Master -Bag List */}
          <Route path="/bagType" element={<BagTypeList />} />
          {/* Master -customdescription */}
          <Route path="/customdescription" element={<CustomDescription />} />
          {/* Master -items */}
          <Route path="/item" element={<ItemList />} />
          {/* Master -marking */}
          <Route path="/marking" element={<MarkingList />} />
          {/* Master -typelist */}
          <Route path="/type" element={<TypeList />} />
          {/* Master -Quality  */}
          <Route path="/quality" element={<QualityList />} />
          {/* Master -port of  loading   */}
          <Route path="/portofloading" element={<PortOfLoadingList />} />
          {/* Master -gr code */}
          <Route path="/grcode" element={<GrCodeList />} />

          {/* //Reports */}
          {/* Reports -Buyer  */}
          <Route path="/buyer-report" element={<Buyer />} />
          <Route path="/contract-form" element={<ContractForm />} />
          <Route path="/contract-report" element={<ContractReport />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
