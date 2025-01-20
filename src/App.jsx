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
import DescriptionGoodsList from "./app/master/descriptionGoods/DescriptionGoodsList";
import BagTypeList from "./app/master/bagType/BagTypeList";
import CustomDescription from "./app/master/customDescription/CustomDescription";

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
          {/* Invoice  */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/create-invoice" element={<InvoiceAdd />} />

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
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
