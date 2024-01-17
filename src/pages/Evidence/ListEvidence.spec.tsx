import { render, screen } from '@testing-library/react';

import { ListEvidence } from './ListEvidence';

describe('ListEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ListEvidence />);
    expect(screen.getByText('Welcome to ListEvidence!')).toBeTruthy();
  });
});