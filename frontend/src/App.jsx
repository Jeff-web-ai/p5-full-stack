import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "@/components/Header";
// public pages
import Page from "./components/homepage/Page";
import Login from "./components/pages/customer/Login/Login";
import Registration from "./components/pages/customer/Register/Registration";

// Customer pages
import CustomerDashboard from "./components/pages/customer/CustomerDashboard";
import RequestService from "./components/pages/customer/RequestService";
import CustomerProfile from "./components/pages/customer/CustomerProfile";
import UpdateCustomerProfile from "./components/pages/customer/UpdateCustomerProfile";
import ChangePassword from "./components/pages/customer/ChangePassword";
import Feedback from "./components/pages/customer/Feedback";
import CustomerDetail from "./components/pages/customer/CustomerDetail";

// Store pages
import DashboardStore from "./components/pages/store/DashboardStore";
import JobStatusUpdate from "./components/pages/store/JobStatusUpdate";
import ServiceDetail from "./components/pages/store/ServiceDetail";
import StoreProfile from "./components/pages/store/StoreProfile";
import UpdateStoreProfile from "./components/pages/store/UpdateStoreProfile";
import CompletedJobsHistory from "./components/pages/store/CompletedJobsHistory";

// Admin pages
import AdminDashboard from "./components/pages/admin/Dashboard/AdminDashboard";

import AdminCreateUser from "./components/pages/admin/Users/AdminCreateUser";
import AdminCustomerDashboard from "./components/pages/admin/Users/AdminCustomerDashboard";
import AdminStoreDashboard from "./components/pages/admin/Users/AdminStoreDashBoard";
import UpdateCustomerDetails from "./components/pages/admin/Users/UpdateCustomerDetails";
import UpdateStoreDetails from "./components/pages/admin/Users/UpdateStoreDetails";
import ViewCustomerDetails from "./components/pages/admin/Users/ViewCustomerDetails";
import ViewStoreDetails from "./components/pages/admin/Users/ViewStoreDetails";

import AddService from "./components/pages/admin/Service/AddService";
import GetService from "./components/pages/admin/Service/GetService";
import UpdateService from "./components/pages/admin/Service/UpdateService";

import Jobs from "./components/pages/admin/Job/Jobs";
import CreateJob from "./components/pages/admin/Job/CreateJob";
import Update from "./components/pages/admin/Job/Update";
import ServiceDetails from "./components/pages/admin/Service/ServiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-non-user" element={<Registration />} />

        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/request-service" element={<RequestService />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route
          path="/customer/profile/update"
          element={<UpdateCustomerProfile />}
        />
        <Route
          path="/customer/profile/change-password"
          element={<ChangePassword />}
        />
        <Route path="/customer/feedback/:requestId" element={<Feedback />} />
        <Route path="/customer/detail/:id" element={<CustomerDetail />} />

        <Route path="/store-dashboard" element={<DashboardStore />} />
        <Route path="/store-job-status" element={<JobStatusUpdate />} />
        <Route path="/store/service/:id" element={<ServiceDetail />} />
        <Route path="/store-profile" element={<StoreProfile />} />
        <Route path="/store/update-profile" element={<UpdateStoreProfile />} />
        <Route
          path="/store-completed-jobs"
          element={<CompletedJobsHistory />}
        />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/create-user" element={<AdminCreateUser />} />
        <Route path="/admin/customers" element={<AdminCustomerDashboard />} />
        <Route path="/admin/stores" element={<AdminStoreDashboard />} />
        <Route
          path="/admin/view-store/:storeId"
          element={<ViewStoreDetails />}
        />
        <Route
          path="/admin/view-customer/:customerId"
          element={<ViewCustomerDetails />}
        />
        <Route
          path="/admin/update-customer/:costumerId"
          element={<UpdateCustomerDetails />}
        />
        <Route
          path="/admin/update-store/:storeId"
          element={<UpdateStoreDetails />}
        />

        <Route path="/admin/services" element={<GetService />} />
        <Route path="/admin/create-service" element={<AddService />} />
        <Route
          path="/admin/view-service/:serviceId"
          element={<ServiceDetails />}
        />
        <Route
          path="/admin/update-service/:serviceId"
          element={<UpdateService />}
        />

        <Route path="/admin/jobs" element={<Jobs />} />
        <Route path="/admin/create-job" element={<CreateJob />} />
        <Route path="/admin/update-job/:jobId" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
