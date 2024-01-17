import { render, screen } from '@testing-library/react';

import { AddPDTPage } from './AddPDT';

describe('AddPDTPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<AddPDTPage />);
    expect(screen.getByText('Welcome to AddPDTPage!')).toBeTruthy();
  });
});