import { render, screen } from '@testing-library/react';

import { LocationPopover } from './LocationPopover';

describe('LocationPopover', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
//    render(<LocationPopover />);
    expect(screen.getByText('Welcome to LocationPopover!')).toBeTruthy();
  });
});