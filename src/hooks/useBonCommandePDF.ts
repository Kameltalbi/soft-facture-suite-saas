
import { useCurrency } from '@/contexts/CurrencyContext';
import { BonCommandeFournisseur } from '@/types/bonCommande';

export const useBonCommandePDF = () => {
  const { currency } = useCurrency();

  const generateBonCommandePDF = (
    bonCommande: BonCommandeFournisseur,
    fournisseur?: any
  ) => {
    return {
      bonCommande,
      fournisseur
    };
  };

  const exportToPDF = (bonCommande: BonCommandeFournisseur) => {
    // Pour l'instant, on génère un PDF simple avec window.print
    // Dans une vraie application, on utiliserait react-pdf
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const calculateTotals = () => {
      const totalHT = bonCommande.lignes.reduce((sum, ligne) => sum + ligne.totalHT, 0);
      const remiseAmount = (totalHT * (bonCommande.remise || 0)) / 100;
      const totalHTApresRemise = totalHT - remiseAmount;
      const totalTVA = bonCommande.lignes.reduce((sum, ligne) => sum + (ligne.totalHT * ligne.tva / 100), 0);
      
      return {
        totalHT,
        remiseAmount,
        totalHTApresRemise,
        totalTVA,
        totalTTC: bonCommande.montantTTC
      };
    };

    const totaux = calculateTotals();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bon de commande ${bonCommande.numero}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #6A9C89;
              padding-bottom: 20px;
            }
            .title {
              color: #6A9C89;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 14px;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-column {
              width: 48%;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .field {
              margin-bottom: 8px;
            }
            .label {
              font-weight: bold;
              color: #666;
              font-size: 12px;
            }
            .value {
              color: #333;
              font-size: 14px;
            }
            .status {
              background: #E8F5E8;
              color: #6A9C89;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              display: inline-block;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f5f5f5; 
              font-weight: bold;
              color: #333;
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            .totals {
              float: right;
              width: 300px;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .grand-total {
              font-weight: bold;
              font-size: 16px;
              color: #6A9C89;
              border-top: 2px solid #6A9C89;
              padding-top: 10px;
              margin-top: 10px;
            }
            .remarks {
              margin-top: 30px;
              clear: both;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">BON DE COMMANDE</div>
            <div class="subtitle">N° ${bonCommande.numero}</div>
            <div class="subtitle">Date: ${formatDate(bonCommande.dateCommande)}</div>
          </div>

          <div class="info-section">
            <div class="info-column">
              <div class="section-title">Informations de commande</div>
              <div class="field">
                <div class="label">Numéro:</div>
                <div class="value">${bonCommande.numero}</div>
              </div>
              <div class="field">
                <div class="label">Date:</div>
                <div class="value">${formatDate(bonCommande.dateCommande)}</div>
              </div>
              <div class="field">
                <div class="label">Statut:</div>
                <div class="status">${bonCommande.statut}</div>
              </div>
            </div>

            <div class="info-column">
              <div class="section-title">Fournisseur</div>
              <div class="field">
                <div class="label">Nom:</div>
                <div class="value">${bonCommande.fournisseurNom}</div>
              </div>
            </div>
          </div>

          <div class="section-title">Articles commandés</div>
          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix unitaire HT</th>
                <th>TVA (%)</th>
                <th>Total HT</th>
              </tr>
            </thead>
            <tbody>
              ${bonCommande.lignes.map(ligne => `
                <tr>
                  <td>${ligne.designation}</td>
                  <td>${ligne.quantite}</td>
                  <td>${formatCurrency(ligne.prixUnitaireHT)}</td>
                  <td>${ligne.tva}%</td>
                  <td>${formatCurrency(ligne.totalHT)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Total HT:</span>
              <span>${formatCurrency(totaux.totalHT)}</span>
            </div>
            ${bonCommande.remise && bonCommande.remise > 0 ? `
              <div class="total-row">
                <span>Remise (${bonCommande.remise}%):</span>
                <span>-${formatCurrency(totaux.remiseAmount)}</span>
              </div>
              <div class="total-row">
                <span>Total HT après remise:</span>
                <span>${formatCurrency(totaux.totalHTApresRemise)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Total TVA:</span>
              <span>${formatCurrency(totaux.totalTVA)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total TTC:</span>
              <span>${formatCurrency(totaux.totalTTC)}</span>
            </div>
          </div>

          ${bonCommande.remarques ? `
            <div class="remarks">
              <div class="section-title">Remarques</div>
              <div class="value">${bonCommande.remarques}</div>
            </div>
          ` : ''}

          <div class="footer">
            Bon de commande généré le ${new Date().toLocaleDateString('fr-FR')}
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  };

  return {
    generateBonCommandePDF,
    exportToPDF
  };
};
