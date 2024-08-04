'use client'
import InventoryTable from "@/components/InventoryTable";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SearchIcon from '@mui/icons-material/Search';
import TocIcon from '@mui/icons-material/Toc';
import { useRouter } from "next/navigation";
const Dashboard = () => {
  const router=useRouter()
  return (
    <>
      <div className="mask"></div>
      <div
        className="dashboard-background"
        style={{ width: "100vw", display: "flex", justifyContent: "flex-end" }}
      >
        <div className="dashboard-card-container">
          <div className="dashboard-cards card1">
            <div className=" tracking-in-expand">
              <h1 className="dashboard-title">INVENTORY</h1>
            </div>
            <div>
              <h4 className="dashboard-subtitle text-focus-in">
                Keep an eye on stock levels?
              </h4>
              <h4 className="dashboard-description text-focus-in">
                We Provide a Hassle-Free Inventory Management System.
              </h4>
            </div>
            <TocIcon className="dash-icon" onClick={()=>router.push("/inventory")}/>
          </div>
          <div className="dashboard-cards card2">
            <div className="tracking-in-expand2">
              <h1 className="dashboard-title">CAPTURE</h1>
            </div>
            <div>
              <h4 className="dashboard-subtitle text-focus-in">
                Capture Inventory Items In Real-Time?
              </h4>
              <h4 className="dashboard-description text-focus-in">
                {/* Connect To Your Phone To  */}
                Take A Picture Now.
              </h4>
            </div>
            <CameraAltIcon className="dash-icon" onClick={()=>router.push("/cam")}/>
          </div>
          <div className="dashboard-cards card3">
            <div className="tracking-in-expand3">
              <h1 className="dashboard-title ">AI SEARCH</h1>
            </div>
            <div>
              <h4 className="dashboard-subtitle text-focus-in">
                Finding Something Specific?
              </h4>
              <h4 className="dashboard-description text-focus-in">
                Upload A Picture and Our AI Search Engine Will Assist You
              </h4>
            </div>
            <SearchIcon className="dash-icon" onClick={()=>router.push("/search")}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
