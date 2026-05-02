import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import ContactSection from "@/components/ContactSection";
import BackToHome from "@/components/BackToHome";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-24 pb-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <BackToHome />
            <ContactSection />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
