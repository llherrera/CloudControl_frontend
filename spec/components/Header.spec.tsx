import { render, screen } from '@testing-library/react';

import { Header } from '../../src/components/Header/HeaderComponent';

describe('Header', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    //render(<Header />);
    expect(screen.getByText('Welcome to Header!')).toBeTruthy();
  });
});