import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import DisclaimerBanner from "./DisclaimerBanner";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="lg:ml-60 pt-16 pb-56 lg:pb-48 px-4 md:px-6">
        <div className="py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      <DisclaimerBanner />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
