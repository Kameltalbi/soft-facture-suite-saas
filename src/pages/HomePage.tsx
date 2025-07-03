
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { PricingSection } from '@/components/homepage/PricingSection';
import { FinalCtaSection } from '@/components/homepage/FinalCtaSection';
import { Footer } from '@/components/homepage/Footer';
import { Header } from '@/components/homepage/Header';
import { Chatbot } from '@/components/homepage/Chatbot';

const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est connecté, le rediriger vers le dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A9C89]"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default HomePage;
