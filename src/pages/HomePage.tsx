
import { Header } from '@/components/homepage/Header';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { PricingSection } from '@/components/homepage/PricingSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { FinalCtaSection } from '@/components/homepage/FinalCtaSection';
import { Footer } from '@/components/homepage/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default HomePage;
