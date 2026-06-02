import VillageHeadSidebar from "./components/villageheadSidebar";
import { Outlet } from "react-router-dom";

export default function VillageHeadLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <VillageHeadSidebar />

      {/* Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f3f4f6" }}>
        <Outlet />
      </div>

    </div>
  );
}