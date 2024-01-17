import { render, screen } from '@testing-library/react';

import { ModalSecretary } from './ModalSecretary';

describe('ModalSecretary', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<ModalSecretary />);
    expect(screen.getByText('Welcome to ModalSecretary!')).toBeTruthy();
  });
});