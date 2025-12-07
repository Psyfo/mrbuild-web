import AboutSection from './components/AboutSection/AboutSection';
import BranchLocator from './components/BranchLocator/BranchLocator';
import BrandsSection from './components/BrandsSection/BrandsSection';
import ContactSection from './components/ContactSection/ContactSection';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import NumbersSection from './components/NumbersSection/NumbersSection';
import ServicesSection from './components/ServicesSection/ServicesSection';
import SpecialsSection from './components/SpecialsSection/SpecialsSection';

// page metadata
export const metadata = {
  title: 'MrBuild | Home',
  description:
    'Welcome to MrBuild, your one-stop solution for all construction needs.',
  keywords: 'construction, building materials, home improvement, MrBuild',
  authors: [
    {
      name: 'MrBuild Team',
      url: 'https://mrbuild.co.za',
    },
    {},
  ],
  openGraph: {
    title: 'MrBuild | Home',
    description:
      'Welcome to MrBuild, your one-stop solution for all construction needs.',
    url: 'https://mrbuild.co.za',
    siteName: 'MrBuild',
    images: [
      {
        url: 'https://mrbuild.co.za/images/logo_mrbuild.svg',
        width: 1200,
        height: 630,
        alt: 'MrBuild Home Page',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MrBuild | Home',
    description:
      'Welcome to MrBuild, your one-stop solution for all construction needs.',
    images: ['https://mrbuild.co.za/images/logo_mrbuild.svg'],
    creator: 'Mr Build ZA',
    site: 'https://mrbuild.co.za',
  },
};

export default function Home() {
  return (
    <div>
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
