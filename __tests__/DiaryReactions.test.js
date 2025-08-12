import { render, screen } from '@testing-library/react';
import DiaryReactions from '../src/components/DiaryReactions';

describe('DiaryReactions', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  });
  afterEach(() => { jest.resetAllMocks(); });

  it('renders reaction buttons', async () => {
    render(<DiaryReactions username="test" diaryId={1} currentUserId={1} />);
    // Los botones usan title, no aria-label
    expect(await screen.findByTitle(/me gusta/i)).toBeInTheDocument();
  });
});
