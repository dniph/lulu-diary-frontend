import { render } from '@testing-library/react';
import ProfileLink from '../src/components/ProfileLink';

describe('ProfileLink', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders without crashing', () => {
    render(<ProfileLink username="testuser" />);
  });
});
