export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'validated';

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
}

export const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  paid: { label: 'Payé', variant: 'default' as const },
  overdue: { label: 'En retard', variant: 'destructive' as const },
  partially_paid: { label: 'Payé P.', variant: 'outline' as const },
  validated: { label: 'Validée', variant: 'success' as const }
};

export const months = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];