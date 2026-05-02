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
        <div className="pt-16">
          <div className="container mx-auto px-6">
            <BackToHome />
          </div>
          <ContactSection />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
