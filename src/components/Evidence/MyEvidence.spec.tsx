import { render, screen } from '@testing-library/react';

import { MyEvidence } from './MyEvidence';

describe('MyEvidence', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<MyEvidence />);
    expect(screen.getByText('Welcome to MyEvidence!')).toBeTruthy();
  });
});