import { render, screen } from '@testing-library/react';

import { FileInput, FileFinancialInput, FilePhysicalInput } from '../../src/components/Inputs/File';
import { Input } from '../../src/components/Inputs/Input';
import { Select } from '../../src/components/Inputs/Select';

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


describe('Input', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Input />);
    expect(screen.getByText('Welcome to Input!')).toBeTruthy();
  });
});


describe('Select', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Select />);
    expect(screen.getByText('Welcome to Select!')).toBeTruthy();
  });
});
