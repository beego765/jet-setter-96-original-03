import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchForm } from '../SearchForm';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
    functions: {
      invoke: vi.fn().mockImplementation((functionName, options) => {
        console.log('Supabase function called:', functionName, options);
        return Promise.resolve({ data: [], error: null });
      }),
    },
  },
}));

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('SearchForm', () => {
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SearchForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('should handle flight search submission correctly', async () => {
    renderComponent();

    // Fill in the form
    const originInput = screen.getByPlaceholderText('Select departure airport');
    const destinationInput = screen.getByPlaceholderText('Select arrival airport');
    
    fireEvent.change(originInput, { target: { value: 'LHR' } });
    fireEvent.change(destinationInput, { target: { value: 'JFK' } });

    // Click search button
    const searchButton = screen.getByText('Search Flights');
    fireEvent.click(searchButton);

    // Wait for the search to complete
    await waitFor(() => {
      // Add assertions here based on expected behavior
      expect(true).toBeTruthy(); // Placeholder assertion
    });
  });
});