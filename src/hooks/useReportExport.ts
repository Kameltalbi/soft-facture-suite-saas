
import { useCurrency } from '@/contexts/CurrencyContext';

export const useReportExport = () => {
  const { currency } = useCurrency();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Échapper les virgules et les guillemets
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (reportTitle: string, data: any[]) => {
    // Pour l'instant, on génère un PDF simple avec window.print
    // Dans une vraie application, on utiliserait react-pdf ou jsPDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
          <h1>${reportTitle}</h1>
          <table>
            ${data.length > 0 ? `
              <thead>
                <tr>
                  ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${data.map(row => `
                  <tr>
                    ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            ` : '<tr><td>Aucune donnée disponible</td></tr>'}
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return {
    exportToCSV,
    exportToPDF,
    formatCurrency
  };
};
