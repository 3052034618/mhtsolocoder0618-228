import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Marketplace from "@/pages/marketplace/Marketplace";
import CreatorDetail from "@/pages/marketplace/CreatorDetail";
import ChatIndex from "@/pages/chat/ChatIndex";
import ChatRoom from "@/pages/chat/ChatRoom";
import ContractPage from "@/pages/contract/ContractPage";
import Overview from "@/pages/dashboard/Overview";
import Listings from "@/pages/dashboard/creator/Listings";
import ListingEditor from "@/pages/dashboard/creator/ListingEditor";
import Orders from "@/pages/dashboard/creator/Orders";
import Deliverables from "@/pages/dashboard/creator/Deliverables";
import Finance from "@/pages/dashboard/creator/Finance";
import BrandProjects from "@/pages/dashboard/brand/Projects";
import BrandReview from "@/pages/dashboard/brand/Review";
import BrandPerformance from "@/pages/dashboard/brand/Performance";
import BrandFunds from "@/pages/dashboard/brand/Funds";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/creator/:id" element={<CreatorDetail />} />
        <Route path="/chat" element={<ChatIndex />} />
        <Route path="/chat/:projectId" element={<ChatRoom />} />
        <Route path="/contract/:projectId" element={<ContractPage />} />
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/creator/listings" element={<Listings />} />
        <Route path="/dashboard/creator/listings/new" element={<ListingEditor />} />
        <Route path="/dashboard/creator/listings/:id/edit" element={<ListingEditor />} />
        <Route path="/dashboard/creator/orders" element={<Orders />} />
        <Route path="/dashboard/creator/deliverables" element={<Deliverables />} />
        <Route path="/dashboard/creator/finance" element={<Finance />} />
        <Route path="/dashboard/brand/projects" element={<BrandProjects />} />
        <Route path="/dashboard/brand/review" element={<BrandReview />} />
        <Route path="/dashboard/brand/performance" element={<BrandPerformance />} />
        <Route path="/dashboard/brand/funds" element={<BrandFunds />} />
      </Routes>
    </Router>
  );
}
