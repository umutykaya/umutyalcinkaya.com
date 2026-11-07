import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type SitePageLayoutProps = {
  children: ReactNode;
  readingMode?: boolean;
};

const SitePageLayout = ({ children, readingMode = false }: SitePageLayoutProps) => (
  <div
    className={`relative min-h-screen ${
      readingMode ? "reading-layout bg-white text-neutral-900 dark:bg-[#191919] dark:text-neutral-100" : "bg-background"
    }`}
  >
    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  </div>
);

export default SitePageLayout;
