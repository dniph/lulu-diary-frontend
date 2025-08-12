import { render, screen } from '@testing-library/react';
import FriendsList from '../src/components/FriendsList';

describe('FriendsList', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders friends list', async () => {
    render(<FriendsList username="test" currentUserId={1} />);
    expect(await screen.findByText(/amigos|friends/i)).toBeInTheDocument();
  });
});
