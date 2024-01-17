import { render, screen } from '@testing-library/react';

import { UpdateEvidence } from './UpdateEvidence';

describe('UpdateEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<UpdateEvidence />);
    expect(screen.getByText('Welcome to UpdateEvidence!')).toBeTruthy();
  });
});