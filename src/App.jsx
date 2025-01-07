import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";

import CustomerList from "./app/customer/CustomerList";
import ProductList from "./app/product/ProductList";
import EnquiryList from "./app/enquiry/EnquiryList";


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
        {/* Registration  */}
        <Route path="/customers" element={<CustomerList />} />
        {/* customer  */}
        <Route path="/products" element={<ProductList />} />
        {/* enquiry */}
        <Route path="/enquiries" element={<EnquiryList />} />
       
        
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
