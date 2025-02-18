import Login from "./app/auth/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import InvoiceView from "./app/invoice/InvoiceView";
import InvoiceEdit from "./app/invoice/InvoiceEdit";
import InvoiceTabs from "./app/invoice/InvoiceTabs";
import PortOfLoadingList from "./app/master/portofLoading/PortofLoadingList";
import GrCodeList from "./app/master/grcode/GrCodeList";
import ProductList from "./app/master/product/ProductList";
import ProductionDescriptionList from "./app/master/productDescription/ProductionDescriptionList";
import ShipperList from "./app/master/shipper/ShipperList";
import VesselList from "./app/master/vessel/VesselList";
import PreReceiptList from "./app/master/preReceipt/PreReceiptList";
import TestViewPrint from "./app/contract/TestViewPrint";
import InvoiceDocumentEdit from "./app/invoice/InvoiceDocumentEdit";
import UserPage from "./app/userManagement/UserPage";
import ManagementDashboard from "./app/userManagement/ManagementDashboard";
import CreatePage from "./app/userManagement/CreatePage";
import CreateButton from "./app/userManagement/CreateButton";
import UserTypeList from "./app/UserType/UserTypeList";
import EditUserType from "./app/UserType/EditUserType";
// import PaymentView from "./app/payment/PaymentView";
// import PaymentList from "./app/payment/PaymentList";
// import CreatePayment from "./app/payment/CreatePayment";
import SalesAccountForm from "./app/reports/salesAccount/SalesAccountForm";
import SalesAccountReport from "./app/reports/salesAccount/SalesAccountReport";
import SalesDataForm from "./app/reports/salesData/SalesDataForm";
import SalesDataReport from "./app/reports/salesData/SalesDataReport";
import PaymentView from "./payment/PaymentList/PaymentView";
import PaymentList from "./payment/PaymentList/PaymentList";
import CreatePayment from "./payment/PaymentList/CreatePayment";
import PaymentPending from "./payment/PaymentPending/PaymentPending";
import PaymentClose from "./payment/PaymentClose/PaymentClose";
import EditPaymentList from "./payment/PaymentList/EditPaymentList";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import VendorList from "./app/master/vendor/VendorList";
import CreateVendor from "./app/master/vendor/CreateVendor";
import PurchaseOrderList from "./app/purchaseOrder/PurchaseOrderList";
import PurchaseProductList from "./app/master/purchaseProduct/PurchaseProductList";
import VendorEdit from "./app/master/vendor/VendorEdit";
import CreatePurchaseOrder from "./app/purchaseOrder/CreatePurchaseOrder";

import ViewPurchaseOrder from "./app/purchaseOrder/ViewPurchaseOrder";
import BuyerList from "./app/master/buyer/BuyerList";
import MonthwisePurchaseForm from "./app/reports/monthwisePurchase/MonthwisePurchaseForm";
import MonthwisePurchaseReport from "./app/reports/monthwisePurchase/MonthwisePurchaseReport";
import SessionTimeoutTracker from "./components/SessionTimeoutTracker/SessionTimeoutTracker";
import BASE_URL from "./config/BaseUrl";
import MarketDispatch from "./app/purchase/market-dispatch/MarketDispatch";
import MarketProcessing from "./app/purchase/marketProcessing/MarketProcessing";
import MarketProduction from "./app/purchase/marketProduction/MarketProduction";
import MarketPurchase from "./app/purchase/marketPurchase/MarketPurchase";
import CreateMarketOrder from "./app/purchase/marketPurchase/CreateMarketOrder";
import EditMarketOrder from "./app/purchase/marketPurchase/EditMarketOrder";
import CreateMarketProduction from "./app/purchase/marketProduction/CreateMarketProduction";
import EditMarketProduction from "./app/purchase/marketProduction/EditMarketProduction";

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/panel-logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Logout successful:", result);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <SessionTimeoutTracker
          expiryTime="2025-02-18 11:55:47"
          onLogout={handleLogout}
        />
        <Routes>
          {/* Login Page        */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Dashboard  */}
          <Route path="/home" element={<Home />} />
          {/* Contract  */}
          <Route path="/contract" element={<ContractList />} />
          <Route path="/create-contract" element={<ContractAdd />} />
          <Route path="/view-contract/:id" element={<ViewContract />} />
          <Route path="/tesview-contract/:id" element={<TestViewPrint />} />
          <Route path="/edit-contract/:id" element={<EditContract />} />
          {/* Invoice  */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/create-invoice" element={<InvoiceAdd />} />
          <Route path="/edit-invoice/:id" element={<InvoiceEdit />} />
          <Route
            path="/document-edit-invoice/:id"
            element={<InvoiceDocumentEdit />}
          />
          <Route path="/view-invoice/:id" element={<InvoiceTabs />} />

          {/* purchase   */}
          {/* pruchase - purchase order  */}
          <Route path="/purchase-order" element={<PurchaseOrderList />} />
          <Route
            path="/create-purchase-order"
            element={<CreatePurchaseOrder />}
          />
          <Route path="/view-purchase-order" element={<ViewPurchaseOrder />} />

          {/* purchase -market purchase  */}
          <Route
            path="/purchase/market-purchase"
            element={<MarketPurchase />}
          />
          <Route path="/create-market-order" element={<CreateMarketOrder />} />
          <Route path="/edit-market-order/:id" element={<EditMarketOrder />} />

          {/* purchase -market production */}
          <Route
            path="/purchase/market-production"
            element={<MarketProduction />}
          />

          <Route
            path="/create-market-production"
            element={<CreateMarketProduction />}
          />

          <Route
            path="/edit-market-production/:id"
            element={<EditMarketProduction />}
          />

          {/* purchase -market processing  */}
          <Route
            path="/purchase/market-processing"
            element={<MarketProcessing />}
          />
          {/* purchase -market dispatch  */}

          <Route
            path="/purchase/market-dispatch"
            element={<MarketDispatch />}
          />

          {/* Master - Branch  */}

          <Route path="/master/branch" element={<BranchList />} />
          <Route path="/create-branch" element={<CreateBranch />} />
          <Route path="/edit-branch/:id" element={<EditBranch />} />

          {/* Master -State  */}
          <Route path="/master/state" element={<StateList />} />
          {/* Master -  Bank */}
          <Route path="/master/bank" element={<BankList />} />
          {/* master -buyer  */}
          <Route path="/master/buyer" element={<BuyerList />} />
          {/* Master Scheme  */}
          <Route path="/master/scheme" element={<SchemeList />} />

          {/* Master -Country */}
          <Route path="/master/country" element={<CountryList />} />
          {/* Master -ContainerSize */}
          <Route path="/master/containersize" element={<ContainerSizeList />} />
          {/* Master -Payment Term C */}
          <Route path="/master/paymentTermC" element={<PaymentTermCList />} />
          {/* Master -Description of Goods */}
          <Route
            path="/master/descriptionGoods"
            element={<DescriptionGoodsList />}
          />
          {/* Master -Bag List */}
          <Route path="/master/bagType" element={<BagTypeList />} />
          {/* Master -customdescription */}
          <Route
            path="/master/customdescription"
            element={<CustomDescription />}
          />
          {/* Master -items */}
          <Route path="/master/item" element={<ItemList />} />
          {/* Master -marking */}
          <Route path="/master/marking" element={<MarkingList />} />
          {/* Master -typelist */}
          <Route path="/master/type" element={<TypeList />} />
          {/* Master -Quality  */}
          <Route path="/master/quality" element={<QualityList />} />
          {/* Master -port of  loading   */}
          <Route path="/master/portofloading" element={<PortOfLoadingList />} />
          {/* Master -gr code */}
          <Route path="/master/grcode" element={<GrCodeList />} />
          {/* Master - Product */}
          <Route path="/master/product" element={<ProductList />} />
          {/* Master - productdescription */}
          <Route
            path="/master/productdescription"
            element={<ProductionDescriptionList />}
          />
          {/* Master - shipper */}
          <Route path="/master/shipper" element={<ShipperList />} />
          {/* Master - vessel */}
          <Route path="/master/vessel" element={<VesselList />} />
          {/* Master - prerecepits*/}
          <Route path="/master/prerecepits" element={<PreReceiptList />} />
          {/* master - v */}
          <Route path="/master/vendor" element={<VendorList />} />
          <Route
            path="/master/vendor/create-vendor"
            element={<CreateVendor />}
          />
          <Route
            path="/master/vendor/edit-vendor/:id"
            element={<VendorEdit />}
          />

          {/* master purchase product  */}
          <Route
            path="/master/purchase-product"
            element={<PurchaseProductList />}
          />

          {/* Reports -Buyer  */}
          <Route path="/report/buyer-report" element={<Buyer />} />
          <Route path="/report/contract-form" element={<ContractForm />} />
          <Route path="/report/contract-report" element={<ContractReport />} />

          {/* report - sales account  */}
          <Route
            path="/report/sales-account-form"
            element={<SalesAccountForm />}
          />

          <Route
            path="/report/sales-account-report"
            element={<SalesAccountReport />}
          />
          {/* report sales data  */}
          <Route path="/report/sales-data-form" element={<SalesDataForm />} />
          <Route
            path="/report/sales-data-report"
            element={<SalesDataReport />}
          />

          {/* report monthwise purchase  */}
          <Route
            path="/report/monthwise-purchase-form"
            element={<MonthwisePurchaseForm />}
          />
          <Route
            path="/report/monthwise-purchase-report"
            element={<MonthwisePurchaseReport />}
          />

          {/* //payment */}
          <Route path="/payment-payment-list" element={<PaymentList />} />
          <Route path="/payment-view/:id" element={<PaymentView />} />
          <Route path="/payment-create" element={<CreatePayment />} />
          <Route path="/payment-edit/:id" element={<EditPaymentList />} />
          <Route path="/payment-payment-pending" element={<PaymentPending />} />
          <Route path="/payment-payment-close" element={<PaymentClose />} />

          {/* //management */}
          <Route path="/userManagement" element={<UserPage />} />
          <Route
            path="/management-dashboard/:id"
            element={<ManagementDashboard />}
          />
          <Route path="/page-management" element={<CreatePage />} />
          <Route path="/button-management" element={<CreateButton />} />
          {/* //usertype */}
          <Route path="/user-type" element={<UserTypeList />} />
          <Route path="/edit-user-type/:id" element={<EditUserType />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
