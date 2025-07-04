
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Infinity, Pause } from 'lucide-react';

interface SubscriptionStatusBadgeProps {
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  organizationStatus: 'active' | 'suspended' | 'pending';
}

export function SubscriptionStatusBadge({ subscriptionStart, subscriptionEnd, organizationStatus }: SubscriptionStatusBadgeProps) {
  const getSubscriptionStatus = () => {
    // Si l'organisation est en attente, afficher "En attente"
    if (organizationStatus === 'pending') {
      return {
        status: 'pending',
        label: 'En attente',
        variant: 'secondary' as const,
        icon: <Pause className="h-3 w-3" />
      };
    }

    // Si l'organisation est suspendue
    if (organizationStatus === 'suspended') {
      return {
        status: 'suspended',
        label: 'Suspendu',
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3" />
      };
    }

    // Pour les organisations actives
    if (!subscriptionEnd) {
      return {
        status: 'unlimited',
        label: 'Illimité',
        variant: 'default' as const,
        icon: <Infinity className="h-3 w-3" />
      };
    }

    const today = new Date();
    const endDate = new Date(subscriptionEnd);
    const daysDiff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return {
        status: 'expired',
        label: 'Expiré',
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3" />
      };
    } else if (daysDiff <= 7) {
      return {
        status: 'expiring_soon',
        label: `Expire dans ${daysDiff}j`,
        variant: 'secondary' as const,
        icon: <Clock className="h-3 w-3" />
      };
    } else {
      return {
        status: 'active',
        label: 'Actif',
        variant: 'default' as const,
        icon: <CheckCircle className="h-3 w-3" />
      };
    }
  };

  const statusInfo = getSubscriptionStatus();

  return (
    <Badge variant={statusInfo.variant} className="flex items-center gap-1">
      {statusInfo.icon}
      {statusInfo.label}
    </Badge>
  );
}
