import { render } from '@testing-library/react';
import Profile from '../src/components/Profile';

describe('Profile', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders without crashing', () => {
    render(<Profile username="testuser" />);
  });
});
