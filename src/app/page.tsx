import AboutSection from "./components/AboutSection/AboutSection";
import Announcement from "./components/Announcement/Announcement";
import BranchLocator from "./components/BranchLocator/BranchLocator";
import BrandsSection from "./components/BrandsSection/BrandsSection";
import ContactSection from "./components/ContactSection/ContactSection";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import NumbersSection from "./components/NumbersSection/NumbersSection";
import ServicesSection from "./components/ServicesSection/ServicesSection";
import SpecialsSection from "./components/SpecialsSection/SpecialsSection";

export default function Home() {
  return (
    <div>
      <Announcement />
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <NumbersSection />
      <SpecialsSection />
      <BrandsSection />
      <BranchLocator />
      <ContactSection />
      <Footer />
    </div>
  );
}
