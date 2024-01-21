import { render, screen } from '@testing-library/react';

import { NavBar } from '../../src/components/NavBar/NavBar';

describe('NavBar', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<NavBar />);
    expect(screen.getByText('Welcome to NavBar!')).toBeTruthy();
  });
});