import { render, screen } from '@testing-library/react';
import FollowSystem from '../src/components/FollowSystem';

describe('FollowSystem', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders follow system', async () => {
    render(<FollowSystem username="test" currentUserId={1} />);
    // Hay varios textos, así que buscamos uno de ellos
    expect(await screen.findByText(/followers/i)).toBeInTheDocument();
  });
});
