import { render, screen } from '@testing-library/react';
import FriendRequests from '../src/components/FriendRequests';

describe('FriendRequests', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders friend requests', async () => {
    render(<FriendRequests currentUserId={1} />);
    expect(await screen.findByText(/solicitudes|requests/i)).toBeInTheDocument();
  });
});
