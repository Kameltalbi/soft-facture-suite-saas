
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from '../useDashboardData';
import { useAuth } from '../useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock des dépendances
jest.mock('../useAuth');
jest.mock('@/integrations/supabase/client');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useDashboardData', () => {
  const mockProfile = {
    id: 'profile-1',
    user_id: 'user-1',
    organization_id: 'org-1',
    first_name: 'John',
    last_name: 'Doe',
    role: 'admin',
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      profile: mockProfile,
      user: null,
      session: null,
      organization: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn()
    });

    // Mock des réponses Supabase par défaut
    mockSupabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            lte: jest.fn().mockResolvedValue({
              data: [],
              error: null
            })
          }),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' }
          })
        })
      })
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDashboardData(2024));

    expect(result.current.loading).toBe(true);
    expect(result.current.kpiData.totalRevenue).toBe(0);
    expect(result.current.kpiData.currency.code).toBe('EUR');
    expect(result.current.chartData.caByCategory).toEqual([]);
  });

  it('should not fetch data when no organization_id', () => {
    mockUseAuth.mockReturnValue({
      profile: null,
      user: null,
      session: null,
      organization: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn()
    });

    renderHook(() => useDashboardData(2024));

    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it('should fetch and process invoice data correctly', async () => {
    const mockInvoices = [
      {
        id: 'inv-1',
        total_amount: 1000,
        tax_amount: 200,
        status: 'paid',
        client_id: 'client-1',
        date: '2024-06-15',
        clients: { name: 'Client A' },
        invoice_items: [
          {
            total_price: 500,
            products: { name: 'Product 1', category: 'Category A' },
            description: 'Product 1'
          }
        ]
      },
      {
        id: 'inv-2',
        total_amount: 2000,
        tax_amount: 400,
        status: 'draft',
        client_id: 'client-2',
        date: '2024-07-20',
        clients: { name: 'Client B' },
        invoice_items: [
          {
            total_price: 1000,
            products: { name: 'Product 2', category: 'Category B' },
            description: 'Product 2'
          }
        ]
      }
    ];

    const mockQuotes = [
      { id: 'quote-1', date: '2024-05-10' },
      { id: 'quote-2', date: '2024-08-15' }
    ];

    // Configuration des mocks pour les différentes requêtes
    let callCount = 0;
    mockSupabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'currencies') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Not found' }
                })
              })
            })
          })
        };
      }
      
      if (table === 'invoices') {
        callCount++;
        if (callCount === 1) {
          // Première requête : factures avec clients
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                gte: jest.fn().mockReturnValue({
                  lte: jest.fn().mockResolvedValue({
                    data: mockInvoices,
                    error: null
                  })
                })
              })
            })
          };
        } else if (callCount === 2) {
          // Deuxième requête : factures avec items et produits
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                gte: jest.fn().mockReturnValue({
                  lte: jest.fn().mockResolvedValue({
                    data: mockInvoices,
                    error: null
                  })
                })
              })
            })
          };
        } else {
          // Requêtes pour comparaison mensuelle
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                gte: jest.fn().mockReturnValue({
                  lte: jest.fn().mockResolvedValue({
                    data: [],
                    error: null
                  })
                })
              })
            })
          };
        }
      }
      
      if (table === 'quotes') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              gte: jest.fn().mockReturnValue({
                lte: jest.fn().mockResolvedValue({
                  data: mockQuotes,
                  error: null
                })
              })
            })
          })
        };
      }

      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lte: jest.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          })
        })
      };
    });

    const { result } = renderHook(() => useDashboardData(2024));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier les KPIs
    expect(result.current.kpiData.totalInvoices).toBe(2);
    expect(result.current.kpiData.totalRevenue).toBe(3000);
    expect(result.current.kpiData.totalEncaisse).toBe(1000); // Seule la facture payée
    expect(result.current.kpiData.totalVat).toBe(600);
    expect(result.current.kpiData.totalQuotes).toBe(2);
    expect(result.current.kpiData.activeClients).toBe(2);

    // Vérifier les données des graphiques
    expect(result.current.chartData.caByCategory).toHaveLength(2);
    expect(result.current.chartData.caByProduct).toHaveLength(2);
    expect(result.current.chartData.top20Clients).toHaveLength(2);
  });

  it('should handle errors gracefully', async () => {
    mockSupabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            lte: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      })
    });

    const { result } = renderHook(() => useDashboardData(2024));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Les valeurs par défaut doivent être conservées en cas d'erreur
    expect(result.current.kpiData.totalRevenue).toBe(0);
    expect(result.current.chartData.caByCategory).toEqual([]);
  });

  it('should refetch data when year changes', async () => {
    const { rerender } = renderHook(
      ({ year }) => useDashboardData(year),
      { initialProps: { year: 2024 } }
    );

    // Changer l'année
    rerender({ year: 2023 });

    // Vérifier que les requêtes sont refaites
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('invoices');
    });
  });
});
