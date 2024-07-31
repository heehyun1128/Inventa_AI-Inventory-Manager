
import MiniDrawer from "@/components/Drawer";
import "../globals.css"
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main style={{ width:"90vw", marginLeft:"80px"}}>
      <MiniDrawer />
      <div >
        <div >{children}</div>
      </div>
      
    </main>
  );
};

export default Layout;
