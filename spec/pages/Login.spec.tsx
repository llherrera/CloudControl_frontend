import { render, screen } from '@testing-library/react';

import { LoginPage } from '../../src/pages/Login/LoginPage';
import { RegisterPage } from '../../src/pages/Login/RegisterPage';

describe('LoginPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<LoginPage />);
    expect(screen.getByText('Welcome to LoginPage!')).toBeTruthy();
  });
});

describe('RegisterPage', () => {
  it('should render successfully', () => {
    expect.hasAssertions();
    render(<RegisterPage />);
    expect(screen.getByText('Welcome to RegisterPage!')).toBeTruthy();
  });
});