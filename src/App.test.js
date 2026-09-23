import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { MovieProvider } from './Contexts/MovieContext';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
  );
});

test('renders the navbar', () => {
  render(
    <MemoryRouter>
      <MovieProvider><App /></MovieProvider>
    </MemoryRouter>
  );
  const nav = within(screen.getByRole('navigation'));
  expect(nav.getByText('FAVO')).toBeInTheDocument();
  expect(nav.getByText('Favorites')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
