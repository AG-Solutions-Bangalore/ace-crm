import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";

import ContractList from "./app/contract/ContractList";
import ContractAdd from "./app/contract/ContractAdd";
import InvoiceList from "./app/invoice/InvoiceList";
import InvoiceAdd from "./app/invoice/InvoiceAdd";


const queryClient = new QueryClient()

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
        <Route path="/invoice" element={<InvoiceList />} />
        <Route path="/create-invoice" element={<InvoiceAdd />} />
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
