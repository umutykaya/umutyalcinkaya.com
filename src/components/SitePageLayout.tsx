import type { ReactNode } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type SitePageLayoutProps = {
  children: ReactNode;
};

const SitePageLayout = ({ children }: SitePageLayoutProps) => (
  <div className="min-h-screen bg-background relative">
    <AnimatedBackground />
    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  </div>
);

export default SitePageLayout;
