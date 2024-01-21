import { render, screen } from '@testing-library/react';

import { POAI } from '../../src/pages/POAI/POAI';

describe('POAI', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<POAI />);
    expect(screen.getByText('Welcome to POAI!')).toBeTruthy();
  });
});