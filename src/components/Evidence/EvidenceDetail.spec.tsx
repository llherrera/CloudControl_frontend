import { render, screen } from '@testing-library/react';

import { EvidenceDetail } from './EvidenceDetail';

describe('EvidenceDetail', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<EvidenceDetail />);
    expect(screen.getByText('Welcome to EvidenceDetail!')).toBeTruthy();
  });
});