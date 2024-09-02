"use client";
import InventoryTable from "@/components/InventoryTable";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SearchIcon from "@mui/icons-material/Search";
import TocIcon from "@mui/icons-material/Toc";
import { useRouter } from "next/navigation";
import "../../globals.css"

const Dashboard = () => {
  const router = useRouter();
  const dashboardCards = [
    {
      title: "Inventory",
      subtitle: "Keep an eye on stock levels?",
      description: "We Provide a Hassle-Free Inventory Management System.",
      icon: <TocIcon className="dash-icon" />,
      onClick: () => router.push("/inventory"),
      animationClass: "tracking-in-expand",
    },
    {
      title: "Capture",
      subtitle: "Capture Inventory Items In Real-Time?",
      description: "Take A Picture Now.",
      icon: (
        <CameraAltIcon className="dash-icon"  />
      ),
      onClick: () => router.push("/cam"),
      animationClass: "tracking-in-expand2",
    },
    {
      title: "AI Inventory Management",
      subtitle: "Inventory management is a hastle?",
      description: "Upload A Label and Our AI Search Engine Will Assist You",
      icon: <SearchIcon className="dash-icon"  />,
      onClick: () => router.push("/search"),
      animationClass: "tracking-in-expand3",
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
            <div key={index} className={`dashboard-cards card${index + 1}`}>
              <h1 className={`dashboard-title ${card.animationClass}`}>
                {card.title}
              </h1>

              <div style={{height:"60%", display:"flex", flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <p className="dashboard-subtitle text-focus-in">
                    {card.subtitle}
                  </p>
                  <p className="dashboard-description text-focus-in">
                    {card.description}
                  </p>
                </div>
                <div  onClick={card.onClick}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
