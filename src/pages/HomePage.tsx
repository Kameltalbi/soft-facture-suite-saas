
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { PricingSection } from '@/components/homepage/PricingSection';
import { FinalCtaSection } from '@/components/homepage/FinalCtaSection';
import { Footer } from '@/components/homepage/Footer';
import { Header } from '@/components/homepage/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default HomePage;
