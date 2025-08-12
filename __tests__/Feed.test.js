import { render, screen } from '@testing-library/react';
import Feed from '../src/components/Feed';

describe('Feed', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders loading state', () => {
    render(<Feed />);
    expect(screen.getByText(/cargando feed/i)).toBeInTheDocument();
  });
});
