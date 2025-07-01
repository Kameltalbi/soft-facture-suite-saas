
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building, UserCheck, Calendar } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company: string | null;
  created_at: string;
}

interface ClientStatsProps {
  clients: Client[];
}

export function ClientStats({ clients }: ClientStatsProps) {
  const stats = {
    totalClients: clients.length,
    companiesCount: clients.filter(c => c.company).length,
    individualsCount: clients.filter(c => !c.company).length,
    newThisMonth: clients.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total clients</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-[#6A9C89]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Entreprises</p>
              <p className="text-2xl font-bold text-blue-600">{stats.companiesCount}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Particuliers</p>
              <p className="text-2xl font-bold text-success">{stats.individualsCount}</p>
            </div>
            <UserCheck className="h-8 w-8 text-success" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-orange-600">{stats.newThisMonth}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
