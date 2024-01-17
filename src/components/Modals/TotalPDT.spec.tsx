import { render, screen } from '@testing-library/react';

import { ModalTotalPDT } from './ModalTotalPDT';

describe('ModalTotalPDT', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalTotalPDT />);
    expect(screen.getByText('Welcome to ModalTotalPDT!')).toBeTruthy();
  });
});