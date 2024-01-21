import { render, screen } from '@testing-library/react';

import { EvidenceDetail } from '../../src/components/Evidence/EvidenceDetail';
import { MyEvidence } from '../../src/components/Evidence/MyEvidence';

describe('EvidenceDetail', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<EvidenceDetail />);
    expect(screen.getByText('Welcome to EvidenceDetail!')).toBeTruthy();
  });
});


describe('MyEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<MyEvidence />);
    expect(screen.getByText('Welcome to MyEvidence!')).toBeTruthy();
  });
});
