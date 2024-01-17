import { render, screen } from '@testing-library/react';

import { EvidencePage } from './EvidencePage';

describe('EvidencePage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<EvidencePage />);
    expect(screen.getByText('Welcome to EvidencePage!')).toBeTruthy();
  });
});