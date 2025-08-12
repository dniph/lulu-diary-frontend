import { render, screen } from '@testing-library/react';
import Comments from '../src/components/Comments';

describe('Comments', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders comments button', async () => {
    render(<Comments username="test" diaryId={1} currentUserId={1} />);
    expect(await screen.findByRole('button')).toBeInTheDocument();
  });
});
