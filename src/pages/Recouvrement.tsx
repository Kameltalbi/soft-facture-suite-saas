
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Recouvrement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recouvrement</h1>
        <p className="text-gray-600">Gestion des recouvrements et relances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page de Recouvrement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Cette page est prête pour votre développement personnalisé.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
