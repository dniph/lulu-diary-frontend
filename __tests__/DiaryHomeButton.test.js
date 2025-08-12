import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiaryHomeButton from '../src/components/DiaryHomeButton';

describe('DiaryHomeButton', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the login button when user is not logged in', async () => {
    render(<DiaryHomeButton />);
    // Espera a que aparezca el texto del botón de login
    const loginButton = await screen.findByText(/log in to view your diary/i);
    expect(loginButton).toBeInTheDocument();
  });
});
