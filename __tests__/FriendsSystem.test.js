import { render } from '@testing-library/react';
import FriendsSystem from '../src/components/FriendsSystem';

describe('FriendsSystem', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders without crashing', () => {
    render(<FriendsSystem username="testuser" />);
  });
});
