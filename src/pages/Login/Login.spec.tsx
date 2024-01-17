import { render, screen } from '@testing-library/react';

import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<LoginPage />);
    expect(screen.getByText('Welcome to LoginPage!')).toBeTruthy();
  });
});