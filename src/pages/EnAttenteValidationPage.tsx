
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, Phone, MessageCircle } from 'lucide-react';

const EnAttenteValidationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Inscription en cours de validation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Merci pour votre inscription ! Votre compte a été créé avec succès et est maintenant 
              <strong className="text-[#6A9C89]"> en attente de validation</strong>.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Prochaines étapes :</h3>
              <div className="space-y-2 text-blue-800">
                <p>✅ Votre compte a été créé</p>
                <p>⏳ Validation de votre paiement en cours</p>
                <p>📧 Vous recevrez un email de confirmation dès l'activation</p>
                <p>🚀 Accès immédiat à votre tableau de bord</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Délai de validation :</h3>
              <p className="text-green-800">
                <strong>24 à 48 heures</strong> en moyenne (jours ouvrés)
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Besoin d'aide ou d'informations ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-[#6A9C89] rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Email</h4>
                <a 
                  href="mailto:contact@softfacture.com"
                  className="text-[#6A9C89] hover:underline text-sm"
                >
                  contact@softfacture.com
                </a>
              </Card>

              <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-[#6A9C89] rounded-full flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Téléphone</h4>
                <a 
                  href="tel:+21655053505"
                  className="text-[#6A9C89] hover:underline text-sm"
                >
                  +216 55 053 505
                </a>
              </Card>

              <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">WhatsApp</h4>
                <a 
                  href="https://wa.me/21655053055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline text-sm"
                >
                  Contactez-nous
                </a>
              </Card>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-[#6A9C89] border-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnAttenteValidationPage;
