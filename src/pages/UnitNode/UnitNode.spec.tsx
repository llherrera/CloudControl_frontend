import { render, screen } from '@testing-library/react';

import { UnitNodePage } from './UnitNodePage';

describe('UnitNodePage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<UnitNodePage />);
    expect(screen.getByText('Welcome to UnitNodePage!')).toBeTruthy();
  });
});