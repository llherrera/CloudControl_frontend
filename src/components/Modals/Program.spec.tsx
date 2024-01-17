import { render, screen } from '@testing-library/react';

import { ModalProgram } from './ModelProgram';

describe('ModalProgram', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalProgram />);
    expect(screen.getByText('Welcome to ModalProgram!')).toBeTruthy();
  });
});