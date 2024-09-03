"use client";
import InventoryTable from "@/components/InventoryTable";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TocIcon from "@mui/icons-material/Toc";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { Tooltip } from "@mui/material";

const Dashboard = () => {
  const router = useRouter();
  const dashboardCards = [
    {
      title: "Inventory",
      subtitle: "Keep an eye on stock levels?",
      description: "We Provide a Hassle-Free Inventory Management System.",
      icon: (
        <Tooltip title="View Inventory Items" placement="top">
          <TocIcon className="dash-icon" />
        </Tooltip>
      ),
      onClick: () => router.push("/inventory"),
      
    },
    {
      title: "Capture",
      subtitle: "Capture Inventory Items In Real-Time?",
      description: "Take A Picture of Product Label and Update your Inventory In Seconds.",
      icon: (
        <Tooltip title="Take a picture now" placement="top">
          <CameraAltIcon className="dash-icon" />
        </Tooltip>
      ),
      onClick: () => router.push("/cam"),
      
    },
    {
      title: "AI Inventory Management",
      subtitle: "Inventory Management Is A Hastle?",
      description: "Upload A Label and Our AI Search Engine Will Assist You.",
      icon: (
        <Tooltip title="Manage Inventory with AI" placement="top">
          <SmartToyIcon className="dash-icon" />
        </Tooltip>
      ),
      onClick: () => router.push("/search"),
 
    },
  ];
  return (
    <>
      <div className="mask"></div>
      <div
        className="dashboard-background"
        style={{ width: "100vw", display: "flex", justifyContent: "flex-end" }}
      >
        <div className="dashboard-card-container ">
          {dashboardCards.map((card, index) => (
            <div key={index} className={`dashboard-cards card${index + 1} text-focus-in`}>
              <h1 className={`dashboard-title text-focus-in`}>
                {card.title}
              </h1>

              <div
                style={{
                  height: "60%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p className="dashboard-subtitle text-focus-in">
                    {card.subtitle}
                  </p>
                  <p className="dashboard-description text-focus-in">
                    {card.description}
                  </p>
                </div>
                <div onClick={card.onClick}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
