import { render, screen } from '@testing-library/react';

import { LocationPopover } from '../../src/components/Popover/LocationPopover';

describe('LocationPopover', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
//    render(<LocationPopover />);
    expect(screen.getByText('Welcome to LocationPopover!')).toBeTruthy();
  });
});