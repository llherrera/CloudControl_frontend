import { render, screen } from '@testing-library/react';

import { ModalTotalPDT } from '../../src/components/Modals/ModalTotalPDT';
import { ModalProgram } from '../../src/components/Modals/ModalProgram';
import { ModalSecretary } from '../../src/components/Modals/ModalSecretary';

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
