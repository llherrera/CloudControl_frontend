import { render, screen } from '@testing-library/react';

import { FileInput, FileFinancialInput, FilePhysicalInput } from './File';

describe('FileInput', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<FileInput />);
    expect(screen.getByText('Welcome to FileInput!')).toBeTruthy();
  });
});

describe('FileFinancialInput', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<FileFinancialInput />);
    expect(screen.getByText('Welcome to FileFinancialInput!')).toBeTruthy();
  });
});

describe('FilePhysicalInput', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<FilePhysicalInput />);
    expect(screen.getByText('Welcome to FilePhysicalInput!')).toBeTruthy();
  });
});