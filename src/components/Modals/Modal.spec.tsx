import { render, screen } from '@testing-library/react';

import { ModalTotalPDT } from './ModalTotalPDT';
import { ModalProgram } from './ModalProgram';
import { ModalSecretary } from './ModalSecretary';

describe('ModalTotalPDT', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalTotalPDT />);
    expect(screen.getByText('Welcome to ModalTotalPDT!')).toBeTruthy();
  });
});

describe('ModalProgram', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalProgram />);
    expect(screen.getByText('Welcome to ModalProgram!')).toBeTruthy();
  });
});

describe('ModalSecretary', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalSecretary />);
    expect(screen.getByText('Welcome to ModalSecretary!')).toBeTruthy();
  });
});
