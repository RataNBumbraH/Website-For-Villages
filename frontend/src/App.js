import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Villages from "./pages/Villages";
import Home from "./pages/Home";
import VillageDetails from "./pages/VillageDetails";

import AdminLayout from "./admin/adminLayout";
import AdminDashboard from "./admin/pages/adminDashboard";
import AdminVillages from "./admin/pages/adminVillages";
import AddVillage from "./admin/pages/addVillage";
import AdminUsers from "./admin/pages/adminUsers";
import AdminCampRequests from "./admin/pages/adminCampRequests";
import AdminFeedback from "./admin/pages/adminFeedback";
import EditVillage from "./admin/pages/editVillage";
import CreateCamp from "./admin/pages/CreateCamp";
import AdminAllRequests from "./admin/pages/adminAllRequests";
import AdminFeedbackHistory from "./admin/pages/adminFeedbackHistory";
import AdminCamps from "./admin/pages/adminCamps"

import AdminProtectedRoute from "./admin/pages/adminProtectRoute";
import VillageHeadProtectedRoute from "./admin/pages/villageheadprotectroute";

/* 🔥 NEW IMPORTS */
import VillageheadLayout from "./villagehead/VillageheadLayout";
import VillageheadDashboard from "./villagehead/pages/VillageheadDashboard";

/* ⭐ FEEDBACK PAGE IMPORT */
import SendFeedback from "./villagehead/pages/VillageheadFeedback";
import MyFeedback from "./villagehead/pages/MyFeedback";
import VillageCamps from "./pages/VillageCamps";
import CampGallery from "./pages/CampGallery";
import SendCampRequest from "./villagehead/pages/SendCampRequest";
import MyRequests from "./villagehead/pages/MyRequests";
import VillageheadCamps from "./villagehead/pages/Villageheadcamps";
import VillageAssign from "./admin/pages/VillageAssign";

import "./App.css";

function App() {
  return (
    <div className="web-background">
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/home/:userId" element={<Home />} />
        <Route path="/villages" element={<Villages />} />
        <Route path="/village/:id" element={<VillageDetails />} />
        <Route path="/villagedetails" element={<VillageDetails />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="villages" element={<AdminVillages />} />
          <Route path="addvillage" element={<AddVillage />} />
          <Route path="editvillage/:id" element={<EditVillage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="camp-request" element={<AdminCampRequests />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="create-camp" element={<CreateCamp />} />
          <Route path="assign-village" element={<VillageAssign />} />
          <Route path="/admin/all-requests" element={<AdminAllRequests />} />
          <Route path="/admin/feedback/replied" element={<AdminFeedbackHistory />} />
          <Route path="/admin/camps" element={<AdminCamps/>}/>
        </Route>

        {/* ================= VILLAGEHEAD PANEL ================= */}
        <Route
          path="/villagehead"
          element={
            <VillageHeadProtectedRoute>
              <VillageheadLayout />
            </VillageHeadProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<VillageheadDashboard />} />
          <Route path="camp-request" element={<SendCampRequest />} />
          <Route path="my-request" element={<MyRequests />} />
          <Route path="camps" element={<VillageheadCamps />} />

          {/* ⭐ FEEDBACK ROUTE ADDED */}
          <Route path="feedback" element={<SendFeedback />} />
          <Route path="my-feedback" element={<MyFeedback />} />
        </Route>

        {/* ================= OTHER ROUTES ================= */}
        <Route path="/village/:id/camps" element={<VillageCamps />} />
        <Route path="/camp/:id" element={<CampGallery />} />

      </Routes>
    </div>
  );
}

export default App;